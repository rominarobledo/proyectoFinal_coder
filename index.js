const cards = document.getElementById('cards')
const templateCard = document.getElementById('template-card').content
const fragment = document.createDocumentFragment()
const items = document.getElementById('items')
const footer = document.getElementById('footer')
const templateFooter = document.getElementById('template-footer').content
const templeteCarrito = document.getElementById('template-carrito').content
let carrito = {}
document.addEventListener('DOMContentLoaded', () => {
    fetchData()
    if(localStorage.getItem('carrito')){
        carrito = JSON.parse(localStorage.getItem('carrito'))
        pintarCarrito()
    }
})
items.addEventListener('click', e =>{
    btnAccion(e)
})
cards.addEventListener('click', e => {
    addCarrito(e)
})
const fetchData = async () => {
    try {
        const res = await fetch('api.json')
        const data = await res.json()
        //console.log(data)
        pintarCards(data)
    } catch (error) {
        console.log(error)
    }
}
// Pintar productos
const pintarCards = data => {
    data.forEach(producto => {
        console.log(producto)
        templateCard.querySelector('h5').textContent = producto.title
        templateCard.querySelector('p').textContent = producto.precio
        templateCard.querySelector('.btn-dark').dataset.id = producto.id
        templateCard.querySelector('img').setAttribute("src", producto.thumbnailUrl)
        const clone = templateCard.cloneNode(true)
        fragment.appendChild(clone)
    })
    cards.appendChild(fragment)
}

const addCarrito = e => {
    // console.log (e.target)
    //console.log(e.target.classList.contains('btn-dark'))
    if (e.target.classList.contains('btn-dark')) {
        setCarrito(e.target.parentElement)
    }
    e.stopPropagation()
}

const setCarrito = objeto => {
    //console.log(objeto)
    const producto = {
        id: objeto.querySelector('.btn-dark').dataset.id,
        title: objeto.querySelector('h5').textContent,
        precio: objeto.querySelector('p').textContent,
        cantidad: 1
    }
    if (carrito.hasOwnProperty(producto.id)) {
        producto.cantidad = carrito[producto.id].cantidad + 1
    }
    carrito[producto.id] = { ...producto }
    pintarCarrito()

    //console.log(producto)
}
const pintarCarrito = () => {
    //console.log(carrito)
    items.innerHTML = ''
    Object.values(carrito).forEach(producto => {
        templeteCarrito.querySelector('th').textContent = producto.id
        templeteCarrito.querySelectorAll('td')[0].textContent = producto.title
        templeteCarrito.querySelectorAll('td')[1].textContent = producto.cantidad
        templeteCarrito.querySelector('.btn-info').dataset.id = producto.id
        templeteCarrito.querySelector('.btn-danger').dataset.id = producto.id
        templeteCarrito.querySelector('span').textContent = producto.cantidad * producto.precio
        const clone = templeteCarrito.cloneNode(true)
        fragment.appendChild(clone)
    })
    items.appendChild(fragment)
    pintarFooter()
    localStorage.setItem('carrito',JSON.stringify(carrito))
}
const pintarFooter = () => {
    footer.innerHTML = ''
    if (Object.keys(carrito).length === 0) {
        footer.innerHTML = `
        <th scope="row" colspan="5">carrito - vacio ¡comience a comprar!</th>`
        return
    }
    const ncantidad = Object.values(carrito).reduce((acc, {cantidad}) => acc + cantidad, 0)
    const nprecio = Object.values(carrito).reduce((acc, { cantidad, precio }) => acc + cantidad * precio, 0)

    templateFooter.querySelectorAll('td')[0].textcontent = ncantidad
    templateFooter.querySelector('span').textContent = nprecio
    const clone = templateFooter.cloneNode(true)
    fragment.appendChild(clone)
    footer.appendChild(fragment)
    console.log(nprecio)
    const btnVaciar = document.getElementById('vaciar-carrito')
    btnVaciar.addEventListener('click', () => {
        carrito = {}
    pintarCarrito()})
}
const btnAccion = e =>{
    console.log(e.target)
    if(e.target.classList.contains('btn-info')){
        //carrito(carrito[e.target.dataset.id])
        const producto = carrito[e.target.dataset.id]
        producto.cantidad++ 
        carrito[e.target.dataset.id] = {...producto}
        pintarCarrito()
    }
    if(e.target.classList.contains('btn-danger')){
        const producto = carrito[e.target.dataset.id]
producto.cantidad--
if(producto.cantidad === 0 ){
    delete carrito[e.target.dataset.id]
    pintarCarrito()

}
}
e.stopPropagation()
}