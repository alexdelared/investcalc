var app = angular.module('app', ['ngRoute']);

app.config(['$routeProvider','$locationProvider', function($routeProvider, $locationProvider){

	$routeProvider
		.when('/meta',{templateUrl:"meta.html",controller:"metaController"})
		.when('/plan',{templateUrl:"plan.html",controller:"planController"});
}]);

app.controller('controller', [ '$scope', '$location', '$anchorScroll', function ($scope, $location, $anchorScroll){
	
	$scope.presionadoMeta 	= false;
	$scope.presionadoPlan 	= false;
	$scope.presionadoH1 	= false;
	$scope.presionadoNav 	= false;

	$scope.verContenido = function(id) {

		$scope.presionadoH1 	= true;
		$scope.presionadoNav 	= true;

    	$location.path(id);

    	if (id == '/meta'){
    		$scope.presionadoMeta = true;
    		$scope.presionadoPlan = false;
    	}
    	else{
    		$scope.presionadoPlan = true;
    		$scope.presionadoMeta = false;
    	}
   	}
}]);

app.controller('metaController', [ '$scope', 'calculoServicio', 'investFactory', function ($scope, calculoServicio, investFactory){

	$scope.sonVisiblesOpcionales 	= false;
	$scope.snPeriodoMostrar 		= true;
	$scope.snMensualidadMostrar 	= false;
	$scope.snCalcularDuracion 		= false;
	$scope.snPeriodo 				= false;
	$scope.snMensualidad 			= false;

	$scope.calcularMeta = function(){
		var nuMonto 	= $scope.nuMonto;
		var nuTasa  	= $scope.nuTasa / 100;
		var nuPeriodo 	= $scope.nuPeriodo;
		var pjMonto		= $scope.nuAportacion || 0;
		var nuPeriodicidad = $scope.nuPeriodicidad || 1; //en años
		var nuRetiro 	= $scope.nuRetiro;

		//Ciclar calculo
		var totalInversion = nuMonto;
		
		x = 12 / nuPeriodicidad;

		for (var i = 0; i < (nuPeriodo*12); i++)
		{
			aportacion = ( i % nuPeriodicidad ) == 0 ? pjMonto : 0;

			nuMontoAnterior = parseFloat(totalInversion);
			totalInversion = nuMontoAnterior + (nuMontoAnterior * (parseFloat(nuTasa) / 12)) + parseFloat(aportacion);
		}

		$scope.totalInversion = totalInversion;
		$scope.mensualidad    = totalInversion / ( nuRetiro * 12 );
		$scope.nuMontoDolares = calculoServicio.calcularDolares(totalInversion);

		$scope.nuMontoEuros	  = investFactory.calcularEuros(totalInversion);

		//Calcular años que duraría el fondo
		var inversionDescontarMensualidad = totalInversion;
		var nuMensualidad = $scope.nuMensualidad;
		var nuMeses = 0;

		if ($scope.snMensualidadMostrar){
			while (inversionDescontarMensualidad >= 0){
				nuMontoAnterior = parseFloat(inversionDescontarMensualidad);

				inversionDescontarMensualidad = nuMontoAnterior + (nuMontoAnterior * (parseFloat(nuTasa) / 12)) - parseFloat(nuMensualidad);
			
				nuMeses++;

				//Evitar ciclos infinitos (máx. 100 años)
				if (nuMeses == 1200)
					break;
			}

			$scope.nuAnos = Math.floor(nuMeses / 12);
			$scope.nuMeses = nuMeses % 12;
			$scope.snCalcularDuracion = true;

			$scope.nuEdad = parseInt($scope.nuPeriodo) + parseInt($scope.nuAnos) + 30;
		}
		else
			$scope.snCalcularDuracion = false;
	}

	$scope.reestablecerCampos = function(){
		$scope.nuMonto 					= '';
		$scope.nuTasa 					= '';
		$scope.nuPeriodo 				= '';
		$scope.nuRetiro     			= '';
		$scope.nuMensualidad 			= '';
		$scope.nuAportacion 			= '';
		$scope.nuPeriodicidad 			= '';
		$scope.totalInversion 			= '0.00';
		$scope.nuMontoDolares 			= '0.00';
		$scope.nuMontoEuros 			= '0.00';
		$scope.nuAnos 					= 0;
		$scope.nuMeses 					= 0;
		$scope.mensualidad 				= '';
		$scope.nuEdad  					= 30; //solicitar dato
	}

	var conteo = 0;

	$scope.mostrarOpcionales = function(){
		conteo++;

		var esVisible = !(conteo % 2 == 0);

		$scope.sonVisiblesOpcionales = esVisible;
	}

	$scope.cambiar = function($event){
		var checkbox = $event.target;
		if (checkbox.checked){
			$scope.snPeriodoMostrar 		= false;
			$scope.snMensualidadMostrar 	= true;
		}
		else{
			$scope.snPeriodoMostrar 		= true;
			$scope.snMensualidadMostrar 	= false;
		}
	}

	//Inicializar variables
	$scope.reestablecerCampos();

}]);

app.controller('planController', [ '$scope', 'calculoServicio', 'investFactory', function ($scope, calculoServicio, investFactory){

	$scope.calcularPlan = function(){
		var nuMeta 		= $scope.nuMeta;
		var nuTasa 		= $scope.nuTasaPlan / 100;
		var nuPeriodo 	= $scope.nuPeriodoRetiro;
		var pjMonto		= $scope.nuAportacionPlan || 0;
		var nuPeriodicidad = $scope.nuPeriodicidadPlan || 1;
		x = 12 / nuPeriodicidad;

		var inversionInicial = nuMeta;

		for (var i = 0; i < (nuPeriodo*12); i++)
		{
			aportacion = ( i % nuPeriodicidad ) == 0 ? pjMonto : 0;

			nuMontoAnterior = parseFloat(inversionInicial);
			inversionInicial = (nuMontoAnterior / (1 + (parseFloat(nuTasa) / 12))) - parseFloat(aportacion);
		}

		$scope.inversionInicial = inversionInicial;
		$scope.nuMontoDolaresPlan = calculoServicio.calcularDolares(inversionInicial);

		$scope.nuMontoEurosPlan   = investFactory.calcularEuros(inversionInicial);
	}

	$scope.reestablecerCampos = function(){
		$scope.nuMeta 				= '';
		$scope.nuTasaPlan			= '';
		$scope.nuPeriodoRetiro 		= '';
		$scope.inversionInicial 	= '0.00';
		$scope.nuMontoDolaresPlan 	= '0.00';
		$scope.nuMontoEurosPlan 	= '0.00';
		$scope.nuAportacionPlan 	= '';
		$scope.nuPeriodicidadPlan 	= '';
	}

	var conteo = 0;

	$scope.mostrarOpcionalesPlan = function(){
		conteo++;

		var esVisible = !(conteo % 2 == 0);

		$scope.sonVisiblesOpcionalesPlan = esVisible;
	}

	//Inicializar variables
	$scope.reestablecerCampos();
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
});

//Directivas
app.directive('miDirectiva', function(){
	return {
		restrict: 'EA',
		templateUrl: "directiva.html",
		scope: {
			lista: "=",
			miatributo: "@"
		}
	}
});

app.directive('camposMetas', function(){
	return {
		restrict: 'EA',
		templateUrl: 'directiva.html'
	}
});

/*
app.directive('input', function(){
	return {
		restrict: 'E',
		link: function(scope, ele, attrs, ctrls){
			var ngModel = ctrls[0];
			var myDirective = ctrls[1];
			console.log(ele.attr('id'));
		}
	}
})
*/