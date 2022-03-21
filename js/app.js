// Variables y selectores
const formulario = document.querySelector('#agregar-gasto');
const gastoListado = document.querySelector('#gastos ul');

 
// Eventos

eventListeners();
function eventListeners(){
     document.addEventListener('DOMContentLoaded', preguntarPresupuesto);

     formulario.addEventListener('submit', agregarGasto);
}

// Clases

class Presupuesto{
     constructor(presupuesto){
          this.presupuesto = Number(presupuesto);
          this.restante = Number(presupuesto);
          this.gastos = [];
     }

     nuevoGasto(gasto){
          this.gastos = [...this.gastos, gasto];
          this.calcularRestante();
     }     

     calcularRestante(){
          const gastado = this.gastos.reduce( (total, gasto) => total + gasto.cantidad, 0);
          this.restante = this.presupuesto - gastado;
     }

     eliminarGasto(id){
          this.gastos = this.gastos.filter(gasto => gasto.id !== id);
          this.calcularRestante();
     }
     
}

class UI{
     insertarPresupuesto(cantidad){
          // Extrayendo valores
          const {presupuesto, restante} = cantidad;

          //Agregando al HTML
          document.querySelector('#total').textContent = presupuesto;
          document.querySelector('#restante').textContent = restante;

     }

     imprimirAlerta(mensaje, tipo){

          // Bloquea que se genere mas de 1 Alerta al mismo tiempo 
          if(document.querySelector('.primario .alert-success')){
               document.querySelector('.primario .alert-success').remove();
          }else if(document.querySelector('.primario .alert-danger')){
               document.querySelector('.primario .alert-danger').remove();
          }

          // Crea la alerta
          const divMensaje = document.createElement('div');
          divMensaje.classList.add('text-center', 'alert');

          // Verifica el tipo de alerta
          if(tipo === 'error'){
               divMensaje.classList.add('alert-danger');
          }else{
               divMensaje.classList.add('alert-success');
          }

          divMensaje.textContent = mensaje;

          // Insertar en el HTML
          document.querySelector('.primario').insertBefore(divMensaje, formulario);

          // Elimina la alerta actual despues de 3 segundos
          setTimeout(()=>{
               divMensaje.remove();
          }, 3000);                   
     }

     mostrarGastos(gastos){
          // Iterar sobre los gastos
          this.limpiarListado();

          gastos.forEach( gasto => {
               const {cantidad, nombre, id} = gasto;

               // Crea un li
               const nuevoGasto = document.createElement('li');
               nuevoGasto.className = 'list-group-item d-flex justify-content-between align-items-center'; 
               nuevoGasto.dataset.id = id;

               // Agregar el HTML del gasto
               nuevoGasto.innerHTML = `${nombre} <span class="badge badge-primary badge-pill"> $ ${cantidad} </span>`;

               // Boton para borrar el gasto
               const btnBorrar = document.createElement('button');
               btnBorrar.classList.add('btn', 'btn-danger', 'borrar-gasto');
               btnBorrar.innerHTML = 'Borrar &times;';
               btnBorrar.onclick = () => {
                    eliminarGasto(id);
               }
               nuevoGasto.appendChild(btnBorrar);

               // Agregar al HTML
               gastoListado.appendChild(nuevoGasto);
          })
     };

     // Limpia el listado
     limpiarListado(){
          while(gastoListado.firstChild){
               gastoListado.removeChild(gastoListado.firstChild);
          }
     };

     actualizarRestante(restante){
          document.querySelector('#restante').textContent = restante;     
     };

     comprobarPresupuesto(presupuestObj){
          const {presupuesto, restante} = presupuestObj;

          const restanteDiv = document.querySelector('.restante');

          // Comprobar 25%
          if((presupuesto / 4) > restante){
               restanteDiv.classList.remove('alert-success', 'alert-warning');
               restanteDiv.classList.add('alert-danger');
          }else if((presupuesto / 2) > restante){
               restanteDiv.classList.remove('alert-success');
               restanteDiv.classList.add('alert-warning');
          }else{
               restanteDiv.classList.remove('alert-danger', 'alert-warning');
               restanteDiv.classList.add('alert-success');
               formulario.querySelector('button[type="submit"]').disabled=false;
          }

          // Si el total es 0 o menor
          if(restante <= 0){
               ui.imprimirAlerta('El presupuesto se ha agotado', 'error');
               formulario.querySelector('button[type="submit"]').disabled=true;
          }
     }
}

// Instanciar
const ui = new UI();
let presupuesto;


// Funciones

function preguntarPresupuesto() {
     const presupuestoUsuario = prompt('Cual es tu presupuesto?');

     if(presupuestoUsuario === '' || presupuestoUsuario === null || isNaN(presupuestoUsuario) || presupuestoUsuario <= 0){
          window.location.reload();
     }

     presupuesto = new Presupuesto(presupuestoUsuario);
     
     ui.insertarPresupuesto(presupuesto);
};

// Anade gastos

function agregarGasto(e) {
     e.preventDefault();

     // Leer los datos del formulario
     const nombre = document.querySelector('#gasto').value;
     const cantidad = Number(document.querySelector('#cantidad').value);

     // Validar
     if(nombre === '' || cantidad === ''){
          ui.imprimirAlerta('Ambos campos son obligatorios', 'error');
          return;
     }else if(cantidad < 0 || isNaN(cantidad)){
          ui.imprimirAlerta('Cantidad no valida', 'error');
          return;
     };

     // Generar un objeto con el gasto
     const gasto = { nombre, cantidad, id:Date.now() };

     //Anade un nuevo gasto
     presupuesto.nuevoGasto(gasto);

     //Imprime alerta de todo correcto
     ui.imprimirAlerta('Gasto agregado correctamente');

     // Imprimir los gastos
     const {gastos, restante} = presupuesto;
     ui.mostrarGastos(gastos);

     ui.actualizarRestante(restante);

     ui.comprobarPresupuesto(presupuesto);
     
     // Reinicia el formulario
     formulario.reset();

};

function eliminarGasto(id){
     // Elimina el gasto de la clase
     presupuesto.eliminarGasto(id);

     //Elimina los gastos del HTML
     const {gastos, restante} = presupuesto;
     ui.mostrarGastos(gastos);

     ui.actualizarRestante(restante);

     ui.comprobarPresupuesto(presupuesto);
};