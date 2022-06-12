const divProductos = document.getElementById("divProductos")
const contenedorTabla = document.getElementById("tablaCarrito")
const totalCarrito = document.getElementById("totalCarrito")
const botonFinalizar = document.getElementById('botonFinalizar')
const botonAgregar = document.getElementById('botonAgregar')
const botonPagar = document.getElementById('pagar')
const botonVaciar = document.getElementById('vaciar')
let dataProductos
let carrito = JSON.parse(localStorage.getItem("carrito"))

// <------------------------ DOM ------------------------>

document.addEventListener('DOMContentLoaded', () => { 
    traerJson()
    mostrarCarrito()
    totalProductos()
});

// <------------------------ Traer productos del JSON ------------------------>

const traerJson = async() => { 
    let response = await fetch("js/productos.json")
    let data = await response.json()
    dataProductos = data
    mostrarProducto(dataProductos)
}   

// <------------------------ Funcion para mostrar productos en HTML ------------------------>

function mostrarProducto(array){
    array.forEach(producto => {
    divProductos.innerHTML += `
        <div class="col mb-5">
        <div class="card h-100">
            <img class="card-img-top" src="${producto.img}" alt="..." />
            <div class="card-body p-4">
            <div class="text-center">
                <h5 class="fw-bolder">${producto.nombre}</h5>
                 $${producto.precio}
            </div>
        </div>
        <div class="card-footer p-4 pt-0 border-top-0 bg-transparent">
            <div class="text-center">
                <button onclick="agregar(${producto.id})" class="btn btn-outline-dark mt-auto">Agregar al carrito</button>
            </div>
        </div>
  
 `
 }); 
}
    
// <------------------------ Funcion para mostrar los productos elegidos en el carrito ------------------------>

function mostrarCarrito(){
    let carrito = capturarStorage()
    contenedorTabla.innerHTML =""
    carrito.forEach(producto => {
        contenedorTabla.innerHTML += ` 
        <tr>
            <th scope="row"><img src="${producto.img}" width= 100px></th>
            <td>${producto.cantidad}</td>
            <td>${producto.nombre}</td>
            <td>${producto.precio}</td>
            <td>${producto.precio * producto.cantidad}</td>
            <td><button onclick="eliminarCarrito(${producto.id})">Eliminar</button></td>            
        </tr>
       `
    })
}

// <------------------------ Storage ------------------------>

function capturarStorage(){
    return JSON.parse(localStorage.getItem("carrito")) || []

}

function guardarStorage(array){
    localStorage.setItem("carrito", JSON.stringify(array))
}

// <------------------------ Funcion para agregar productos en el carrito ------------------------>

function agregar(idParam){
    let carrito = capturarStorage()
    if(productoEnCarrito(idParam)){
        incrementarCantidad(idParam)
        Toastify({
            text: "Producto agregado al carrito",
            duration: 2000
            }).showToast();
    }else{
    let productoEncontrado = dataProductos.find(producto=>producto.id==idParam)
    carrito.push({...productoEncontrado, cantidad:1 })
    guardarStorage(carrito)
    mostrarCarrito()
    Toastify({
        text: "Producto agregado al carrito",
        duration: 1000
        }).showToast();
    }
    totalProductos()
}

// <------------------------ Funcion para incrementar cantidad ------------------------>

function incrementarCantidad(id){
    let carrito = capturarStorage()
    const indice = carrito.findIndex(producto=>producto.id==id)
    carrito[indice].cantidad++
    guardarStorage(carrito)
    mostrarCarrito()
}                

// <------------------------ Funcion para eliminar productos del carrito ------------------------>

function eliminarCarrito(id){
    let carrito = capturarStorage()
    let resultado = carrito.filter(producto=> producto.id !=id)
    guardarStorage(resultado)
    mostrarCarrito()
    totalProductos()
}

function productoEnCarrito(id){
    let carrito=capturarStorage()
    return carrito.some(producto=>producto.id==id)
}

// <------------------------ Funcion para ver el total de la compra ------------------------>

function totalProductos(){
    let carrito=capturarStorage()
    let total = carrito.reduce(
        (acc, producto) => acc + producto.cantidad * producto.precio, 0
    )
   if (total != 0){
    totalCarrito.innerHTML = total
    botonFinalizar.addEventListener('click',() => { 
        Swal.fire({
            icon: 'success',
            title: '¡Compra Exitosa!',
            footer: '<b>Te esperamos en nuestro local para abonar y retirar.</b>'
        })
        localStorage.clear();
        mostrarCarrito();
        totalProductos();
    })
    }else {
        totalCarrito.innerHTML = total
        botonFinalizar.addEventListener('click',() => {
            Swal.fire({
                icon: 'error',
                title: 'Carrito vacio',
            })
    })
    }

}

// <------------------------ Funcion para pagar API mercado pago ------------------------>

botonPagar.addEventListener('click', () => pagar())

async function pagar() {
    const productosToMap = carrito.map(Element =>{
        let nuevoElemento = 
        {
            title: Element.precio,
            description: '',
            picture_url: Element.img,
            category_id: Element.id,
            quantity: Element.cantidad,
            currency_id: "ARS",
            unit_price: Element.precio,
        };  
        return nuevoElemento
    }); 
    let response = await fetch ("https://api.mercadopago.com/checkout/preferences", 
    {
        method: "POST",
        headers: {
        Authorization: "Bearer TEST-680675151110839-052307-64069089337ab3707ea2f547622a1b6a-60191006",        
        },
        body: JSON.stringify({
            items: productosToMap,

        }),
    });
    let data = await response.json();
    window.open(data.init_point, "_blank")
}

// <------------------------ Vaciar carrito ------------------------>

botonVaciar.addEventListener('click', () => {
    Swal.fire({
        icon: 'error',
        title: 'Carrito vacio',
    })
    localStorage.clear();
    mostrarCarrito();
    totalProductos();
})


const formulario =document.querySelector('#formulario')
const botonBuscar =document.querySelector('#buscar')
const resultado = document.querySelector('#resultado')

// <------------------------ Buscador ------------------------>

const buscar = ()=>{
    resultado.innerHTML = '';
    const texto = formulario.value.toLowerCase();
    
    for (let producto of dataProductos){
        let nombre = producto.nombre.toLowerCase();
        if(nombre.indexOf(texto) !== -1){
            resultado.innerHTML += `
            <div class="col mb-5">
        <div class="card h-100">
            <img class="card-img-top" src="${producto.img}" alt="..." />
            <div class="card-body p-4">
            <div class="text-center">
                <h5 class="fw-bolder">${producto.nombre}</h5>
                 $${producto.precio}
            </div>
        </div>
        <div class="card-footer p-4 pt-0 border-top-0 bg-transparent">
            <div class="text-center">
                <button onclick="agregar(${producto.id})" class="btn btn-outline-dark mt-auto">Agregar al carrito</button>
            </div>
        </div>
            `
        }
    }
    if(resultado.innerHTML === ''){
        resultado.innerHTML += `
        <p>Producto no encontrado.</p>
        `
    }
}

botonBuscar.addEventListener('click', buscar)
