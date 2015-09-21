<?php

    $DB_SERVER = "localhost";
    $DB_USER = "root";
    $DB_PASSWORD = "";
    $DB = "lookyfindme";
    
    $db = mysqli_connect($DB_SERVER, $DB_USER, $DB_PASSWORD, $DB);

    if (mysqli_connect_errno()) {
        echo "Failed to connect to MySQL: " . mysqli_connect_error();
    }
?>
    