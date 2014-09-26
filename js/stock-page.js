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
						$scope.show = true;
					} else {
						$scope.show = false;
					}
				}

				$scope.showSection = function(){
					console.log($scope.show)
					return $scope.show;
				}
			}
		}
	});
})();