<?php

require_once "ModelBase.php";

class Record extends ModelBase
{
    function __construct()
    {
        parent::__construct();
        $this->table_name = "records";
    }
}
?>