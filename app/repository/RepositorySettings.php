<?php
/**
 * Created by PhpStorm.
 * User: q
 * Date: 27.01.2016
 * Time: 20:24
 */

namespace app\repository;

/**
 * Настройки
 * Class RepositorySettings
 * @package app\repository
 */
class RepositorySettings extends Repository
{

    public $tableName = 'settings';

    /**
     * @param $userId
     * @return array
     */
    public function getAllByUserId($userId)
    {
        return $this->getByFieldName('user_id', $userId);
    }

    /**
     * @param $userId
     * @param $name
     * @param $body
     * @return int
     */
    public function create($userId, $name, $body)
    {

        return $this->insert([
            'user_id'    => $userId,
            'name'       => $name,
            'body'       => $body,
            'created_at' => date('Y-m-d H:i:s'),
        ]);
    }
}