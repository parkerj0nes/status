<?php
require __DIR__.'/vendor/autoload.php';
require __DIR__.'/vendor/Trendy/Status.php';
$app = new \Slim\Slim();

date_default_timezone_set('America/New_York'); // put here default timezone


$app->get('/', function(){
	echo 'welcome to the status api';

});
//get

$app->get('/statuses', function() use ($app){
	$response = $app->response();
	$response->header('Access-Control-Allow-Origin', '*');
	$response->write(json_encode(Status::getAllStatus()));
});


$app->get('/status/:id', function($id) use ($app){
	$response = $app->response();
	$response->header('Access-Control-Allow-Origin', '*');
	$response->write(json_encode(Status::get($id)));
}); 
$app->get('/status/search/:query', function(){
	echo '{"message": "not yet implemented"}';
}); 


//post
$app->post('/status', function() use ($app){
	$return = array();
	$params = $app->request()->post();
	$StatusName = ($params['StatusName'] !== null) ? stripslashes((string)$params['StatusName']) : "default";
	if ( urlencode(urldecode($params['StatusUrl'])) === $params['StatusUrl']){
	    $StatusUrl = $params['StatusUrl'];
	} else {
	    $StatusUrl = urldecode($params['StatusUrl']);
	}

	$status = array(
		'ID' 			=> $params['ID'],
		'StatusName' 	=> $StatusName,
		'StatusUrl'		=> $StatusUrl,
		'StatusMeta'	=> $params['StatusMeta']
	);

	$status = Status::createStatus(json_encode($status));
	echo json_encode($status);
});

//put
$app->put('/status/:id', function() use ($app){
	echo '{"message": "not yet implemented"}';
});

//delete
$app->delete('/status/:id', function($id) use ($app){
	$status = Status::get($id);
	$response = $app->response();
	$response->write($status->deleteStatus());
});
$app->run();