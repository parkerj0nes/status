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

	.factory('statusList', [function(){
		var statusList = [{
			id: 1,
			name: "duxter",
			url: "http://dungeondefenders2.com",
			status: 'success'
		},
		{
			id: 2,
			name: "playverse",
			url: "http://playverse.com",
			status: 'warning'
		},
		{
			id: 3,
			name: "playtrics",
			url: "http://productionmonitoring.playverse.com",
			status: 'warning'
		}];

		function IDGenerator() {
	 		var obj = {};

			obj.length = 8;
			obj.timestamp = +new Date;

			var _getRandomInt = function( min, max ) {
			return Math.floor( Math.random() * ( max - min + 1 ) ) + min;
			}

			obj.generate = function() {
			console.log(this);
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
			statusList.push(status);
			//save off to a hard list of statuses;
		}
		function updateStatus(status){
			statusList.push(status);
		}

		function removeStatus(statusId){
			return 0;
		}

		function getStatus () {
			return statusList;
		}

		var generator = IDGenerator();
		return {
			add: addStatus,
			update: updateStatus,
			remove: removeStatus,
			get: getStatus,
			idGenerator: generator
		}

	}])

	.service('statusCheck', ['$http', function($http){
		
		var setStatus = function(status){}


		this.check = function(status){
			console.log(status.url);
			$http.get(status.url)
				.success(function(data, info){
					console.log(info);
					console.log(data);
					status.status = 'success';
				})
				.error(function(data, info){
					console.log(info);
					if (info == 404) {
						status.status = 'warning';	
					} else{
						status.status = 'fail';
					};
					
				})
			return status.status;	
		}
	}])
	.controller('appController', ['$scope', function($scope){}])
	.controller('navController', ['$scope', function($scope){}])
	.controller('statusController', ['$scope', 'statusList', 'statusCheck', function($scope, statusList, statusCheck) {
	  // $scope.name = 'Hola!';

	  $scope.statusList = statusList.get();
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
	  		id: statusList.idGenerator.generate(),
	  		name: $scope.newStatus.newStatusName,
	  		url: $scope.newStatus.newStatusUrl,
	  		status: 'warning',
	  		meta: {
	  			code: null,
	  			description: "sdfusdhfasdf;kashdf;asdf s ;dfuhas;dfuhas;dfuhasd fasd ;fasdhfa;sdhfas ;dfh",
	  			visibility: $scope.availability
	  		},

	  	}
	  	statusList.add(status);
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
	  	console.log('send status ping: ' + status.url);
	  	status.status = statusCheck.check(status);
	  }

	}]);

// status.controller();