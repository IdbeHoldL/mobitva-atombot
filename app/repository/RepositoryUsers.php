<?php
/**
 * Created by PhpStorm.
 * User: q
 * Date: 27.01.2016
 * Time: 20:24
 */

namespace app\repository;

/**
 * Пользователи
 * Class RepositoryUsers
 * @package app\repository
 */
class RepositoryUsers extends Repository
{

    public $tableName = 'users';

    /**
     * @param $password
     * @param $salt
     * @return string
     */
    public function generatePasswordHash($password, $salt)
    {
        return md5(md5($password . $salt));
    }

    /**
     * @param $email
     * @return mixed
     */
    public function getUserByEmail($email)
    {
        return $this->db->fetchAssoc("SELECT * FROM " . $this->tableName . " WHERE email = ?", [$email]);
    }

    /**
     * @param $restoreKey
     * @return mixed
     */
    public function getUserByRestoreKey($restoreKey)
    {
        return $this->db->fetchAssoc("SELECT * FROM " . $this->tableName . " WHERE restore_key = ?", [$restoreKey]);
    }

    /**
     * @param      $email
     * @param null $password
     * @return int
     */
    public function create($email, $password = null)
    {

        $restoreKey = md5($email . microtime());

        $salt         = ($password) ? md5(microtime()) : '';
        $passwordHash = ($password) ? $this->generatePasswordHash($password, $salt) : '';

        return $this->insert([
            'email'       => $email,
            'password'    => $passwordHash,
            'salt'        => $salt,
            'is_active'   => ($password) ? true : false,
            'restore_key' => ($password) ? null : $restoreKey,
            'api_key'     => md5(md5($email . 'mobitva-bot-api')),
            'created_at'  => date('Y-m-d H:i:s'),
        ]);
    }
}