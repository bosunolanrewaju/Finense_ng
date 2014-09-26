(function(){
	var stockModule = angular.module("stock-page-module", []);

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
			controller: function(StockPageAPI, $scope){
				$scope.api = StockPageAPI;
				$scope.$watch(function(){
					return $scope.api.id
				}, function(){
					isSelected($scope.api.id);
				});

				var isSelected = function(id){
					console.log("clicked");
					if(id !== 0){
						$scope.showHome = false;
						$scope.showStockPage = true;
					} else {
						$scope.showHome = true;
						$scope.showStockPage = false;
					}
				}
			}
		}
	});
})();