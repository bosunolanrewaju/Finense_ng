(function(){
	var stockModule = angular.module("stock-page-module", ["highcharts-ng"]);
	var base = 'http://api.nse.com.ng/api';

	stockModule.factory("StockPageAPI", ["$http", function($http){
			//id = null
			return {
				symbol: 0,
				symbolData: null,
				isSelected: function(symbol){
					this.symbol = symbol;
				},
				fetchData: function(symbol){
						if(symbol === 0){
							$http.get(base + "/chartdata/ASI").success(function(data){
								this.stockData = data.IndiciesData;
							});
						} else {
							console.log(this.symbolData);
							$http.get(base + "/stockchartdata/" + this.symbolData).success(function(data){
								this.stockData = data;
							});
						}
					}
			}
		}]);

	stockModule.factory('StockDataAPI', ['$http', "StockPageAPI", function($http, StockPageAPI){
		
			// this.api = StockPageAPI;
			// this.stockData = [];
			// if(this.api.symbol === 0){
			// 	$http.get(base + "/chartdata/ASI").success(function(data){
			// 		this.stockData: data.IndiciesData;
			// 	});
			// } else {
			// 	$http.get(base + "/stockchartdata/").success(function(data){
			// 		// return {this.stockData: data.IndiciesData}
			// 	});
			// }
			// return this.stockData;

	}])

	stockModule.directive('stockPage', function(){
		return {
			restrict: 'E',
			templateUrl: 'stock-page.html',
			controller: function(StockPageAPI, $scope, $http){
				$scope.api = StockPageAPI;
				$scope.$watch(function(){
					return $scope.api.symbol
				}, function(){
					isSelected($scope.api.symbol);
				});

				$scope.stockInfo = [];
				var isSelected = function(symbol){
					if(symbol === 0 || symbol === undefined){
						$scope.show = false;
					} else {
						$scope.show = true;
					}

					var config = {
						params: {
							$filter: "Symbol eq '" + $scope.api.symbol + "'"
						}
					}

					$http.get(base + "/issuers/companydirectory", config).success(function(data){
						$scope.stockInfo = data[0];
						if($scope.stockInfo){
							$scope.api.symbolData = $scope.stockInfo.InternationSecIN
							console.log($scope.api.symbolData);
							$scope.api.fetchData($scope.api.symbol);
							// fetchData($scope.api.symbol);
						}
					});
				};			
			}
		}
	});

	stockModule.controller('ChartController', ['$scope', "$http", function($scope, $http){
		$scope.$watch(function(){
			return $scope.api.stockData;
		}, function(){
			console.log($scope.api.stockData);
		})
		
		var chart = function(symbol, selected, data){
			$scope.stockChart = {
					options: {
						chart: {
							type: 'line',
							backgroundColor: 'rgb(240,240,240)'
						}
					},

		            rangeSelector : {
		                selected : selected
		            },

		            title : {
		                text : symbol === 0 ? "All Share Index" : symbol
		            },

		            series : [{
		                name : symbol === 0 ? "ASI" : symbol,
		                data : data
		            }],

		            xAxis: {
			            type: 'datetime',
			            title: {text: 'Years'}
			        },

		            yAxis: {
			            title: {text: 'Market Capitalization'}
			        }
			}
		}

		chart($scope.api.symbol, 5, $scope.api.stockData);
	}]);
})();