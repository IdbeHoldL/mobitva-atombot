<?php

require_once __DIR__ . '/../vendor/autoload.php';

define("ROOT", __DIR__ . "/../");

session_start();

/* @var $app Silex\Application */
$app = new Silex\Application();

require_once __DIR__ . '/../app/config/config.php';
require_once __DIR__ . '/../app/controllers/index.php';
require_once __DIR__ . '/../app/controllers/privateoffice.php';
require_once __DIR__ . '/../app/controllers/api.php';
require_once __DIR__ . '/../app/repository/Repository.php';
require_once __DIR__ . '/../app/repository/RepositoryUsers.php';
require_once __DIR__ . '/../app/repository/RepositoryLicenses.php';
require_once __DIR__ . '/../app/repository/RepositoryOrders.php';
require_once __DIR__ . '/../app/repository/RepositoryOrderItems.php';
require_once __DIR__ . '/../app/repository/RepositoryConfigs.php';
require_once __DIR__ . '/../app/repository/RepositorySettings.php';
require_once __DIR__ . '/../app/repository/RepositoryInvoices.php';
require_once __DIR__ . '/../app/repository/RepositoryBotSessions.php';
require_once __DIR__ . '/../lib/WalletOne.php';
require_once __DIR__ . '/../lib/AtomBotApi.php';
//require_once __DIR__ . '/../a pp/repository/RepositoryOrderItem.php';
//require_once __DIR__ . '/../app/repository/RepositoryOrderStage.php';
//require_once __DIR__ . '/../app/repository/RepositoryProduct.php';

if (isset($_SESSION['user'])) {
    $app['current_user'] = $_SESSION['user'];
}

$app['version'] = "1.9.4.7";

$app->run();


