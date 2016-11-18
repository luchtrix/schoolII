var app = angular.module('appLaescuela',[]);
//$(document).ready(function (){});
//Controlador para el inicio del sistema de la escuela
app.controller('inicioCtrl', ['$scope', '$http', function($scope, $http) {
    var url_server = 'http://192.168.0.100:8080/';
    //var url_server = 'http://127.0.0.1:8080/';
    //Logearse en el sistema
    $scope.login = function(){
        $(".msjError").empty();
        //primero verificar si es director o no
        $http.get(url_server+'maestro/loginMaestro', { params : {ESCCELM: $scope.usuario.Celular, ESCPASM: $scope.usuario.Clave }}).success(function(response){
            if(response.status){
                if(typeof(Storage) !== "undefined") {
                    // Alamcenamos la información del usuario
                    localStorage.setItem("usuario", JSON.stringify(response.data));
                }
                //window.location.href = "/home-director";
                window.location.href = "vistas/maestro/home.html";
            }else{
                //Si no es director...puede ser maestro o alumno....poner el login abajo
                $(".msjError").append('<div class="alert alert-danger"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a><strong>Error!, No puede acceder al sistema...</strong>Verifique sus datos.</div>');    
            }
        });
    }
}]);
