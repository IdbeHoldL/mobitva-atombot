<?php


/**
 * АВТОРИЗАЦИЯ
 */
$app->get('/api/login/{licenseKeyHash}', function ($licenseKeyHash) use ($app) {


    try {
        $licenseKeyHash = str_replace('_', '/', $licenseKeyHash);
        $licenseKey     = array_pop(unpack("H*", base64_decode($licenseKeyHash)));


        /* @var $licensesRepository \app\repository\RepositoryLicenses */
        $licensesRepository = $app['repository.licenses'];
        /* @var $botSessionsRepository \app\repository\RepositoryBotSessions */
        $botSessionsRepository = $app['repository.bot_sessions'];


        // todo: добавить проверку юзер-агента

        if (!$license = $licensesRepository->getByLicenseKey($licenseKey)) {
            throw new Exception('Неверный LicenseKey');
        }
        if (strtotime($license['expired_at']) < time()) {
            throw new Exception('Время действия лицензии ' . $license['id'] . ' истекло.');
        }
        if (!$license['is_active']) {
            throw new Exception('Лицензия ' . $license['id'] . ' неактивна.');
        }
        $sessionKey = md5(md5($license['license_key'] . microtime()));

        if (!$sessionId = $botSessionsRepository->create($license['user_id'], $license['id'], $sessionKey, $_SERVER['REMOTE_ADDR'])) {
            throw new Exception('Не удалось установить соединение с сервером');
        }
        if (!$licensesRepository->update($license['id'], ['last_session_id' => $sessionId])) {
            throw new Exception('Не удалось установить соединение с сервером');
        }


    } catch (Exception $e) {

        return AtomBotApi::error($e->getMessage());
    }

    return AtomBotApi::success([
        'session_key' => $sessionKey,
    ]);
});


$app->get('test_bot', function () use ($app) {

    return $app['twig']->render('test_bot.twig.html', []);

});


/**
 * Контроль
 */
$app->get('/api/c/{sessionKey}/{controlHash}/{hash}', function ($controlHash, $sessionKey, $hash) use ($app) {

    try {

        AtomBotApi::checkRequest($app, $sessionKey, $hash);

        return AtomBotApi::success([
            'c' => md5($controlHash . AtomBotApi::$apiSalt),
        ]);

    } catch (Exception $e) {
        return AtomBotApi::error($e->getMessage());
    }
});

/**
 * Версия
 */
$app->get('/api/get-atombot-version', function () use ($app) {
    return '1.9.4.6';
});

/**
 * Версия (ресурсы бота)
 */
$app->get('/api/get-res-hash', function () use ($app) {

    return md5(file_get_contents(ROOT . 'web/files/mobitvaAtomBot/res0.dat'));

});


/**
 * Исходники бота (javascript)
 */
$app->get('/api/get-core/{sessionKey}/{hash}', function ($sessionKey, $hash) use ($app) {

    try {
        $includeJs = [
            'AtomBot/core/_prev.js',
            'AtomBot/core/AtomBotAutoitCommand.js',
            'AtomBot/core/AtomBotScreen.js',
            'AtomBot/core/AtomBotTask.js',
            'AtomBot/core/AtomBot.js',
            'AtomBot/mobitva/tasks/MobitvaBotDefaultTask.js',
            'AtomBot/mobitva/tasks/MobitvaBotDuelTask.js',
            'AtomBot/mobitva/tasks/MobitvaBotHuntTask.js',
            'AtomBot/mobitva/tasks/MobitvaBotQuestVigorTask.js',
            'AtomBot/mobitva/tasks/MobitvaBotRobberyTask.js',
            'AtomBot/mobitva/tasks/MobitvaBotRobberyAttackTask.js',
            'AtomBot/mobitva/tasks/MobitvaBotSleepTask.js',
            'AtomBot/mobitva/tasks/MobitvaBotSurviveTask.js',
            'AtomBot/mobitva/tasks/MobitvaBotWallTask.js',
            'AtomBot/mobitva/MobitvaBotAutoitCommand.js',
            'web/scripts/locations_and_mobs.js',
            'AtomBot/mobitva/Graph.js',
            'AtomBot/mobitva/MobitvaAtomBot.js',
            'AtomBot/mobitva/mobitva_bot.js',
        ];

        $allJs = '';
        foreach ($includeJs as $jsPath) {
            $allJs .= file_get_contents(ROOT . $jsPath) . "\r\n";
        }

        return \JShrink\Minifier::minify($allJs);

    } catch (Exception $e) {
        return AtomBotApi::error($e->getMessage());
    }
});


/**
 * Список настроек бота (javascript)
 */
$app->get('/api/get-settings-list/{sessionKey}/{hash}', function ($sessionKey, $hash) use ($app) {

    try {
        list($license, $botSession) = AtomBotApi::checkRequest($app, $sessionKey, $hash);

        /* @var $settingsRepository \app\repository\RepositorySettings */
        $settingsRepository = $app['repository.settings'];

        $settingsList = $settingsRepository->getAllByUserId($license['user_id']);

        $result = [];

        foreach ($settingsList as $settings) {
            $result[] = [
                $settings['id'],
                $settings['name'],
            ];
        }

        return json_encode($result, JSON_UNESCAPED_UNICODE);

    } catch (Exception $e) {
        return AtomBotApi::error($e->getMessage());
    }
});


/**
 * Список настроек бота (javascript)
 */
$app->get('/api/get-configs-list/{sessionKey}/{hash}', function ($sessionKey, $hash) use ($app) {

    try {
        list($license, $botSession) = AtomBotApi::checkRequest($app, $sessionKey, $hash);

        /* @var $configsRepository \app\repository\RepositoryConfigs */
        $configsRepository = $app['repository.configs'];

        $configsList = $configsRepository->getAllByUserId($license['user_id']);

        $result = [];

        foreach ($configsList as $config) {
            $result[] = [
                $config['id'],
                $config['name'],
            ];
        }

        return json_encode($result, JSON_UNESCAPED_UNICODE);

    } catch (Exception $e) {
        return AtomBotApi::error($e->getMessage());
    }
});

/**
 * Список настроек бота (javascript)
 */
$app->get('/api/get-license-info/{sessionKey}/{hash}', function ($sessionKey, $hash) use ($app) {


    try {
        list($license, $botSession) = AtomBotApi::checkRequest($app, $sessionKey, $hash);

        return AtomBotApi::success([
            'license_id' => $license['id'],
            'days_left'  => ceil((strtotime($license['expired_at']) - time()) / 84000),
            'expired_at' => date('d.m.Y', strtotime($license['expired_at'])),
        ]);

    } catch (Exception $e) {
        return AtomBotApi::error($e->getMessage());
    }

});


$app->get('/api/get-config/{sessionKey}/{configId}/{hash}', function ($sessionKey, $hash, $configId) use ($app) {


    try {
        list($license, $botSession) = AtomBotApi::checkRequest($app, $sessionKey, $hash);

        if ($configId) {
            /* @var $configsRepository \app\repository\RepositoryConfigs */
            $configsRepository = $app['repository.configs'];

            if (!$config = $configsRepository->getByPk($configId)) {
                throw new Exception('Алгоритм не найден');
            }

            $configBody = $config['body'];
        } else {
            $configBody = '[["default",[]]]';
        }


        return AtomBotApi::success([
            'config' => $configBody,
        ]);

    } catch (Exception $e) {
        return AtomBotApi::error($e->getMessage());
    }
});


$app->get('/api/get-setting/{sessionKey}/{settingId}/{hash}', function ($sessionKey, $hash, $settingId) use ($app) {


    try {
        list($license, $botSession) = AtomBotApi::checkRequest($app, $sessionKey, $hash);

        if ($settingId) {
            /* @var $settingsRepository \app\repository\RepositorySettings */
            $settingsRepository = $app['repository.settings'];

            if (!$settings = $settingsRepository->getByPk($settingId)) {
                throw new Exception('Конфигурация не найдена');
            }

            $settingBody = $settings['body'];
        } else {
            // дефолтные настройки
            $settingBody = json_encode([
                'comboArray'         => [
                    2,
                    3,

                    3,
                    2,
                    2,

                    2,
                    1,
                    1,
                    1,
                ],
                'useBlock'           => true,
                'useFlask'           => true,
                'useSmartFightDelay' => true,
                'startBlockTurn'     => 15,
                'useFlaskStartTurn'  => 2,
                'useFlaskStep'       => 5,
                'afterFightDelay'    => 20,
            ]);
        }

        return AtomBotApi::success([
            'setting' => $settingBody,
        ]);

    } catch (Exception $e) {
        return AtomBotApi::error($e->getMessage());
    }
});