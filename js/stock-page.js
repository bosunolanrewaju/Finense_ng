(function(){
	var stockModule = angular.module("stock-page-module", []);
	var base = 'http://api.nse.com.ng/api';

	stockModule.factory("StockPageAPI", function(){
		//id = null
		return {
			symbol: 0,
			isSelected: function(symbol){
				this.symbol = symbol;
			},
		};
	});

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
					if(symbol !== 0){
						$scope.show = true;
					} else {
						$scope.show = false;
					}

					var config = {
						params: {
							$filter: "Symbol eq '" + $scope.api.symbol + "'"
						}
					}

					$http.get(base + "/issuers/companydirectory", config).success(function(data){
						$scope.stockInfo = data[0];
					});
				};
			}
		}
	});
})();