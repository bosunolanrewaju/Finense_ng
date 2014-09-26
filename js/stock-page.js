(function(){
	var stockModule = angular.module("stock-page-module", []);
	var base = 'http://api.nse.com.ng/api';

	stockModule.factory("StockPageAPI", function(){
		//id = null
		return {
			id: 0,
			isSelected: function(id){
				this.id = id;
			},
			getId: function(){
				return this.id;
			}
		};
	});

	stockModule.directive('stockPage', function(){
		return {
			restrict: 'E',
			templateUrl: 'stock-page.html',
			controller: function(StockPageAPI, $scope, $http){
				$scope.api = StockPageAPI;
				$scope.$watch(function(){
					return $scope.api.id
				}, function(){
					isSelected($scope.api.id);
				});

				$scope.stockInfo = [];
				var isSelected = function(id){
					if(id !== 0){
						$scope.show = true;
					} else {
						$scope.show = false;
					}

					$http.get(base + "/issuers/companydirectory").success(function(data){
						$scope.stockInfo = data;
						console.log($scope.stockInfo);
					});
				};
			}
		}
	});
})();