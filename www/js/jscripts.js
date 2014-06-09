insertProjectCurrent=new Object();

$(function(){

	var your_object;
	var proyectosObj;
	var tareasObj;
	
	var nombreMes = new Array ('Enero', 'Febrero', 'Marzo', 'Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre');
	var actualtask;

	$('#btnRegistro').on('click', function(event) {
		event.preventDefault();
		var seccion = $('#registro form');
		var nombre = seccion.find('.nombre').val();
		var user = seccion.find('.user').val();
		var email = seccion.find('.email').val();
		var passmd5 = hex_md5(seccion.find('.pass').val());
		console.log(email);
		console.log(passmd5);
		if(seccion.find('input').val() == ''){
			alert('complete sus datos');
		}else{
			$.ajax({
				url: 'http://poesiagrafica.com/ServicioProjecManajer/resgitro.php',//poesiagrafica.com
				type: 'POST',
				dataType: 'json',
				data: {grabar: 'si', nombre: nombre , usuario: user, pass: passmd5, correo: email}
			})
			.done(function(result) {
				console.log(result.id_usuario);
			})
			.fail(function(result) {
				console.log(result);
			})
			.always(function(result) {
				console.log(result);
				if(!result){
					alert('Este usuario ya ha sido resgitrado anteriormente');
				}else{
					localStorage.currentUser = JSON.stringify(result);
					$.mobile.changePage("#main", { transition: "slide", changeHash: false });
				}
			});			
		}
	});


	$('#btnlogin').on('click', function(event) {
		event.preventDefault();
		var seccion = $('#login form');
		var user = seccion.find('.user').val();
		var passmd5 = hex_md5(seccion.find('.pass').val());
		console.log(user, passmd5);
		if(seccion.find('input').val() == ''){
			alert('complete sus datos');
		}else{
			$.ajax({
				url: 'http://poesiagrafica.com/ServicioProjecManajer/login.php',
				type: 'POST',
				dataType: 'json',
				data: {grabar: 'si', usuario: user, pass: passmd5}
			})
			.done(function(result) {
				console.log(result.id_usuario);				
			})
			.fail(function(result) {
				console.log(result);
			})
			.always(function(result) {
				var json_text = JSON.stringify(result, null, 2);
				var your_object = JSON.parse(json_text);

				console.log(result.id_usuario);
				if(!result){
					alert('Usuario o contraseña incorrecta');					
				}else{
					localStorage.currentUser = JSON.stringify(result);
					your_object = JSON.parse(localStorage.currentUser);
					insertUser = new UserCurrent(your_object.nombre, your_object.id_usuario, your_object.pass_js);

					console.log(insertUser);
					insertUser = new UserCurrent(your_object.nombre, your_object.id_usuario, your_object.pass_js);
					//$.mobile.changePage("#main", "slide");
					getProjects(insertUser.id_usuario);	
				}
			});			
		}
	});


	$('#btnGuardar').on('click', function(event) {
		event.preventDefault();
		var seccion = $('#insertarproyectos form');
		var nombrepro = seccion.find('.nombreproyecto').val();
		var description = seccion.find('.description').val();

		if(seccion.find('input').val() == '' || seccion.find('textarea').val() == '') {
			alert('Llene todos los campos');
		}else{
			$.ajax({
				url: 'http://poesiagrafica.com/ServicioProjecManajer/insertarproyecto.php',
				type: 'POST',
				dataType: 'json',
				data: {grabar: 'si', nombreproyecto: nombrepro, description: description, estadoproyecto: 0, horasproyecto: 0, idusuario: insertUser.id_usuario}
			})
			.done(function(result) {
								
			})
			.fail(function(result) {
				
			})
			.always(function(result) {
				if(!result){
					alert('No se guardo el proyecto correctamente');					
				}else{
					alert('El proyecto se guardó correctamente');
					getProjects(insertUser.id_usuario);	
				}
			});			
		}
	});

	function getProjects(userId){
		console.log('ingresa getproject'+userId);
		$.ajax({
			url: 'http://poesiagrafica.com/ServicioProjecManajer/getprojects.php',
			type: 'POST',
			dataType: 'json',
			data: {grabar: 'si', idusuario: userId}
		})
		.done(function(result) {
							
		})
		.fail(function(result) {
			
		})
		.always(function(result) {
			if(!result){
				console.log('No se recuperaron los datos');					
			}else{
				console.log('Datos recuperados');
				localStorage.proyectos = JSON.stringify(result);
				$.mobile.changePage('#main', { transition: "slide"});
				showMainProject();	
			}
		});
	}



	

	$("#main" ).on( "pageshow", function(event) {
		event.preventDefault(); 
		console.log('termino de cargar');
		console.log(localStorage.proyectos);
		showMainProject();			
	});


	function showMainProject(){
		your_object = JSON.parse(localStorage.currentUser);
		proyectosObj = JSON.parse(localStorage.proyectos);

		insertUser = new UserCurrent(your_object.nombre, your_object.id_usuario, your_object.pass_js);

		var source   = $("#template-list-projects").html();
		var template = Handlebars.compile(source);
		
		var nav = {
			nav:proyectosObj
		};

		console.log('nav '+nav);

		Handlebars.registerHelper('list', function(context, options) {
			console.log(context);
		  var ret = "<ul data-role='listview' class='ui-listview' data-filter='true' data-input='#filterBasic-input'>";

		  for(var i=0, j=context.length; i<j; i++) {
		    ret = ret + "<li>" + options.fn(context[i]) + "</li>";
		  }

		  return ret + "</ul>";
		});

		var source2   = $("#list-left").html();
		var template2 = Handlebars.compile(source2);

		var data = {usuario:insertUser.nombre};

		var html2 = template2(data);

		var html = template(nav);

		$("#main .content").html(html);

		$(".panel-left .list-left-widget").html(html2);

		var sectleft = $('.list-left-widget');
		sectleft.listview('refresh');

		$('#projectmanagerdetail').on('click', function(event) {
			event.preventDefault();
			$( ".panel-left" ).panel( "close" );
			$.mobile.changePage('#projectmanagerdetail', { transition: "slide"});
		});

		$('#logout').on('click', function(event) {
			event.preventDefault();
			localStorage.currentUser = '';
			$('#login form input').val('');
			$( ".panel-left" ).panel( "close" );
			$.mobile.changePage('#login', { transition: "slide"});
		});

		$('.itemListClick').bind( "taphold", function(){
			var id= $(this).data('id');
			tapholdHandler(id);
		});
		
		cickDetail();
	}

	function tapholdHandler (idproject) {
		var txt;
	    var r = confirm("¿Desea eliminar este proyecto?");
	    if (r == true) {
	        $.ajax({
				url: 'http://poesiagrafica.com/ServicioProjecManajer/deleteProject.php',
				type: 'POST',
				dataType: 'json',
				data: {grabar: 'si', idproyecto: idproject}
			})
			.done(function(result) {
								
			})
			.fail(function(result) {
				
			})
			.always(function(result) {
				if(!result){
					console.log('No se eliminó el proyecto');					
				}else{
					console.log('Se eliminó el proyecto');
					getProjects(insertUser.id_usuario);	
				}
			});
	    } else {
	        
	    }
	   
	}


	$("#insertarproyectos" ).on( "pageshow", function(event) {
		event.preventDefault();
		$('#insertarproyectos form input').val('');
		$('#insertarproyectos form textarea').val('');
	});


	function cickDetail () {
		$('.itemListClick').on('click', function(event) {
			event.preventDefault();
			var dataId = $(this).data('id');
			refreshDetail(dataId);
		});
	}

	function refreshDetail(dataId){
		console.log(dataId);
		var objproject = JSON.parse(localStorage.proyectos);

		var source   = $("#detalle-proyecto").html();
		var source2   = $("#detalle-proyecto-body").html();
		var template = Handlebars.compile(source);
		var template2 = Handlebars.compile(source2);
		

		for (var i = 0; i < objproject.length; i++) {
			console.log(objproject[i].id_proyecto);

			

			if(objproject[i].id_proyecto == dataId){

				var fecha = new Date(objproject[i].fecha);

				var day = fecha.getDate();
				var month = fecha.getMonth('Month');
				var year = fecha.getFullYear();
				console.log(month);
				var fechaok = day+' de '+ nombreMes[month] + ' del '+ year;

				console.log(fechaok);

				console.log('imgresa condicion');
				var datos = {proyectonombre: objproject[i].nombre_proyecto};
				var datos2 = {descripcion: objproject[i].descripcion_proyecto, estado: objproject[i].estado_proyecto, horas: objproject[i].horas_proyecto, fecha: fechaok};
				var html = template(datos);
				var html2 = template2(datos2);

				insertProjectCurrent = new ProjectCurrent(objproject[i].id_proyecto, objproject[i].descripcion_proyecto, objproject[i].horas_proyecto);

				console.log(insertProjectCurrent);

				$("#detalleproyecto h1").html(html);
				console.log(html2);
				$("#detalleproyecto .content .descriptionproject").html(html2);
				$.mobile.changePage('#detalleproyecto', { transition: "slide"});
			}
		};
	}

	

	$("#detalleproyecto" ).on( "pageshow", function(event) {
		event.preventDefault();
	});


	$('#btnGuardarTarea').on('click', function(event) {
		event.preventDefault();
		var seccion = $('#insertartareas form');
		var nombreTarea = seccion.find('.nombretarea').val();
		var description = seccion.find('.description').val();
		var estimado = seccion.find('.estimado').val();

		if(seccion.find('input').val() == '' || seccion.find('textarea').val() == '') {
			alert('Llene todos los campos');
		}else{
			$.ajax({
				url: 'http://poesiagrafica.com/ServicioProjecManajer/insertTarea.php',
				type: 'POST',
				dataType: 'json',
				data: {grabar: 'si', nombretarea: nombreTarea, description: description, estimado: estimado, horas: 0, estado: 'incompleto', observaciones: '', idproject: insertProjectCurrent.id_project}
			})
			.done(function(result) {
								
			})
			.fail(function(result) {
				
			})
			.always(function(result) {
				if(!result){
					alert('No se guardo la tarea correctamente');					
				}else{
					alert('La tarea se guardó correctamente');
					getTareas(insertProjectCurrent.id_project);	
				}
			});			
		}
	});


	function getTareas(id_project){
		console.log('ingresa getproject'+id_project);
		$.ajax({
			url: 'http://poesiagrafica.com/ServicioProjecManajer/getTareas.php',
			type: 'POST',
			dataType: 'json',
			data: {grabar: 'si', id_project: id_project}
		})
		.done(function(result) {
							
		})
		.fail(function(result) {
			
		})
		.always(function(result) {
			if(!result){
				console.log('No se recuperaron los datos');					
			}else{
				console.log('Datos recuperados');
				localStorage.tareas = JSON.stringify(result);
				refreshTareas();	
				$.mobile.changePage('#mainTareas', { transition: "slide"});
			}
		});
	}


	function refreshTareas() {
		event.preventDefault(); 
		console.log('termino de cargar tareas');
		console.log(localStorage.tareas);
		tareasObj = JSON.parse(localStorage.tareas);

		var source   = $("#template-list-tareas").html();
		var template = Handlebars.compile(source);
		
		var nav = {
			nav:tareasObj
		};

		console.log('nav '+nav);

		Handlebars.registerHelper('list', function(context, options) {
			console.log(context);
		  var ret = "<ul data-role='listview' class='ui-listview'>";

		  for(var i=0, j=context.length; i<j; i++) {
		    ret = ret + "<li>" + options.fn(context[i]) + "</li>";
		  }

		  return ret + "</ul>";
		});

		var html = template(nav);

		$("#mainTareas .content").html(html);
		clickItemTarea();
		calcular();		
	}

	$("#mainTareas" ).on( "pageshow", function(event) {
		event.preventDefault();
		getTareas(insertProjectCurrent.id_project);


	});

	function calcular(){
		//tareasObj = JSON.parse(localStorage.tareas);

		var numbertask = tareasObj.length;
		var numbercompletados = 0;
		var numhours=0;
		var numhtotal=0;

		for (var i = 0; i < tareasObj.length; i++) {
			console.log('calculando...'+ tareasObj[i].nombre_tarea);
			if(tareasObj[i].estado_tarea == 'completo'){
				numbercompletados++;
				console.log(numbercompletados);
			}
			numhours+=parseInt(tareasObj[i].estimado_horas);
			numhtotal+=parseInt(tareasObj[i].horas_usadas);
		};

		var calmul = numbercompletados*100;
		var caldiv = Math.round(calmul/numbertask);
		console.log(numhours+'-'+numhtotal+'project'+insertProjectCurrent.id_project );

		$.ajax({
			url: 'http://poesiagrafica.com/ServicioProjecManajer/updateProject.php',
			type: 'POST',
			dataType: 'json',
			data: {grabar: 'si', estado: caldiv, horasusadas: numhtotal, idproyecto: insertProjectCurrent.id_project}
		})
		.done(function(result) {
								
		})
		.fail(function(result) {
				
		})
		.always(function(result) {
			console.log('usuario actual '+insertUser.id_usuario);
			if(!result){
				console.log('No se actulizaron los datos');					
			}else{
				console.log('Datos actualizados proyecto');
				$.ajax({
					url:"http://poesiagrafica.com/ServicioProjecManajer/getprojects.php",
					type:"GET",
					dataType: "json",
					data:{grabar: 'si', idusuario: insertUser.id_usuario},
					success:function(result){
				    	localStorage.proyectos = JSON.stringify(result);
			  		}
		  		});					
			}
		});
		
	}

	$('#gobackdetail').on('click', function(event) {
		event.preventDefault();
		console.log('project actual'+insertProjectCurrent.id_project);
		refreshDetail(insertProjectCurrent.id_project);
	});

	


	function clickItemTarea(){
		$('.itemTareaClick').on('click', function(event) {
			event.preventDefault();
			var dataId = $(this).data('id');
			console.log(dataId);
			var objproject = JSON.parse(localStorage.tareas);

			console.log(objproject);

			$("#detalleTarea .content .descriptiontask").html('');

			var source   = $("#detalle-tarea").html();
			var source2   = $("#detalle-tarea-body").html();
			var template = Handlebars.compile(source);
			var template2 = Handlebars.compile(source2);
			

			for (var i = 0; i < objproject.length; i++) {
				console.log('obj for'+objproject[i].id_proyecto);				

				if(objproject[i].id_tarea == dataId){				

					console.log('imgresa condicion');
					var datos = {tareanombre: objproject[i].nombre_tarea};
					var datos2 = {descripcion: objproject[i].descripcion, estimado: objproject[i].estimado_horas, horas: objproject[i].horas_usadas, observaciones: objproject[i].observaciones};
					var html = template(datos);
					var html2 = template2(datos2);


					$("#detalleTarea h1").html(html);
					console.log(html2);
					$("#detalleTarea .content .descriptiontask").html(html2);
					
					actualtask = new TaskCurrent(objproject[i].id_tarea, objproject[i].estado_tarea);

					console.log(actualtask);

					$.mobile.changePage('#detalleTarea', { transition: "slide"});
				}
			};
		});
	}


	var sino;

	$("#detalleTarea" ).on( "pageshow", function(event) {
		event.preventDefault();

		sino = false;

		$( "#select-based-flipswitch" ).flipswitch({
		  create: function( event, ui ) {
		  	console.log(ui);
		  }
		});

		var objproject = JSON.parse(localStorage.tareas);

		console.log(actualtask.estado);

		if(actualtask.estado == 'completo'){
			var fts = $('#select-based-flipswitch');
			fts.val('on');
			fts.flipswitch('refresh');
			sino = !sino;
		}		

		$( "#select-based-flipswitch" ).change(function(){
			console.log('cambiando el select');
			sino = !sino;
			console.log(sino);
		});

		$( "#input-val-horas" ).textinput({
		  create: function( event, ui ) {
		  	console.log(event);
		  }
		});

		$( "#txt-area" ).textinput({
		  create: function( event, ui ) {
		  	console.log(event);
		  }
		});

		clickSaveProgress();
	});

	function clickSaveProgress(){
		$('#btnGuardarProgreso').on('click', function(event) {
			event.preventDefault();
			var seccion = $('#detalleTarea .descriptiontask');
			var horas = seccion.find('#input-val-horas').val();
			var observaciones = seccion.find('#txt-area').val();
			var progress = sino == true? 'completo': 'incompleto';
			console.log(progress);

			$.ajax({
				url: 'http://poesiagrafica.com/ServicioProjecManajer/updateTareas.php',
				type: 'POST',
				dataType: 'json',
				data: {grabar: 'si', observaciones: observaciones, horasusadas: horas, estadotarea: progress, idtarea: actualtask.id_tarea}
			})
			.done(function(result) {
									
			})
			.fail(function(result) {
					
			})
			.always(function(result) {
				if(!result){
						console.log('No se actulizaron los datos');					
				}else{
						console.log('Datos actualizados');					
				}
			});
		});
	}

	$("#drive" ).on( "pageshow", function(event) {
		event.preventDefault();
		//getDrivesItems();
	});


	TaskCurrent = function(id_tarea, estado){
		this.id_tarea = id_tarea,
		this.estado = estado
	}


	UserCurrent = function(nombre, id_usuario, pass){
		this.nombre = nombre,
		this.id_usuario = id_usuario,
		this.pass = pass
	}

	ProjectCurrent = function(id_project, description_project, horas){
		this.id_project = id_project,
		this.description_project = description_project,
		this.horas = horas
	}

	




});