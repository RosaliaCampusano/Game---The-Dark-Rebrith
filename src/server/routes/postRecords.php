<?php

require_once(__DIR__."/../controller/Controller.php");

    if(isset($_POST["name"]) && isset($_POST["score"]))
    {
        $newrecord["name"] = $_POST["name"];
        $newrecord["score"] = $_POST["score"];

        $record->addNew($newrecord);
        echo json_encode($newrecord);
    } else 
    {
        die("Forbidden");
    }

?> 