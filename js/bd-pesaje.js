window.onload = inicializar;
var formPesaje;
var refPesaje;
var tablaPesaje;
var CREATE = "Añadir Pesaje"
var UPDATE = "Modificar Pesaje";
var modo = CREATE;
var refPesajeAEditar;
function inicializar(){
	formPesaje = document.getElementById("form-pesaje");
	formPesaje.addEventListener("submit", enviarPesajeAFirebase, false);

	tablaPesaje = document.getElementById("tabla-pesaje");

	refPesaje = firebase.database().ref().child("bd-pesaje");

	mostrarPesajeFirebase();

}

function mostrarPesajeFirebase(){
	refPesaje.on("value", function(snap){
		var datos = snap.val();
		var filasAMostrar = "";
		for(var key in datos){
			filasAMostrar += 	"<tr>"+
									"<td>"+ datos[key].nombre +"</td>"+
									"<td>"+ datos[key].peso +"</td>"+
									'<td>'+
									'<button class="btn btn-default editar" data-pesaje="'+ key + '">' +
									'<span class="glyphicon glyphicon-pencil"></span>' +
									'</button>' +
									'</td>'+
									'<td>' +
									'<button class="btn btn-danger borrar" data-pesaje="'+ key + '">' +
									'<span class="glyphicon glyphicon-trash"></span>' +
									'</button>' +
									'</td>' +
								"</tr>";
		}
		//mostramos las filas en la tabla
		tablaPesaje.innerHTML = filasAMostrar;
		if (filasAMostrar != "") {
			//capturamos la clase editar para modificar la referencia de la fila en bd firebase
			var elementosEditables = document.getElementsByClassName("editar");
			for(var i=0; i<elementosEditables.length; i++){
				elementosEditables[i].addEventListener("click", editarPesajeFirebase, false);
			}
			//capturamos la clase borrar para eliminar la referencia de la fila en bd firebase
			var elementosBorrables = document.getElementsByClassName("borrar");
			for(var i=0; i<elementosBorrables.length; i++){
				elementosBorrables[i].addEventListener("click", borrarPesajeFirebase, false);
			}
		}
	});
}

function editarPesajeFirebase(){
	var keyDePesajeAEditar = this.getAttribute("data-pesaje");
	//se pone var refPesajeAEditar como variable global para coger la referencia del firebase y modificar en el formulario
	refPesajeAEditar = refPesaje.child(keyDePesajeAEditar);
	refPesajeAEditar.once("value", function(snap){
		var datos = snap.val();
		//("nombre") es el id del formulario y datos.nombre es el identificador de la bd firebase
		document.getElementById("nombre").value = datos.nombre;
		document.getElementById("peso").value = datos.peso;
	});
	//ACTUALIZA EL BOTON DE CREAR A MODIFICAR cuando pulso en editar
	document.getElementById("boton-enviar-pesaje").value = UPDATE;
	modo = UPDATE;
	
}

function borrarPesajeFirebase(){
	var keyDePesajeABorrar = this.getAttribute("data-pesaje");
	var refPesajeABorrar = refPesaje.child(keyDePesajeABorrar);
	refPesajeABorrar.remove();
}

function enviarPesajeAFirebase(event){
	event.preventDefault();
	switch(modo){
		case CREATE:
		//registra en la referencia de la bd firebase
		refPesaje.push({
		nombre: event.target.nombre.value,
		peso: event.target.peso.value
		});	
		break;
		case UPDATE:
		//ponemos la referencia al objeto en la bd firebase que vamos a modificar 
		refPesajeAEditar.update({
		nombre: event.target.nombre.value,
		peso: event.target.peso.value
		});
		break;
	}
//	refPesaje.push({
//		nombre: event.target.nombre.value,
//		peso: event.target.peso.value
//	});

	formPesaje.reset();
}