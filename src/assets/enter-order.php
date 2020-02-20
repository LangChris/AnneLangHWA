<?php

switch($_SERVER['REQUEST_METHOD']){
    case("OPTIONS"): //Allow preflighting to take place.
        header("Access-Control-Allow-Origin: *");
        header("Access-Control-Allow-Methods: PUT");
        header("Access-Control-Allow-Headers: content-type");
        exit;
    case("PUT"):
        header("Access-Control-Allow-Origin: *");

        $id = file_get_contents('php://input');

        // Delete from Database
        $hostname="localhost";
        $username="anne";
        $password="regina23";
        $db="annelanghwa";
        $table="warranty_order";

        $con = mysqli_connect($hostname,$username,$password,$db);

        if(mysqli_connect_errno()) {
            //error connecting
            echo 'Error: ' . mysqli_connect_error();
            exit();
        }

        if(mysqli_ping($con)) {
            //connected
            $query = "UPDATE $table SET entered = '1' WHERE id = '$id'";

            $result = mysqli_query($con, $query);

            mysqli_close($con);
        }
        
        break;
    default: //Reject any non PUT or OPTIONS requests.
        header("Allow: PUT", true, 405);
        exit;
}
?>