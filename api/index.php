<?php
require __DIR__.'/vendor/autoload.php';
require __DIR__.'/vendor/Trendy/Status.php';
$app = new \Slim\Slim();

date_default_timezone_set('America/New_York'); // put here default timezone


$app->get('/', function(){
	echo 'welcome to the status api';

});
//get

$app->get('/statuses', function(){
	echo json_encode(Status::getAll());
});


$app->get('/status/:id', function($id) use ($app){
	echo json_encode(Status::get($id));
}); 
$app->get('/status/search/:query', function(){
	echo '{"message": "not yet implemented"}';
}); 


//post
$app->post('/status', function() use ($app){
	$return = array();
	$params = $app->request()->post();
	$data = array_keys($params);
	echo json_encode($data[0]);
	die();
	// $StatusName = ($params['StatusName'] !== null) ? stripslashes((string)$params['StatusName']) : "default";
	
	if ( urlencode(urldecode($params['StatusUrl'])) === $params['StatusUrl']){
	    $StatusUrl = $params['StatusUrl'];
	} else {
	    $StatusUrl = urldecode($params['StatusUrl']);
	}

 
	$status = array(
		'ID' 			=> rand(),
		'StatusName' 	=> $StatusName,
		'StatusUrl'		=> $StatusUrl
	);

	$status = Status::createStatus(json_encode($status));
	echo json_encode($status);
});

//put
$app->put('/status/:id', function() use ($app){
	echo '{"message": "not yet implemented"}';
});

//delete
$app->delete('/status/:id', function() use ($app){
	echo '{"message": "not yet implemented"}';
});
$app->run();