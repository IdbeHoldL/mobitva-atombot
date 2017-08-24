<?php

/**
 * Created by PhpStorm.
 * User: q
 * Date: 11.02.2016
 * Time: 15:27
 */
class WalletOne
{

    private $secretKey = '';

    private $WMI_MERCHANT_ID = '';
    private $WMI_CURRENCY_ID = '';
    private $WMI_SUCCESS_URL = '';
    private $WMI_FAIL_URL    = '';

    /**
     * WalletOne constructor.
     * @param $merchantId
     * @param $currencyId
     * @param $successUrl
     * @param $failUrl
     * @param $secretKey
     */
    public function __construct($merchantId, $currencyId, $successUrl, $failUrl, $secretKey)
    {
        $this->WMI_MERCHANT_ID = $merchantId;
        $this->WMI_CURRENCY_ID = $currencyId;
        $this->WMI_SUCCESS_URL = $successUrl;
        $this->WMI_FAIL_URL    = $failUrl;

        $this->secretKey = $secretKey;
    }

    /**
     * @param $orderId
     * @param $orderSum
     * @param $orderDescription
     * @return array
     */
    public function getPaymentFormFields($orderId, $orderSum, $orderDescription)
    {
        $fields = [
            "WMI_MERCHANT_ID"    => $this->WMI_MERCHANT_ID,
            "WMI_PAYMENT_AMOUNT" => number_format($orderSum, 2, '.', ''),
            "WMI_CURRENCY_ID"    => $this->WMI_CURRENCY_ID,
            "WMI_PAYMENT_NO"     => $orderId,
            "WMI_DESCRIPTION"    => "BASE64:" . base64_encode($orderDescription),
            "WMI_SUCCESS_URL"    => $this->WMI_SUCCESS_URL,
            "WMI_FAIL_URL"       => $this->WMI_FAIL_URL,
        ];

        $fields["WMI_SIGNATURE"] = $this->getSignature($fields);

        return $fields;
    }

    /**
     * @param      $fields
     * @param bool $useIconv
     * @return string
     */
    public function getSignature($fields, $useIconv = true)
    {
        //Сортировка значений внутри полей
        foreach ($fields as $name => $val) {
            if (is_array($val)) {
                usort($val, "strcasecmp");
                $fields[$name] = $val;
            }
        }
        // Формирование сообщения, путем объединения значений формы, отсортированных по именам ключей в порядке возрастания.
        uksort($fields, "strcasecmp");

        $fieldValues = "";
        foreach ($fields as $value) {
            if (is_array($value)) {
                foreach ($value as $v) {
                    $fieldValues .= ($useIconv) ? iconv("utf-8", "windows-1251", $v) : $v;
                }
            } else {
                $fieldValues .= ($useIconv) ? iconv("utf-8", "windows-1251", $value) : $value;
            }
        }

        // Добавление параметра WMI_SIGNATURE в словарь параметров формы
        return base64_encode(pack("H*", md5($fieldValues . $this->secretKey)));
    }

    /**
     * @param      $fields
     * @param bool $useIconv
     * @return bool
     */
    public function checkSignature($fields, $useIconv = true)
    {
        if (!isset($fields['WMI_SIGNATURE'])) {
            return false;
        }

        $formSignature = $fields['WMI_SIGNATURE'];
        unset($fields['WMI_SIGNATURE']);

        return ($formSignature === $this->getSignature($fields, $useIconv)) ? true : false;
    }
}