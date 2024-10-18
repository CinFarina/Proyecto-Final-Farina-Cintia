// Variables para almacenar los productos del carrito y el total
let carrito = [];
let total = 0;

// Seleccionar los elementos del DOM
const botonesAgregarCarrito = document.querySelectorAll('.agregar-carrito');
const listaCarrito = document.getElementById('carrito');
const totalElemento = document.getElementById('total');
const mensajeElemento = document.getElementById('mensaje');
const botonFinalizarCompra = document.getElementById('finalizar-compra');
const botonCancelarCompra = document.getElementById('cancelar-compra');

// Cargar el carrito desde localStorage al iniciar
function cargarCarrito() {
    const carritoGuardado = localStorage.getItem('carrito');
    if (carritoGuardado) {
        carrito = JSON.parse(carritoGuardado);
        total = carrito.reduce((acc, item) => acc + item.precio, 0);
        actualizarCarrito();
    }
}

// Función para agregar producto al carrito
botonesAgregarCarrito.forEach(boton => 
    boton.addEventListener('click', e => {
        const producto = e.target.dataset.producto;
        const precio = parseFloat(e.target.dataset.precio);

        // Agregar producto al carrito
        carrito.push({ producto, precio });

        // Actualizar total
        total += precio;

        // Guardar el carrito en localStorage
        localStorage.setItem('carrito', JSON.stringify(carrito));

        // Actualizar la vista del carrito
        actualizarCarrito();
    })
);

// Función para actualizar el carrito en el DOM
const actualizarCarrito = () => {
    listaCarrito.innerHTML = carrito.map(item => `<li>${item.producto} - $${item.precio.toFixed(2)}</li>`).join('');
    totalElemento.textContent = total.toFixed(2);
    mensajeElemento.textContent = ""; // Limpiar el mensaje al actualizar
};

// Función para finalizar la compra
botonFinalizarCompra.addEventListener('click', () => {
    if (carrito.length === 0) {
        mensajeElemento.textContent = "El carrito está vacío.";
        return;
    }

    carrito = [];
    total = 0;
    localStorage.removeItem('carrito');
    actualizarCarrito();
    mensajeElemento.textContent = "Compra finalizada. ¡Gracias por tu compra!";
});

// Función para cancelar toda la compra
botonCancelarCompra.addEventListener('click', () => {
    carrito = [];
    total = 0;
    localStorage.removeItem('carrito');
    actualizarCarrito();
    mensajeElemento.textContent = "Compra cancelada.";
});

// Cargar el carrito al iniciar la página
cargarCarrito();

// Función para cargar productos desde una API externa usando Axios
async function cargarProductos() {
    try {
        const response = await axios.get('productos.json'); 
        const productos = response.data; 
        mostrarProductos(productos);
    } catch (error) {
        console.error('Error al cargar los productos:', error);
        mensajeElemento.textContent = "Hubo un error al cargar los productos.";
    }
}

// Función para mostrar productos en el DOM
function mostrarProductos(productos) {
    const menu = document.getElementById('menu');
    menu.innerHTML = ''; 

    productos.forEach(producto => {
        const div = document.createElement('div');
        div.classList.add('producto');
        div.innerHTML = `
            <h2>${producto.nombre}</h2>
            <p>Precio: $${producto.precio.toFixed(2)}</p>
            <button class="agregar-carrito" data-producto="${producto.nombre}" data-precio="${producto.precio}">Agregar al Carrito</button>
        `;
        menu.appendChild(div);
    });
}

// Llama a la función para cargar los productos al inicio
cargarProductos();