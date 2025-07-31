<?php

 require_once "login_data.php";

class Conexion
{
    private static $_singleton = null;
    private $dbh;
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
  global $cfg;

            $host       = $cfg["host"];
            $dbname     = $cfg["dbname"];
            $user       = $cfg["user"];
            $password   = $cfg["password"];

            $this->conexion = "host=$host port=5432 dbname=$dbname user=$user password=$password";

            $this->dbh = pg_connect($this->conexion);
            if (!$this->dbh) {
                die("Database connection error");
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