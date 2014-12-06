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
.factory("transformRequestAsFormPost", [function() {
                // I prepare the request data for the form post.
                function transformRequest( data, getHeaders ) {
                    var headers = getHeaders();
                    headers[ "Content-type" ] = "application/x-www-form-urlencoded; charset=utf-8";
                    return( serializeData( data ) );
                }
                // Return the factory value.

                return( transformRequest );
                // I serialize the given Object into a key-value pair string. This
                // method expects an object and will default to the toString() method.
                // --
                // NOTE: This is an atered version of the jQuery.param() method which
                // will serialize a data collection for Form posting.
                // --
                // https://github.com/jquery/jquery/blob/master/src/serialize.js#L45
                function serializeData( data ) {
                    // If this is not an object, defer to native stringification.
                    if (!angular.isObject(data)) {
                        return( ( data == null ) ? "" : data.toString() );
                    }
                    var buffer = [];
                    // Serialize each key in the object.
                    for ( var name in data ) {
                        if ( ! data.hasOwnProperty( name ) ) {
                            continue;
                        }
                        var value = data[ name ];
                        buffer.push(
                            encodeURIComponent( name ) +
                            "=" +
                            encodeURIComponent( ( value == null ) ? "" : value )
                        );
                    }
                    // Serialize the buffer and clean it up for transportation.
                    var source = buffer
                        .join( "&" )
                        .replace( /%20/g, "+" )
                    ;
                    return( source );
                }
     }])
	.factory('AuthService', ['$http', 'Session', function($http, Session){

	}])

	.factory('statusList', ['$http', '$q', 'transformRequestAsFormPost', function($http, $q, transformRequestAsFormPost){

		var statusEndpoint = 'http://localhost:8080/status/api/';


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
				transformRequest: transformRequestAsFormPost,
				headers: {
					'AuthToken': 'Token dicks',
					'Content-Type': 'application/x-www-form-urlencoded'
				},
				data: {
					ID: status.ID,
					StatusName: status.StatusName,
					StatusUrl: status.StatusUrl,
					StatusMeta: JSON.stringify(status.StatusMeta)
					}
			})
			return statusPromise;
		}
		function updateStatus(status){
			statusList.push(status);
		}

		function removeStatus(statusId){
			return $http({
				method: 'DELETE',
				url: statusEndpoint + "status/" + statusId,
				headers: {
					'AuthToken' : 'Token dicks'
				}
			});
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
				url: status.StatusUrl
			})	
		}
	}])
	.controller('appController', ['$scope', function($scope){}])
	.controller('navController', ['$scope', function($scope){}])
	.controller('statusController', ['$scope', 'statusList', 'statusCheck', function($scope, statusList, statusCheck) {
	  // $scope.name = 'Hola!';

	  $scope.statusList = [];

	  var statusPromise = statusList.get();

	  statusPromise.then(
	  	function(response){
	  		$.each(response.data, function(){
	  			$scope.statusList.push(this);	
	  		})
		}, 
		function(error){
			console.log(error);
			alert(error.data);
		})

	  $scope.newStatus = {
	  	newStatusName: null,
	  	newStatusUrl: null,
	  	availability: ['public', 'private'],
	  	StatusMeta: {
  			ID: null,
  			LastResponseCode: null,
  			LastTestTime: null,
  			CreationDate: null,
  			Description: null,
  			Visibility: null
	  	}
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
	  			Description: $scope.newStatus.StatusMeta.Description,
	  			Visibility: $scope.selectModel
	  		}
	  	}
	  	var statusResult = $scope.testStatus(status);
	  	console.log(statusResult);
	  	if (statusResult == 200) {
			var statusPromise = statusList.add(status);
		  	statusPromise.then(
		  		function(response){
  					var json = response.data;
	  				console.log(json);
					$scope.statusList.push(json);
				}, 
				function(error){
					console.log(error);
				})	  		
	  	}else {
	  		var cnf = confirm("your status URL is returning with an error (status code"+ statusResult +"), are you sure it's correct? Press 'OK' to add it anyway");
	  		if (cnf) {
	  			var statusPromise = statusList.add(status);
			  	statusPromise.then(function(response){
			  			var json = response.data;
			  			console.log(json);
						$scope.statusList.push(json);
					}, function(error){
						console.log(error);
					})
			}
	  	}


	  };

	  $scope.removeStatus = function(status){
	  	var deletePromise = statusList.remove(status.ID);
	  	deletePromise.then(function(response){
	  		console.log(response.data);
		  	var index = $scope.statusList.indexOf(status);
		  	if (index > -1) {
		  		$scope.statusList.splice(index, 1);
		  	};	  		
	  	},function(error){
	  		console.log(error);
	  	})
	  }

	  $scope.testStatus = function(status){
	  	var statusResult;

	  	console.log('send status ping: ' + status.StatusUrl);
	  	statusCheck.check(status).then(function(result){
	  		statusResult = result;
	  		console.log(result);
	  	}, function(error){
	  		statusResult = error;
	  		console.log(error);
	  	});

	  	return statusResult;
	  }

	}]);

// status.controller();