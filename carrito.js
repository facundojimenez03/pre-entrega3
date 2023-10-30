document.addEventListener('DOMContentLoaded', () => {
  const listaProductos = document.getElementById('lista-productos');
  const listaCarrito = document.getElementById('lista-carrito');
  const total = document.getElementById('total');
  const vaciarCarritoBtn = document.getElementById('vaciar-carrito');
  const comprarBtn = document.getElementById('comprar-btn');

  let carrito = [];

  cargarCarritoDesdeLocalStorage();
  mostrarCarrito();

  // Cargar productos desde el archivo JSON
  fetch('productos.json')
      .then(response => response.json())
      .then(productos => {
          productos.forEach(producto => {
              const li = document.createElement('li');
              li.innerHTML = `<span>${producto.nombre} - $${producto.precio.toFixed(2)}</span> <button class="agregar">Agregar al Carrito</button>`;
              listaProductos.appendChild(li);
          });
      })
      .catch(error => console.error('Error al cargar los productos:', error));

  listaProductos.addEventListener('click', agregarAlCarrito);
  listaCarrito.addEventListener('click', (item) => {
      if (item.target.classList.contains('eliminar')) {
          const nombre = item.target.parentElement.querySelector('.nombre').textContent;
          eliminarDelCarrito(nombre);
      }
  });
  vaciarCarritoBtn.addEventListener('click', vaciarCarrito);
  comprarBtn.addEventListener('click', comprar);

  function agregarAlCarrito(item) {
      if (item.target.classList.contains('agregar')) {
          const producto = item.target.parentElement;
          const nombre = producto.querySelector('span').textContent;
          const precio = parseFloat(nombre.split('-')[1].trim().substring(1));

          const productoEnCarrito = carrito.find(item => item.nombre === nombre);

          if (productoEnCarrito) {
              productoEnCarrito.cantidad++;
          } else {
              carrito.push({ nombre, precio, cantidad: 1 });
          }

          guardarCarritoEnLocalStorage();
          mostrarCarrito();
      }
  }

  function eliminarDelCarrito(nombre) {
      const productoEnCarrito = carrito.find(item => item.nombre === nombre);

      if (productoEnCarrito) {
          if (productoEnCarrito.cantidad > 1) {
              productoEnCarrito.cantidad--;
          } else {
              const index = carrito.indexOf(productoEnCarrito);
              carrito.splice(index, 1);
          }

          guardarCarritoEnLocalStorage();
          mostrarCarrito();
      }
  }

  function mostrarCarrito() {
      listaCarrito.innerHTML = '';
      let sumaTotal = 0;

      carrito.forEach(item => {
          const li = document.createElement('li');
          li.innerHTML = `<span class="nombre">${item.nombre}</span> x${item.cantidad} - $${(item.precio * item.cantidad).toFixed(2)} <button class="eliminar">Eliminar</button>`;
          listaCarrito.appendChild(li);
          sumaTotal += item.precio * item.cantidad;
      });

      total.textContent = sumaTotal.toFixed(2);
  }

  function guardarCarritoEnLocalStorage() {
      localStorage.setItem('carrito', JSON.stringify(carrito));
  }

  function cargarCarritoDesdeLocalStorage() {
      const carritoGuardado = localStorage.getItem('carrito');

      if (carritoGuardado) {
          carrito = JSON.parse(carritoGuardado);
      }
  }

  function vaciarCarrito() {
      carrito = [];
      guardarCarritoEnLocalStorage();
      mostrarCarrito();
  }

  function comprar() {
    Toastify({
      text: "¡Compra con éxito!",
      duration: 5000,
      destination: "https://github.com/apvarun/toastify-js",
      newWindow: true,
      close: true,
      gravity: "top",
      position: "left",
      stopOnFocus: true,
      style: {
          background: "#00ff00",
      },
  }).showToast();
      vaciarCarrito();
  }
});
