<?php
/**
 * Created by PhpStorm.
 * User: q
 * Date: 27.01.2016
 * Time: 20:24
 */

namespace app\repository;

/**
 * Позиции заказов
 * Class RepositoryOrderItems
 * @package app\repository
 */
class RepositoryOrderItems extends Repository
{

    public $tableName = 'order_items';

    /**
     * @param $orderId
     * @param $productId
     * @param $count
     * @param $sum
     * @param $discount
     * @param $licenseId
     * @return int
     */
    public function create($orderId, $productId, $count, $sum, $discount, $licenseId)
    {
        return $this->insert([
            'order_id'   => $orderId,
            'product_id' => $productId,
            'count'      => $count,
            'sum'        => $sum,
            'discount'   => $discount,
            'license_id' => $licenseId,
        ]);
    }

    /**
     * Получить по номеру заказа
     * @param $orderId
     * @return array
     */
    public function getByOrderId($orderId)
    {
        return $this->getByFieldName('order_id', $orderId);
    }
}