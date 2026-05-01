<?php
    //this used to connect the database mySql with php
    $db_server = "localhost";
    $db_user = "root";//use to store the user name that has accsess to my sql 
    $db_pass = "";
    $db_name = "ecommerce_db";//stores the name of the data base that we want to accesss

    $conn = mysqli_connect($db_server, $db_user, $db_pass, $db_name);//use to store the database connection object
    if(!$conn){
        die('Connection failed: ' . mysqli_connect_error());
    }
?>