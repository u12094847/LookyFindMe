<?php

use Ratchet\Server\IoServer;
use FinderApp\Finder;

require dirname(__DIR__) . '/vendor/autoload.php';

$server = IoServer::factory(
                new Finder(), 8003
);

$server->run();
