var app = angular.module('app', ['ngRoute', 'rw.moneymask']);

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
    	
    	/*
    	var estiloMeta;

    	if (id == '/meta'){
    		if (estiloMeta !== { "background-color" : "#e74c3c" })
    			estiloMeta = { "background-color" : "#e74c3c" };
    		else
    			estiloMeta = { "background-color" : "#34495e" };

    		$scope.colorBotonMeta = estiloMeta;
    	}
    	else{
    		estiloPlan  = { "background-color" : "#e74c3c" };
    		$scope.colorBotonPlan = estiloPlan;
    	}	
    	*/
   	}
}]);

app.controller('metaController', [ '$scope', 'calculoServicio', 'investFactory', function ($scope, calculoServicio, investFactory){

	$scope.calcularMeta = function(){
		var nuMonto 	= $scope.nuMonto;
		var nuTasa  	= $scope.nuTasa / 100;
		var nuPeriodo 	= $scope.nuPeriodo;
		//var pjMonto		= 1 / (parseFloat(nuMonto) / $scope.nuAportacion);
		var pjMonto		= $scope.nuAportacion || 0;
		var nuPeriodicidad = $scope.nuPeriodicidad || 1; //en años
		var nuRetiro 	= $scope.nuRetiro;

		/*var producto	= Math.pow(1 + parseFloat(nuTasa), parseInt(nuPeriodo));
		var totalInversion = producto * parseFloat(nuMonto);*/

		//Ciclar calculo
		var totalInversion = nuMonto;

		/*
		for (var i = 0; i < nuPeriodo; i++)
		{
			//productoAnual = 12 / nuPeriodicidad;
			if (pjMonto == 0)
			{
				aportacion = ( i % nuPeriodicidad ) == 0 ? pjMonto : 0;

				nuMontoAnterior = parseFloat(totalInversion);
				totalInversion = nuMontoAnterior + (nuMontoAnterior *parseFloat(nuTasa)) + parseFloat(aportacion);
			}
			else
			{
				aportacion = ( i % nuPeriodicidad ) == 0 ? pjMonto : 0;

				x = 12 / nuPeriodicidad;
				//1 mes ... x = 12 (12 iteraciones para cada aportacion)
				//2 meses .. x = 6 
				//3 meses .. x = 4 (4 iteraciones para cada aportacion)

				for (var j = 0; j < x; j++)
				{
					nuMontoAnterior = parseFloat(totalInversion);
					totalInversion = nuMontoAnterior + (nuMontoAnterior * (parseFloat(nuTasa) / x)) + parseFloat(aportacion);
				}
			}
		}
		*/
		
		x = 12 / nuPeriodicidad;

		for (var i = 0; i < (nuPeriodo*12); i++)
		{
			aportacion = ( i % nuPeriodicidad ) == 0 ? pjMonto : 0;

			nuMontoAnterior = parseFloat(totalInversion);
			totalInversion = nuMontoAnterior + (nuMontoAnterior * (parseFloat(nuTasa) / 12)) + parseFloat(aportacion);
		}
		///////////////////////////////////////

		$scope.totalInversion = totalInversion;
		$scope.mensualidad    = totalInversion / ( nuRetiro * 12 );
		$scope.nuMontoDolares = calculoServicio.calcularDolares(totalInversion);

		$scope.nuMontoEuros	  = investFactory.calcularEuros(totalInversion);
	}

	$scope.borrar = function(){
		$scope.nuMonto 		= '';
		$scope.nuTasa 		= '';
		$scope.nuPeriodo 	= '';
		$scope.nuRetiro     = '';
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
		var nuTasa 		= $scope.nuTasaPlan / 100;
		var nuPeriodo 	= $scope.nuPeriodoRetiro;
		/*var producto 	= Math.pow(1 + parseFloat(nuTasa), parseInt(nuPeriodo));

		var inversionInicial = nuMeta / producto;

		$scope.inversionInicial = inversionInicial;
		$scope.nuMontoDolaresPlan = calculoServicio.calcularDolares(inversionInicial);

		$scope.nuMontoEurosPlan   = investFactory.calcularEuros(inversionInicial);*/

		////////////////////////////////////////////////////////////////////////////////////////
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

	$scope.borrar = function(){
		$scope.nuMeta 			= '';
		$scope.nuTasaPlan		= '';
		$scope.nuPeriodoRetiro 	= '';
		$scope.inversionInicial = '0.00';
	}

	var conteo = 0;

	$scope.mostrarOpcionalesPlan = function(){
		conteo++;

		var esVisible = !(conteo % 2 == 0);

		$scope.sonVisiblesOpcionalesPlan = esVisible;
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
});