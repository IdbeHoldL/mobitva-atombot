<?php
/**
 * Created by PhpStorm.
 * User: q
 * Date: 27.01.2016
 * Time: 20:24
 */

namespace app\repository;

/**
 * Сессии бота
 * Class RepositoryBotSessions
 * @package app\repository
 */
class RepositoryBotSessions extends Repository
{

    public $tableName = 'bot_sessions';


    /**
     * @param $sessionKey
     * @return array
     */
    public function getBySessionKey($sessionKey)
    {
        return $this->getOneByFieldName('session_key', $sessionKey);
    }

    /**
     * @param $userId
     * @param $licenseId
     * @param $sessionKey
     * @param $ip
     * @return int
     */
    public function create($userId, $licenseId, $sessionKey, $ip)
    {
        return $this->insert([
            'user_id'     => $userId,
            'license_id'  => $licenseId,
            'session_key' => $sessionKey,
            'ip'          => $ip,
            'created_at'  => date('Y-m-d H:i:s'),
        ]);
    }

}