<?php
require __DIR__.'/vendor/autoload.php';
$app = new \Slim\Slim();

$app->get('/status/all', 'getUsers'); // Using Get HTTP Method and process getUsers function
$app->get('/status/:id',    'getUser'); // Using Get HTTP Method and process getUser function
$app->get('/status/search/:query', 'findByName'); // Using Get HTTP Method and process findByName function
$app->post('/status', 'addUser'); // Using Post HTTP Method and process addUser function
$app->put('/status/:id', 'updateUser'); // Using Put HTTP Method and process updateUser function
$app->delete('/status/:id',    'deleteUser'); // Using Delete HTTP Method and process deleteUser function
$app->run();