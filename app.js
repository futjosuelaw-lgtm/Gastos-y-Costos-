const formulario = document.querySelector("#formulario");
const lista = document.querySelector("#lista-movimientos");
const avisoVacio = document.querySelector("#vacio");
const dialogo = document.querySelector("#dialogo-edicion");
const formularioEdicion = document.querySelector("#formulario-edicion");

let movimientos = JSON.parse(localStorage.getItem("movimientos")) || [];
let idEnEdicion = null;

formulario.addEventListener("submit", (evento) => {
  evento.preventDefault();

  movimientos.push({
    id: Date.now(),
    descripcion: document.querySelector("#descripcion").value.trim(),
    monto: Number(document.querySelector("#monto").value),
    tipo: document.querySelector("#tipo").value,
    categoria: document.querySelector("#categoria").value
  });

  guardarMovimientos();
  formulario.reset();
  mostrarMovimientos();
});

function mostrarMovimientos() {
  lista.innerHTML = "";

  let ingresos = 0;
  let gastos = 0;

  movimientos.forEach((movimiento) => {
    const fila = document.createElement("li");
    fila.className = "movimiento";

    const detalle = document.createElement("span");
    detalle.className = "detalle";

    const nombre = document.createElement("strong");
    nombre.textContent = movimiento.descripcion;

    const categoria = document.createElement("small");
    categoria.textContent =
      `${movimiento.categoria} · ${movimiento.tipo === "ingreso" ? "Ingreso" : "Gasto"}`;

    detalle.append(nombre, categoria);

    const importe = document.createElement("span");
    importe.className =
      `importe ${movimiento.tipo === "ingreso" ? "positivo" : "negativo"}`;
    importe.textContent =
      `${movimiento.tipo === "ingreso" ? "+" : "−"}$${movimiento.monto.toFixed(2)}`;

    const botonModificar = document.createElement("button");
    botonModificar.type = "button";
    botonModificar.className = "modificar";
    botonModificar.textContent = "Modificar";
    botonModificar.addEventListener("click", () => {
      abrirEdicion(movimiento);
    });

    const botonEliminar = document.createElement("button");
    botonEliminar.type = "button";
    botonEliminar.className = "eliminar";
    botonEliminar.textContent = "Eliminar";
    botonEliminar.addEventListener("click", () => {
      eliminarMovimiento(movimiento.id);
    });

    fila.append(detalle, importe, botonModificar, botonEliminar);
    lista.appendChild(fila);

    if (movimiento.tipo === "ingreso") {
      ingresos += movimiento.monto;
    } else {
      gastos += movimiento.monto;
    }
  });

  avisoVacio.hidden = movimientos.length > 0;

  document.querySelector("#ingresos").textContent = `$${ingresos.toFixed(2)}`;
  document.querySelector("#gastos").textContent = `$${gastos.toFixed(2)}`;
  document.querySelector("#balance").textContent =
    `$${(ingresos - gastos).toFixed(2)}`;
}

function abrirEdicion(movimiento) {
  idEnEdicion = movimiento.id;
  document.querySelector("#editar-descripcion").value = movimiento.descripcion;
  document.querySelector("#editar-monto").value = movimiento.monto;
  dialogo.showModal();
}

formularioEdicion.addEventListener("submit", (evento) => {
  evento.preventDefault();

  const movimiento = movimientos.find((item) => item.id === idEnEdicion);
  if (!movimiento) return;

  movimiento.descripcion =
    document.querySelector("#editar-descripcion").value.trim();
  movimiento.monto =
    Number(document.querySelector("#editar-monto").value);

  guardarMovimientos();
  mostrarMovimientos();
  dialogo.close();
});

function eliminarMovimiento(id) {
  movimientos = movimientos.filter((movimiento) => movimiento.id !== id);
  guardarMovimientos();
  mostrarMovimientos();
}

function guardarMovimientos() {
  localStorage.setItem("movimientos", JSON.stringify(movimientos));
}

mostrarMovimientos();