var status = angular.module('trendyStatus', [])

	.constant('AUTH_EVENTS', {
	  loginSuccess: 'auth-login-success',
	  loginFailed: 'auth-login-failed',
	  logoutSuccess: 'auth-logout-success',
	  sessionTimeout: 'auth-session-timeout',
	  notAuthenticated: 'auth-not-authenticated',
	  notAuthorized: 'auth-not-authorized'
	})	

	.constant('USER_ROLES', {
	  all: '*',
	  admin: 'admin',
	  editor: 'editor',
	  guest: 'guest'
	})
	
	.factory('AuthService', ['$http', 'Session', function($http, Session){

	}])

	.factory('statusList', ['$http', '$q', function($http, $q){

		var statusEndpoint = 'http://localhost/status/api/';


		function getStatusList(){			
			return $http({
				method: 'GET',
				url: statusEndpoint + "statuses",
				headers: {
					'AuthToken' : 'Token dicks'
				}
			})
		}

		function IDGenerator() {
	 		var obj = {};

			obj.length = 8;
			obj.timestamp = +new Date;

			var _getRandomInt = function( min, max ) {
			return Math.floor( Math.random() * ( max - min + 1 ) ) + min;
			}

			obj.generate = function() {
			 var ts = this.timestamp.toString();
			 var parts = ts.split( "" ).reverse();
			 var id = "";
			 
			 for( var i = 0; i < this.length; ++i ) {
				var index = _getRandomInt( 0, parts.length - 1 );
				id += parts[index];	 
			 }
			 
			 return id;
			}

			return obj;
		}


		function addStatus(status){

			var newStatus;

			var statusPromise = $http({
				method: 'POST',
				url: statusEndpoint + "status",
				headers: {
					'AuthToken': 'Token dicks',
					'Content-Type': 'application/x-www-form-urlencoded'
				},
				data: {
					"ID": status.ID,
					"StatusName": status.StatusName,
					"StatusUrl": status.StatusUrl,
					"StatusMeta": status.StatusMeta
					}
			})

			return statusPromise;
		}
		function updateStatus(status){
			statusList.push(status);
		}

		function removeStatus(statusId){
			return 0;
		}


		var generator = IDGenerator();
		return {
			add: addStatus,
			update: updateStatus,
			remove: removeStatus,
			get: getStatusList,
			idGenerator: generator
		}

	}])

	.service('statusCheck', ['$http', function($http){
		
		var setStatus = function(status){}


		this.check = function(status){
			console.log(status.url);
			return $http({
				method: 'GET',
				url: status.StatusUrl,
				headers: {
					'AuthToken' : 'Token dicks'
				}
			})	
		}
	}])
	.controller('appController', ['$scope', function($scope){}])
	.controller('navController', ['$scope', function($scope){}])
	.controller('statusController', ['$scope', 'statusList', 'statusCheck', function($scope, statusList, statusCheck) {
	  // $scope.name = 'Hola!';

	  $scope.statusList = [];

	  var statusPromise = statusList.get();

	  statusPromise.then(function(response){
	  			$.each(response.data, function(){
	  				$scope.statusList.push(this);	
	  			})
			}, function(error){
				alert(error.data);
			})

	  $scope.newStatus = {
	  	newStatusName: "Status Name",
	  	newStatusUrl: "Status URL",
	  	availability: ['public', 'private'],
	  	// defaultAvailability: $scope.newStatus.availability[0]
	  };
	  $scope.availability = ['public', 'private'];

	  $scope.selectModel = $scope.availability[0];

	  $scope.addNewStatus = function(){
	  	var status = {
	  		ID: statusList.idGenerator.generate(),
	  		StatusName: $scope.newStatus.newStatusName,
	  		StatusUrl: $scope.newStatus.newStatusUrl,
	  		StatusMeta: {
	  			ID: statusList.idGenerator.generate(),
	  			LastResponseCode: null,
	  			LastTestTime: null,
	  			CreationDate: null,
	  			Description: "default description",
	  			visibility: $scope.availability[1]
	  		}
	  	}

	  	var statusPromise = statusList.add(status);
	  	statusPromise.then(function(response){
	  			// document.write(response.data);
				$scope.statusList.push(JSON.parse(response.data));
			}, function(error){
				console.log(error);
			})

	  };

	  $scope.removeStatus = function(status){
	  	console.log(status);
	  	//use promise / then
	  	if(statusList.remove(status) == 0){
		  	var index = $scope.statusList.indexOf(status);
		  	if (index > -1) {
		  		$scope.statusList.splice(index, 1);
		  	};
	  	};

	  }

	  $scope.testStatus = function(status){
	  	console.log('send status ping: ' + status.StatusUrl);
	  	statusCheck.check(status).then(function(result){
	  		console.log(result);
	  	}, function(error){
	  		console.log(error.config);
	  	});
	  }

	}]);

// status.controller();