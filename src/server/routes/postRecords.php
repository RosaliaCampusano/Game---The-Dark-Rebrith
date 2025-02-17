<?php

require_once(__DIR__."/../controller/Controller.php");



    if(isset($_POST['id']) && isset( $_POST['name']) && isset( $_POST['score']))
    {
        $newrecord['id']            = $_POST['id'];
        $newrecord['name']          = $_POST['name'];
        $newrecord['score']         = $_POST['score'];

        $returnValue = $record->addNew( $newrecord );

        if(!$returnValue)
        {
            echo "Error en la introduccion de nuevo elemento en la BD";
        } else 
        {
            echo json_encode($newrecord);
        }
    } else 
    {
        die("Forbidden");
    }

?> 