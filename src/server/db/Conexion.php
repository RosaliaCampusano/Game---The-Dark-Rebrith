<?php

class Conexion
{
    private static $_singleton = null;
    private $dbh;
    private $errno;
    private $num_rows;

    private $conexion;
    

    public static function getInstance()
    {
        if (is_null(self::$_singleton)) {
            self::$_singleton = new self();
    }
    return self::$_singleton;
}

    private function __clone(){
        trigger_error('La clonacion de este objeto no essta permitida', E_USER_ERROR);
    }

    public function __wakeup(){
        trigger_error("No puede deserializar una instancia de " . get_class($this) . " record.", E_USER_ERROR);
    }

    private function __construct(){

        $this->conexion = "host=ep-small-rain-a2yi9am0-pooler.eu-central-1.aws.neon.tech port=5432 dbname=Proyect user=rosalia_owner password=npg_0lP9MLnECcYT";
        $this->dbh = pg_connect($this->conexion);
        if(!$this->dbh) {
            die("Fatal error en la conexion con la BD");
        } 
    }

    public function getConnection()
    {
        return self::$_singleton;
    }

    public function cerrar()
    {
        self::$_singleton->close();
    }

    protected function query($sql)
    {
        $result = pg_query($this->dbh, $sql);

        if(!$result)
        {
            echo "Error: " . $sql . "<br>" . pg_last_error($this->dbh);
            die("Fatal error al ejecutar query");
        }

        return $result;

    }

}

?>