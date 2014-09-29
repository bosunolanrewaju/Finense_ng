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
				}
			}				
		}]);

	stockModule.service('StockDataService', ["$http", function($http){
				var newSymbol = 0;
				var stockData = []
	
				return {
					sharedObject: {
						getSymbol: function(){
							return newSymbol;
						},
						set: function(symbol){
							newSymbol = symbol;
						},
						fetchData: function(){
							if(newSymbol === 0){
								var promise = $http.get(base + "/chartdata/ASI").success(function(data){
									return  data.IndiciesData;
								});
							} else {
								var promise = $http.get(base + "/stockchartdata/" + newSymbol).success(function(data){
									return data;
								});
							}
							return promise;
						},

						drawChart: function(container, symbol, selected, data){
							return {
								options: {
									chart: {
										renderTo: container,
										type: 'line',
										height: 400,
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
						            title: {text: 'Date'}
						        },
					            yAxis: {
						            title: {text: 'Market Value'}
						        },
						        loading: false
							}
						}
					}
				}
		
			}])

	stockModule.directive('stockPage', function(){
		return {
			restrict: 'E',
			templateUrl: 'stock-page.html',
			controller: function(StockPageAPI, $scope, $http, StockDataService, $timeout){
				$scope.api = StockPageAPI;
				$scope.dService = StockDataService.sharedObject
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
						$timeout(function(){$scope.show = true;}, 500);
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
							$scope.dService.set($scope.api.symbolData);
							// fetchData($scope.api.symbol);
						}
					});
				};			
			}
		}
	});

	stockModule.controller('ChartController', ['$scope', "StockDataService", function($scope, StockDataService){
		$scope.dataApi = StockDataService.sharedObject;
			$scope.$watch(function(){
				return $scope.dataApi.getSymbol();
			}, function(){
				$scope.dataApi.fetchData().success(function(data){
					$scope.stockChart = $scope.dataApi.drawChart("symbol_chart", $scope.api.symbol, 1, data);
				});
			});
	}]);

	stockModule.controller('asiController', ['StockDataService', '$scope', function(StockDataService, $scope){
		$scope.dataApi = StockDataService.sharedObject;
		$scope.dataApi.fetchData().success(function(data){
			$scope.asiChart = $scope.dataApi.drawChart("asi_chart", $scope.dataApi.getSymbol(), 5, data.IndiciesData);
		});		
	}]);

	stockModule.controller('MarqueeController', ['$http','$scope', function($http, $scope, element){
		var config = {
			params: {
				$filter: "TickerType eq 'EQUITIES'"
			}
		}
		$http.get(base + "/statistics/ticker", config).success(function(data){
			$scope.data = data;
		});
	}])
})();