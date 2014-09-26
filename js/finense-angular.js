(function(){
	var finense = angular.module("finense", ["stock-page-module"]);
	var base = 'http://api.nse.com.ng/api';
	finense.directive('stockSymbols', function(){
		// Runs during compile
		return {
			restrict: 'E',
			templateUrl: 'stock-symbol.html',
			controller: function($http, StockPageAPI){
				stock = this;
				stock.symbols = [];

				$http.get('js/symbols.json').success(function(data){
					stock.symbols = data;
				});

				stock.symbolSelect = function(symbol){
					StockPageAPI.isSelected(symbol);
				};

			},
			controllerAs: 'stockCtrl'
		};
	});

	finense.directive('gainersTable', function(){
		return{
			restrict: 'E',
			templateUrl: 'bulls-table.html',
			controller: function($http){
				bull = this;
				bull.stocks = [];
				$http.get(base + "/mrkstat/topsymbols").success(function(data){
					bull.stocks = data;
				});
			},
			controllerAs: 'gainerCtrl'
		}
	});

	finense.directive('losersTable', function(){
		// Runs during compile
		return {
			restrict: 'E',
			templateUrl: 'bears-table.html',
			controller: function($http){
				bear = this;
				bear.stocks = [];
				$http.get(base + "/mrkstat/bottomsymbols").success(function(data){
					bear.stocks = data;
				});
			},
			controllerAs: 'loserCtrl'
		}
	});

	finense.controller('TopController', ['$interval', '$http', function($interval, $http){
		var top = this;
		top.date_milli = Date.now();
		top.marketStatus = {};
		 var getDate = function(){
			// var d = Date.now();
			top.date_milli = Date.now();
		};
		$interval(getDate, 1000);

		$http.get( base + "/statistics/mktstatus" ).success(function(data){
			if(data[0].MktStatus === "ENDOFDAY"){
				top.marketStatus = {
					background:  "-webkit-linear-gradient( bottom, rgb(200,10,10), rgb(250,15,15))"
				};
			} else {
				top.marketStatus = {
					background: "-webkit-linear-gradient( bottom, rgb(10,200,10), rgb(15,250,15))"
				};
			}
		});
	}]);


})();