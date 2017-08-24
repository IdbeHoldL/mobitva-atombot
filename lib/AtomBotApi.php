<?php

/**
 * Created by PhpStorm.
 * User: q
 * Date: 14.02.2016
 * Time: 18:40
 */
class AtomBotApi
{

    public static $apiSalt = '25e6b3c74f43efec6caec3e3a47c6dea';

    /**
     * @param string $errorMessage
     * @return string
     */
    public static function error($errorMessage = 'Неизвестная ошибка')
    {
        return implode(['ERROR', $errorMessage,], '>>>');
    }

    /**
     * @param $assocArray
     * @return string
     */
    public static function success($assocArray)
    {
        $parts = [];
        foreach ($assocArray as $key => $value) {
            $parts[] = $key . '=' . $value;
        }
        $strParams = implode($parts, '&');

        // SUCCESS:key_1=value_1&key_2=value_2:25e6b3c74f43efec6caec3e3a47c6dea
        return implode([
            'SUCCESS',
            $strParams,
            md5(md5(self::$apiSalt . $strParams)),
        ], '>>>');
    }

    /**
     * @param $app
     * @param $sessionKey
     * @param $hash
     * @return array
     * @throws Exception
     */
    public static function checkRequest($app, $sessionKey, $hash)
    {
        /* @var $botSessionsRepository \app\repository\RepositoryBotSessions */
        $botSessionsRepository = $app['repository.bot_sessions'];
        /* @var $licensesRepository \app\repository\RepositoryLicenses */
        $licensesRepository = $app['repository.licenses'];

        if (!$botSession = $botSessionsRepository->getBySessionKey($sessionKey)) {
            throw new Exception('Неверный ключ сессии');
        }
        if (!$license = $licensesRepository->getByPk($botSession['license_id'])) {
            throw new Exception('Неверный номер лицензии');
        }
        if ($license['last_session_id'] != $botSession['id']) {
            throw new Exception('Ваша сессия истекла (возможно другой пользователь авторизовался под данной лицензией)');
        }
        if (strtotime($license['expired_at']) < time()) {
            throw new Exception('Время действия лицензии ' . $license['id'] . ' истекло.');
        }
        if (!$license['is_active']) {
            throw new Exception('Лицензия ' . $license['id'] . ' неактивна.');
        }

        $arr = explode('/', $_SERVER['REQUEST_URI']);
        array_pop($arr);
        $url = implode('/', $arr);
        if (md5($url . self::$apiSalt) != $hash) {
            throw new Exception('Неправильный хеш запроса!');
        }

        $botSessionsRepository->update($botSession['id'], [
            'last_request_time' => date('Y-m-d H:i:s'),
        ]);

        return [$license, $botSession];
    }

}