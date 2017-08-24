<?php

define('WMI_MERCHANT_ID', '');
define('WMI_CURRENCY_ID', '');
define('WMI_SUCCESS_URL', '');
define('WMI_FAIL_URL', '');
define('W1_SECRET_KEY', '');

$app['debug'] = true;

$app->register(new Silex\Provider\DoctrineServiceProvider(), [
    'db.options' => [
        'driver'   => 'pdo_mysql',
        'host'     => 'localhost',
        'dbname'   => 'mobitva_bot',
        'user'     => 'root',
        'password' => '',
        'charset'  => 'utf8',
    ],
]);

$app->register(new Silex\Provider\TwigServiceProvider(), [
    'twig.path' => __DIR__ . '/../views',
]);

$app['repository.users']    = $app->share(function () use ($app) {
    return new \app\repository\RepositoryUsers($app['db']);
});
$app['repository.orders']   = $app->share(function () use ($app) {
    return new \app\repository\RepositoryOrders($app['db']);
});
$app['repository.licenses'] = $app->share(function () use ($app) {
    return new \app\repository\RepositoryLicenses($app['db']);
});
$app['repository.configs']  = $app->share(function () use ($app) {
    return new \app\repository\RepositoryConfigs($app['db']);
});
$app['repository.settings'] = $app->share(function () use ($app) {
    return new \app\repository\RepositorySettings($app['db']);
});
$app['repository.invoices'] = $app->share(function () use ($app) {
    return new \app\repository\RepositoryInvoices($app['db']);
});


$app['WalletOne'] = $app->share(function () use ($app) {
    return new WalletOne(WMI_MERCHANT_ID, WMI_CURRENCY_ID, WMI_SUCCESS_URL, WMI_FAIL_URL, W1_SECRET_KEY);
});

