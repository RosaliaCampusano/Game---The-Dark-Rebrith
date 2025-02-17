
<?php

    require_once(__DIR__. "/../controller/Controller.php");

    $result = $record->getAll();

    echo json_encode($result);
?>