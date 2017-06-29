var app = angular.module('app', ['ngRoute']);

app.config(['$routeProvider','$locationProvider', function($routeProvider, $locationProvider){

	$routeProvider
		.when('/meta',{templateUrl:"meta.html",controller:"metaController"})
		.when('/plan',{templateUrl:"plan.html",controller:"planController"});
}]);

app.controller('controller', [ '$scope', '$location', '$anchorScroll', function ($scope, $location, $anchorScroll){
	
	$scope.verContenido = function(id) {
    	$location.path(id);
   	}
}]);

app.controller('metaController', [ '$scope', 'calculoServicio', 'investFactory', function ($scope, calculoServicio, investFactory){

	$scope.calcularMeta = function(){
		var nuMonto 	= $scope.nuMonto;
		var nuTasa  	= $scope.nuTasa;
		var nuPeriodo 	= $scope.nuPeriodo;
		//var pjMonto		= 1 / (parseFloat(nuMonto) / $scope.nuAportacion);
		var pjMonto		= $scope.nuAportacion || 0;

		var producto	= Math.pow(1 + parseFloat(nuTasa), parseInt(nuPeriodo));

		var totalInversion = producto * parseFloat(nuMonto);

		//Ciclar calculo
		totalInversion = nuMonto;

		for (var i = 0; i < nuPeriodo; i++)
		{
			nuMontoAnterior = parseFloat(totalInversion);
			totalInversion = nuMontoAnterior + (nuMontoAnterior *parseFloat(nuTasa)) + parseFloat(pjMonto);
		}
		///////////////////////////////////////

		$scope.totalInversion = totalInversion;
		$scope.nuMontoDolares = calculoServicio.calcularDolares(totalInversion);

		$scope.nuMontoEuros	  = investFactory.calcularEuros(totalInversion);
	}

	$scope.borrar = function(){
		$scope.nuMonto 		= '';
		$scope.nuTasa 		= '';
		$scope.nuPeriodo 	= '';
		$scope.totalInversion = '0.00';

		$scope.sonVisiblesOpcionales = false;
	}

	var conteo = 0;

	$scope.mostrarOpcionales = function(){
		conteo++;

		var esVisible = !(conteo % 2 == 0);

		$scope.sonVisiblesOpcionales = esVisible;
	}

	//Inicializar variables
	$scope.borrar();

}]);

app.controller('planController', [ '$scope', 'calculoServicio', 'investFactory', function ($scope, calculoServicio, investFactory){

	$scope.calcularPlan = function(){
		var nuMeta 		= $scope.nuMeta;
		var nuTasa 		= $scope.nuTasaPlan;
		var nuPeriodo 	= $scope.nuPeriodoRetiro;
		var producto 	= Math.pow(1 + parseFloat(nuTasa), parseInt(nuPeriodo));

		var inversionInicial = nuMeta / producto;

		$scope.inversionInicial = inversionInicial;
		$scope.nuMontoDolaresPlan = calculoServicio.calcularDolares(inversionInicial);

		$scope.nuMontoEurosPlan   = investFactory.calcularEuros(inversionInicial);
	}

	$scope.borrar = function(){
		$scope.nuMeta 			= '';
		$scope.nuTasaPlan		= '';
		$scope.nuPeriodoRetiro 	= '';
		$scope.inversionInicial = '0.00';
	}

	//Inicializar variables
	$scope.borrar();
}]);

app.service('calculoServicio', function(){
	this.calcularDolares = function(monto){
		return monto / 20;
	}
});

app.factory('investFactory', function(){
	return {
		calcularEuros: function(monto){
			return monto / 22;
		}
	}
})
