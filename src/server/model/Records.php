<?php

require_once "ModelBase.php";

class Records extends ModelBase
{
    function __construct()
    {
        $this->table_name = 'records';
        parent::__construct();
    }
}
?>