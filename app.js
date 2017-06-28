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
		var producto	= Math.pow(1 + parseFloat(nuTasa), parseInt(nuPeriodo));

		var totalInversion = producto * parseFloat(nuMonto);

		$scope.totalInversion = totalInversion;
		$scope.nuMontoDolares = calculoServicio.calcularDolares(totalInversion);

		$scope.nuMontoEuros	  = investFactory.calcularEuros(totalInversion);
	}

	$scope.borrar = function(){
		$scope.nuMonto 		= '';
		$scope.nuTasa 		= '';
		$scope.nuPeriodo 	= '';
		$scope.totalInversion = '0.00';
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
