<?php
/**
 * Created by PhpStorm.
 * User: q
 * Date: 27.01.2016
 * Time: 20:24
 */

namespace app\repository;

class RepositoryLicenses extends Repository
{

    public $tableName = 'licenses';

    /**
     * Найти все лизензии пользователя
     * @param $userId
     * @return array
     */
    public function getAllByUserId($userId)
    {
        return $this->getByFieldName('user_id', $userId);
    }

    /**
     * Найти только активные лицензии пользователя
     * @param $userId
     * @return array
     */
    public function getActiveByUserId($userId)
    {
        return $this->db->fetchAll("SELECT * FROM " . $this->tableName . " WHERE expired_at > now() AND user_id = ?", [$userId]);
    }


    /**
     * Получить по ключу
     * @param $licenseKey
     * @return array
     */
    public function getByLicenseKey($licenseKey)
    {
        return $this->getOneByFieldName('license_key', $licenseKey);
    }

    /**
     * Продлить лицензию
     * @param integer $licenceId
     * @param integer $month количество месяцев
     * @return bool|int
     */
    public function prolong($licenceId, $month)
    {
        if (!$licence = $this->getByPk($licenceId)) {
            return false;
        }

        $expiredTime = strtotime($licence['expired_at']);
        if ($expiredTime < time()) {
            $expiredTime = time();
        }

        $expiredAt = date("Y-m-d H:i:s", strtotime("+$month month", $expiredTime));

        return ($this->update($licenceId, ['expired_at' => $expiredAt])) ? $expiredAt : false;
    }

    /**
     * @param $userId
     * @param $month
     * @return int
     */
    public function create($userId, $month)
    {
        return $this->insert([
            'user_id'     => $userId,
            'license_key' => md5('mobitva-bot-license' . $userId . microtime()),
            'created_at'  => date('Y-m-d H:i:s'),
            'expired_at'  => date("Y-m-d 23:59:59", strtotime("+$month month")),
        ]);
    }

    /**
     * todo: remove it
     * @param $userId
     * @return bool|int
     */
    public function createTrial($userId)
    {

        return false;

        return $this->insert([
            'user_id'     => $userId,
            'license_key' => md5('mobitva-bot-license' . $userId . microtime()),
            'created_at'  => date('Y-m-d H:i:s'),
            'expired_at'  => date("Y-m-d 23:59:59", strtotime("+3 day")),
        ]);
    }
}