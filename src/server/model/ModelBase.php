<?php

require_once(__DIR__."/../db/Conexion.php");

class ModelBase extends Conexion {

    protected $conexion;
    protected $table_name;

    function __construct() {
        $this->conexion = parent::getInstance();
    }

    function getAll(){
    
        $query = $this->selectDB($this->table_name);

        $result = $this->conexion->query($query);

        $array = $this->createArray($result);

        return $array;
    }

    function getAllByColumn($search_name , $search_value)
    {
        $query = $this->selectDB($this->table_name, "*", $search_name, $search_value);
        $result = $this->conexion->query($query);

        $array = $this->createArray($result);

        return $array;
    }

    function addNew($array)
    {
        $query = $this->insertDB($this->table_name, $array);

        $result = $this->conexion->query($query);

        return $result;
    }

    protected function createArray($data)
    {
        $array = array();

        while($row = pg_fetch_array($data, null, PGSQL_ASSOC))
        {
            $array[] = $row;
        }
        return $array;
    }

    protected function selectDB($table, $columns = "*", $name = "", $value = "")
    {
        $query = "SELECT $columns FROM $table";
        if (($name !== "") && ($value !== "")) {
            $query .= " WHERE $name = '$value'";
        }
        return $query;
    }

    protected function insertDB($table, $array)
    {
        foreach ($array as $name => $value) {
            $insert_name[] = $name;
            $insert_value[] = $value;
        }

        $query = "INSERT INTO $table (";
        $num_of_elements = count($insert_name);
        for ($i = 0; $i < $num_of_elements; $i++) {
            $query .= "$insert_name[$i]";
            if ($i !== ($num_of_elements - 1)) {
                $query .= ", ";
            } else {
                $query .= ") ";
            }
        }

        $query .= "VALUES (";
        for ($i = 0; $i < $num_of_elements; $i++) {
            $query .= "'$insert_value[$i]'";
            if ($i !== ($num_of_elements - 1)) {
                $query .= ", ";
            } else {
                $query .= ")";
            }
        }

        return $query;
    }
}

?>