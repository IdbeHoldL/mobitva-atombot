<?php
/**
 * Created by PhpStorm.
 * User: q
 * Date: 27.01.2016
 * Time: 20:24
 */

namespace app\repository;

/**
 * Выставленные к оплате счета
 * Class RepositoryInvoices
 * @package app\repository
 */
class RepositoryInvoices extends Repository
{

    public $tableName = 'invoices';

    /**
     * @param $orderId
     * @param $uid
     * @param $sum
     * @param $commissionAmount
     * @param $data
     * @return int
     */
    public function create($orderId, $uid, $sum, $commissionAmount, $data)
    {
        return $this->insert([
            'order_id'          => $orderId,
            'uid'               => $uid,
            'sum'               => $sum,
            'commission_amount' => $commissionAmount,
            'data'              => $data,
            'created_at'        => date('Y-m-d H:i:s'),
        ]);
    }
}