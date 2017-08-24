<?php
/**
 * Created by PhpStorm.
 * User: q
 * Date: 27.01.2016
 * Time: 20:24
 */

namespace app\repository;

/**
 * Заказы
 * Class RepositoryOrders
 * @package app\repository
 */
class RepositoryOrders extends Repository
{

    public $tableName = 'orders';

    /**
     * @param $userId
     * @return array
     */
    public function getOrdersByUserId($userId)
    {
        return $this->getByFieldName('user_id', $userId);
    }


    /**
     * @param $userId
     * @param $email
     * @param $sum
     * @param $discount
     * @param $isPaid
     * @return bool|string
     */
    public function create($userId, $email, $sum, $discount, $isPaid)
    {
        return $this->insert([
            'user_id'    => $userId,
            'email'      => $email,
            'sum'        => $sum,
            'discount'   => $discount,
            'is_paid'    => $isPaid,
            'created_at' => date('Y-m-d H:i:s'),
        ]);
    }

    /**
     * Отметить как оплаченный
     * @param $orderId
     * @return int
     */
    public function markPaid($orderId)
    {
        return $this->update($orderId, ['is_paid' => true]);
    }
}