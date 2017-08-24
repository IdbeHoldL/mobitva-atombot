<?php
// todo : разнести в разные контроллеры

/**
 * Домашняя страница
 */
$app->get('/', function () use ($app) {
    return $app['twig']->render('index/index.twig', []);
});


/**
 * Форма создания настроек
 */
$app->get('/settings/create', function () use ($app) {

    if (!isset($_SESSION['user'])) {
        return $app->redirect('/');
    }

    return $app['twig']->render('index/settingsForm.twig.html', []);
});

/**
 * Форма создания настроек (submit)
 */
$app->get('/settings/submit', function () use ($app) {

    if (!isset($_SESSION['user'])) {
        return $app->redirect('/');
    }
    $user = $_SESSION['user'];

    /* @var $settingsRepository \app\repository\RepositorySettings */
    $settingsRepository = $app['repository.settings'];

    $settingsId   = isset($_REQUEST['id']) ? $_REQUEST['id'] : '';
    $settingsName = isset($_REQUEST['name']) ? $_REQUEST['name'] : '';
    $settingsData = isset($_REQUEST['data']) ? $_REQUEST['data'] : '';

    if ($settingsId && ($settings = $settingsRepository->getByPk($settingsId))) {

        if ($user['id'] != $settings['user_id']) {
            return json_encode([
                'result'      => false,
                'settings_id' => 0,
            ]);
        }
        $settingsRepository->update($settingsId, [
            'user_id' => $user['id'],
            'name'    => $settingsName,
            'body'    => $settingsData,
        ]);

        return json_encode([
            'result'      => true,
            'settings_id' => $settingsId,
        ]);
    } else {

        if ($settingsId = $settingsRepository->create($user['id'], $settingsName, $settingsData)) {
            return json_encode([
                'result'      => true,
                'settings_id' => $settingsId,
            ]);
        }
    }

    return json_encode([
        'result'      => false,
        'settings_id' => 0,
    ]);
});

/**
 * Форма редактирования настройки
 */
$app->get('/settings/{settingsId}/edit', function ($settingsId) use ($app) {

    if (!isset($_SESSION['user'])) {
        return $app->redirect('/');
    }
    $user = $_SESSION['user'];

    /* @var $settingsRepository \app\repository\RepositorySettings */
    $settingsRepository = $app['repository.settings'];

    $settings = $settingsRepository->getByPk($settingsId);
    if ($user['id'] != $settings['user_id']) {
        return $app->redirect('/');
    }

    return $app['twig']->render('index/settingsForm.twig.html', [
        'settings' => $settings,
    ]);
});

/**
 * Удаление настройки
 */
$app->get('/settings/{settingId}/delete', function ($settingId) use ($app) {

    if (!isset($_SESSION['user'])) {
        return $app->redirect('/');
    }
    $user = $_SESSION['user'];

    /* @var $settingsRepository \app\repository\RepositorySettings */
    $settingsRepository = $app['repository.settings'];

    if (!$settings = $settingsRepository->getByPk($settingId)) {
        return json_encode(['result' => false]);
    }
    if ($user['id'] != $settings['user_id']) {
        return json_encode(['result' => false]);
    }
    if ($settingsRepository->delete($settingId)) {
        return json_encode(['result' => true]);
    }
});


// ----------------------------------------------------------------------------------------------------------------

/**
 * Форма создания алгоритма
 */
$app->get('/config/create', function () use ($app) {

    if (!isset($_SESSION['user'])) {
        return $app->redirect('/');
    }

    return $app['twig']->render('index/configForm.twig', []);
});

/**
 * Удаление алгоритма
 */
$app->get('/config/{configId}/delete', function ($configId) use ($app) {

    if (!isset($_SESSION['user'])) {
        return $app->redirect('/');
    }
    $user = $_SESSION['user'];

    /* @var $configRepository \app\repository\RepositoryConfigs */
    $configRepository = $app['repository.configs'];

    if (!$config = $configRepository->getByPk($configId)) {
        return json_encode(['result' => false]);
    }
    if ($user['id'] != $config['user_id']) {
        return json_encode(['result' => false]);
    }

    if ($configRepository->delete($configId)) {
        return json_encode(['result' => true]);
    }

});
/**
 * Форма редактирования алгоритма
 */
$app->get('/config/{configId}/edit', function ($configId) use ($app) {

    if (!isset($_SESSION['user'])) {
        return $app->redirect('/');
    }
    $user = $_SESSION['user'];

    /* @var $configRepository \app\repository\RepositoryConfigs */
    $configRepository = $app['repository.configs'];

    $config = $configRepository->getByPk($configId);
    if ($user['id'] != $config['user_id']) {
        return $app->redirect('/');
    }

    return $app['twig']->render('index/configForm.twig', [
        'config' => $config,
    ]);
});


$app->get('/config/submit', function () use ($app) {

    if (!isset($_SESSION['user'])) {
        return $app->redirect('/');
    }
    $user = $_SESSION['user'];

    /* @var $configRepository \app\repository\RepositoryConfigs */
    $configRepository = $app['repository.configs'];

    $configId   = isset($_REQUEST['id']) ? $_REQUEST['id'] : '';
    $configName = isset($_REQUEST['name']) ? $_REQUEST['name'] : '';
    $configData = isset($_REQUEST['data']) ? $_REQUEST['data'] : '';

    if ($configId && ($config = $configRepository->getByPk($configId))) {

        if ($user['id'] != $config['user_id']) {
            return json_encode([
                'result'    => false,
                'config_id' => 0,
            ]);
        }
        $configRepository->update($configId, [
            'user_id' => $user['id'],
            'name'    => $configName,
            'body'    => $configData,
        ]);

        return json_encode([
            'result'    => true,
            'config_id' => $configId,
        ]);
    } else {

        if ($configId = $configRepository->create($user['id'], $configName, $configData)) {
            return json_encode([
                'result'    => true,
                'config_id' => $configId,
            ]);
        }
    }

    return json_encode([
        'result'    => false,
        'config_id' => 0,
    ]);
});


/**
 * WalletOne invoice result
 */
$app->post('/invoice-result/w1', function () use ($app) {

    $printAnswer = function ($result, $description) {
        return "WMI_RESULT=" . strtoupper($result) . "&" . "WMI_DESCRIPTION=" . urlencode($description);
    };

    try {

        /* @var $w1 WalletOne */
        $w1 = $app['WalletOne'];

        $requiredFields = [
            'WMI_SIGNATURE',
            'WMI_PAYMENT_NO',
            'WMI_ORDER_STATE',
        ];

        // проверка обязательных параметров
        foreach ($requiredFields as $paramName) {
            if (!isset($_POST[$paramName])) {
                throw new Exception('Отсутствует параметр WMI_SIGNATURE');
            }
        }

        // проверка цифровой подписи
        if (!$w1->checkSignature($_POST, false)) {
            throw new Exception('Неверная подпись ' . $_POST["WMI_SIGNATURE"]);
        }

        // проверка статуса заказа
        if (strtoupper($_POST["WMI_ORDER_STATE"]) != "ACCEPTED") {
            throw new Exception('Неверное состояние ' . $_POST["WMI_ORDER_STATE"]);
        }

        /* @var $ordersRepository \app\repository\RepositoryOrders */
        $ordersRepository = $app['repository.orders'];
        /* @var $orderItemsRepository \app\repository\RepositoryOrderItems */
        $orderItemsRepository = $app['repository.order_items'];
        /* @var $invoicesRepository \app\repository\RepositoryInvoices */
        $invoicesRepository = $app['repository.invoices'];
        /* @var $licensesRepository \app\repository\RepositoryLicenses */
        $licensesRepository = $app['repository.licenses'];

        if (!$order = $ordersRepository->getByPk($_POST['WMI_PAYMENT_NO'])) {
            throw new Exception('Неизвестный номер заказа ' . $_POST['WMI_PAYMENT_NO']);
        }

        if (!$invoice = $invoicesRepository->create($order['id'], $_POST['WMI_ORDER_ID'], $_POST['WMI_PAYMENT_AMOUNT'], $_POST['WMI_COMMISSION_AMOUNT'], serialize($_POST))) {
            throw new Exception('Ошибка БД: Невозможно создать запись');
        }

        // создание/продление лицензий
        try {

            if (!$order['is_paid']) {
                $ordersRepository->markPaid($order['id']);

                $orderItems = $orderItemsRepository->getByOrderId($order['id']);

                foreach ($orderItems as $orderItem) {

                    // если передан license_id - нужно продлить лицензию
                    if ($orderItem['license_id']) {
                        $licensesRepository->prolong($orderItem['license_id'], $orderItem['count']);
                    } else {
                        $licenseId = $licensesRepository->create($order['user_id'], $orderItem['count']);
                        $orderItemsRepository->update($orderItem['id'], ['license_id' => $licenseId]);
                    }
                }
            }

        } catch (Exception $e) {
            throw new Exception('Ошибка при обработке платежа');
        }


    } catch (Exception $e) {

        try {
            ob_start();
            var_dump($_POST);
            $messageBody = ob_get_clean();

            $message = \Swift_Message::newInstance()
                                     ->setSubject('Ошибка при создании заказа #' . $_POST['WMI_PAYMENT_NO'] . ' ' . date('Y-m-d H:i:s'))
                                     ->setFrom(['mobitva.atombot@mail.ru'])
                                     ->setTo(['mutasov.roman21@gmail.com'])
                                     ->setBody($messageBody, 'text/html');

            $app['mailer']->send($message);

        } catch (Exception $ee) {

        }

        return $printAnswer("Retry", $e->getCode() . ' : ' . $e->getMessage());
    }

    return 'WMI_RESULT=OK';
});

/**
 * Запрос восстановления пароля
 */
$app->post('/send-restore-email', function () use ($app) {

    $email = $_POST['email'];

    /* @var $usersRepository \app\repository\RepositoryUsers */
    $usersRepository = $app['repository.users'];

    if (!$user = $usersRepository->getUserByEmail($email)) {
        return json_encode([
            'result'  => false,
            'message' => 'Пользователь с таким email не зарегистрирован',
        ]);
    }

    $restoreKey = md5($email . microtime());
    $usersRepository->update($user['id'], ['restore_key' => $restoreKey]);

    try {
        $messageBody = $app['twig']->render('mail/restore.twig.html', [
            'subject'     => 'Восстановление пароля на сайте mobitva.atom-bot.ru',
            'restore_key' => $restoreKey,
        ]);

        $message = \Swift_Message::newInstance()
                                 ->setSubject('[mobitva.atom-bot.ru] Восстановление пароля')
                                 ->setFrom(['mobitva.atombot@mail.ru'])
                                 ->setTo([$email])
                                 ->setBody($messageBody, 'text/html');

        $app['mailer']->send($message);

    } catch (Exception $e) {
        return json_encode([
            'result'  => false,
            'message' => 'Данный функционал временно недоступен',
        ]);
    }


    return json_encode([
        'result'  => true,
        'message' => 'На указанный вами email отправлены  инструкции по восстановлению пароля',
    ]);
});

/**
 * СТАТИКА
 */

$app->get('/payment-info/webmoney-transfer', function () use ($app) {
    return $app['twig']->render('index/paymentInfoWebmoney.twig.html', []);
});

$app->get('/payment-info', function () use ($app) {
    return $app['twig']->render('index/paymentInfo.twig.html', []);
});

$app->get('/kemulator', function () use ($app) {
    return $app['twig']->render('index/kemulator.twig.html', []);
});

$app->get('/eula', function () use ($app) {
    return $app['twig']->render('index/eula.twig.html', []);
});

$app->get('/terms', function () use ($app) {
    return $app['twig']->render('index/terms.twig.html', []);
});

$app->get('/contacts', function () use ($app) {
    return $app['twig']->render('index/contacts.twig.html', []);
});

$app->get('/payback', function () use ($app) {
    return $app['twig']->render('index/payback.twig.html', []);
});


