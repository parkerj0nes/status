<?php
require __DIR__.'/vendor/autoload.php';
require __DIR__.'/vendor/Trendy/Status.php';
$app = new \Slim\Slim();

$app->get('/', function(){
	echo 'welcome to the status api';

});

$app->get('/statuses', function(){
	echo json_encode(Status::getAll());
});

$app->get('/status/:id', function($id) use ($app){
	echo json_encode(Status::get($id));
}); 
$app->get('/status/search/:query', function(){
	echo '{"message": "not yet implemented"}';
}); 

$app->post('/status', function() use ($app){
	echo '{"message": "not yet implemented"}';
}); 
$app->put('/status/:id', function() use ($app){
	echo '{"message": "not yet implemented"}';
});
$app->delete('/status/:id', function() use ($app){
	echo '{"message": "not yet implemented"}';
});
$app->run();