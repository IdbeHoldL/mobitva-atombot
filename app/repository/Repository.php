<?php
/**
 * Created by PhpStorm.
 * User: q
 * Date: 12.02.2016
 * Time: 0:48
 */

namespace app\repository;

/**
 * Class Repository
 * @package app\repository
 */
abstract class Repository
{

    public $primaryKey = 'id';
    public $tableName  = '';

    /**
     * @var \Doctrine\DBAL\Connection
     */
    public $db;

    /**
     * @param $db
     */
    public function __construct($db)
    {
        $this->db = $db;
    }


    /**
     * Получить по id
     * @param $primaryKey
     * @return array
     */
    public function getByPk($primaryKey)
    {
        return $this->db->fetchAssoc("SELECT * FROM " . $this->tableName . " WHERE " . $this->primaryKey . " = ?", [$primaryKey]);
    }


    /**
     * Получить одну запись по значению поля
     * @param string $fieldName
     * @param string $fieldValue
     * @return array
     * @throws \Exception
     */
    public function getOneByFieldName($fieldName, $fieldValue)
    {
        return $this->db->fetchAssoc("SELECT * FROM " . $this->tableName . " WHERE " . $fieldName . " = ?", [$fieldValue]);
    }

    /**
     * Получить по значению поля
     * @param string $fieldName
     * @param string $fieldValue
     * @return array
     * @throws \Exception
     */
    public function getByFieldName($fieldName, $fieldValue)
    {
        return $this->db->fetchAll("SELECT * FROM " . $this->tableName . " WHERE " . $fieldName . " = ?", [$fieldValue]);
    }

    /**
     * Добавить запись
     * @param $fields
     * @return int
     */
    public function insert($fields)
    {
        return ($this->db->insert($this->tableName, $fields)) ? $this->db->lastInsertId() : false;
    }

    /**
     * Обновить запись
     * @param $primaryKey
     * @param $fields
     * @return int
     */
    public function update($primaryKey, $fields)
    {
        return $this->db->update($this->tableName, $fields, [$this->primaryKey => $primaryKey]);
    }

    /**
     * Удалить запись
     * @param $primaryKey
     * @return int
     * @throws \Doctrine\DBAL\Exception\InvalidArgumentException
     */
    public function delete($primaryKey)
    {
        return $this->db->delete($this->tableName, [$this->primaryKey => $primaryKey]);
    }
}