var app = angular.module('appLaescuela',[]);

$(document).ready(function (){
    $("#form").hide();
    $("#enviar").hide();

    var dialog = document.querySelector('dialog');
    var showModalButton = document.querySelector('.show-modal');
    if (! dialog.showModal) {
      dialogPolyfill.registerDialog(dialog);
    }
    showModalButton.addEventListener('click', function() {
      dialog.showModal();
    });
    dialog.querySelector('.close').addEventListener('click', function() {
      dialog.close();
    });

    $('select').material_select();
    
});

//Controlador para el inicio del sistema de la escuela
app.controller('maestroCtrl', ['$scope', '$http', function($scope, $http) {
    //var url_server = 'http://127.0.0.1:8080/';
    var url_server = 'http://192.168.0.100:8080/';
    //Logearse en el sistema
    var usuario = localStorage.getItem("usuario")///nuevo|
    $scope.usuario = JSON.parse(usuario);//NUEVO

    $("#hideForm").click(function(){
        //alert("1");
        $("#form").hide();
        $("#main").show(); 
    });
    $("#showForm").click(function(){
        //alert("2.1");
        $("#form").show();
        $("#main").hide(); 
        $("#content").val("");
    });
    /*$("#send").click(function(){
        $("#enviar").show();
        $("#main").hide(); 
    });
    $("#hideSend").click(function(){
        $("#enviar").hide();
        $("#main").show(); 
    });*/

    //alert("carrera "+$scope.usuario.ESCIDCA)
    //primero hay que obtener las materias de este maestro(ids)
    obtenerMaterias();
    //obtener todos los grupos, independientemente de la escuela, todos los grupos
    obtenerGrupos();

    $scope.maestromaterias = [];
    $scope.materiasM = [];
    $scope.alumnos = [];
    $scope.alumnosgrupo = [];
    function obtenerMaterias(){
        //alert("obtenerMaterias");
        $http.get(url_server+"maestromateria/obtenerMaterias/"+$scope.usuario._id).success(function(response) {
            if(response.status) { // Si nos devuelve un OK la API...
                //alert("tam "+response.data.length+" ma "+response.data[0].ESCIDEM);
                $scope.maestromaterias = response.data;
                for (i in $scope.maestromaterias) {
                    //alert("i "+$scope.maestromaterias[i].ESCIDEM)
                    $http.get(url_server+"materia/buscarMateria/"+$scope.maestromaterias[i].ESCIDEM).success(function(r) {
                        if(r.status){
                            //alert("lo entonctro materia "+r.data.ESCNOMM);
                            //r.data.grupo = $scope.maestromaterias[i].ESCIDEG;
                            $scope.materiasM.push(r.data);
                        }
                    });
                }
            }
        })
    }

    function obtenerGrupos(){
        //alert("obtenerGrupos")
        $scope.allgrupos = [];
        $http.get(url_server+"grupos/todosGrupos").success(function(response) {
            if(response.status){
                $scope.allgrupos = response.data;
            }
        });
    }

    //funcion que obtiene el parametro que esta en la url...si existe
    function getUrlParameter(sParam) {
        //alert("sParam "+sParam)
        var sPageURL = decodeURIComponent(window.location.search.substring(1)),
            sURLVariables = sPageURL.split('&'),
            sParameterName,
            i;
        for (i = 0; i < sURLVariables.length; i++) {
            sParameterName = sURLVariables[i].split('=');
            if (sParameterName[0] === sParam) {
                return sParameterName[1] === undefined ? true : sParameterName[1];
            }
        }
    };

    //$scope.oneMateria = "";
    $scope.oneMateria = [];
    $scope.oneGrupo = "";
    var search = getUrlParameter('search');//capturando id de la materia en la url
    var idMateria = "";
    $scope.idGrupo = "";
    
    if (search != undefined) {
        var arreglo = search.split("/");
        idMateria = arreglo[0];
        $scope.idGrupo = arreglo[1];
        $http.get(url_server+"materia/buscarMateria/"+idMateria).success(function(response) {
            if(response.status){
                //$scope.oneMateria = response.data.ESCNOMM;
                $scope.oneMateria = response.data;
                $http.get(url_server+"grupos/buscarGrupo/"+$scope.idGrupo).success(function(resp) {
                    if (resp.status) {
                        $scope.oneGrupo = resp.data.ESCNOMG;
                    }
                });
            }
        });
        obtenerUnidadesM();
        obtenerAlumnosGpo();
    }

    function obtenerUnidadesM(){
        $http.get(url_server+"unidades/listarUnidades/"+idMateria).success(function(response) {
            if(response.status) { // Si nos devuelve un true significa que todo esta bien
                $scope.unidadesM = response.data;
            }
        });
    }

    //funcion que lista todas las escuelas
    function listarAlumnos(){
        var idE = $scope.usuario.ESCIDEM;
        //alert("idE "+idE);
        if(idE != undefined || idE != ""){
            $http.get(url_server+"alumno/listarAlumnos/"+idE).success(function(response) {
                if(response.status) { // Si nos devuelve un true significa que todo esta bien
                    $scope.alumnos = response.data;
                }
            })
        }
    }

    //obtener id de los alumnos por grupo
    function obtenerAlumnosGpo(){
        listarAlumnos();//lista todos los alumnos que existen en la escuela
        $http.get(url_server+"alumnomateria/buscarxmateriaRelAluMat/"+$scope.idGrupo).success(function(response) {
            if(response.status) { // Si nos devuelve un true significa que todo esta bien
                $scope.alumnosgrupo = response.data;
            }
        })
    }

    var unit = getUrlParameter('unit');//capturando id de la unidad en la url
    var idUnidad = "";
    $scope.oneUnidad = [];
    if (unit != undefined) {
        var arreglo = unit.split("/");
        idUnidad = arreglo[0];
        $scope.idGrupo = arreglo[1];
        $http.get(url_server+"unidades/buscarUnidad/"+idUnidad).success(function(response) {
            if(response.status){
                $scope.oneUnidad = response.data;
                $http.get(url_server+"materia/buscarMateria/"+$scope.oneUnidad.ESCIDCM).success(function(response) {
                    //$scope.oneMateria = response.data.ESCNOMM;
                    $scope.oneMateria = response.data;
                     $http.get(url_server+"grupos/buscarGrupo/"+$scope.idGrupo).success(function(resp) {
                        if (resp.status) {
                            $scope.oneGrupo = resp.data.ESCNOMG;
                        }
                    });
                });
            }
        });
        obtenerTareasU();
        obtenerAlumnosGpo();
    }

    $scope.nuevaTarea = function(){
        /*alert("fecha "+$("#fecha").val());
        //alert("contenido "+$scope.tareaN.ESCLIMT);
        return;*/
        if($scope.tareaN.ESCDEPT == undefined){
            $scope.tareaN.ESCDEPT = "";
        }
        $scope.tareaN.ESCLIMT = $("#fecha").val();
        $scope.tareaN.ESCCONT = $scope.tareas.length+1;
        $scope.tareaN.ESCFECT = obtenerFecha();
        $scope.tareaN.ESCIDTU = idUnidad;
        $http.post(url_server+"tarea/nuevaTarea", $scope.tareaN).success(function(response) {
            if(response.status){
                $scope.tareaN = {};
                obtenerTareasU();
                Materialize.toast("Tarea creada exitosamente", 3500, 'rounded');
                $("#form").hide();
                $("#main").show();
            }
        });
    }
    $scope.tmpTarea = [];
    $scope.showEnviar = function(tarea){
        //alert("aaa "+tarea._id)
        $("#enviar").show();
        $("#main").hide();
        $scope.tmpTarea = tarea;
    }

    $scope.hideEnviar = function(){
        $("#enviar").hide();
        $("#main").show();
        $scope.tmpTarea = [];
    }

    function obtenerTareasU(){
        //alert("obtenerGrupos")
        $scope.tareas = [];
        $http.get(url_server+"tarea/listarTareas/"+idUnidad).success(function(response) {
            if(response.status){
                //alert("ok "+response.data.length);
                $scope.tareas = response.data;
            }
        });
    }

    $scope.enviarTarea = function(){
        //ag.ESCIDEA
        alert("aaaa");
        alert("agop "+$scope.alumnosgrupo.length)
        for(i in $scope.alumnosgrupo){
            var relacion = {
                ESCIDUN: idUnidad, //id de la carrera a la que pertenece
                ESCIDEA: $scope.alumnosgrupo[i].ESCIDEA, // id del alumno
                ESCIDET: $scope.tmpTarea._id, // id de la tarea
                ESCFECE: obtenerFecha()//fecha cuando se envio la tarea...
            };
            $http.post(url_server+"tareaalumno/nuevaRelTarAlu", relacion).success(function(response) {
                if(response.status){
                    console.log("agregado");
                }
            });
        }

        $http.get(url_server+'tarea/actualizarEstTarea', { params : {id: $scope.tmpTarea._id, estatus: "E" }}).success(function(respuesta){
            if(respuesta.status){
                obtenerTareasU();
                Materialize.toast("Tarea enviada exitosamente", 3500, 'rounded');
                $("#enviar").hide();
                $("#main").show();
                $scope.tmpTarea = [];   
            }
        });

    }

    function obtenerFecha(){
        // Obtenemos la fecha de hoy con el formato dd/mm/yyyy
        var today = new Date()
        var dd = today.getDate();
        var mm = today.getMonth()+1; //January is 0!
        var yyyy = today.getFullYear();
        if(dd<10){
            dd='0'+dd
        } 
        if(mm<10){
            mm='0'+mm
        } 
        var today = dd+'/'+mm+'/'+yyyy;
        //alert(today);
        return today;
    }

}]);
