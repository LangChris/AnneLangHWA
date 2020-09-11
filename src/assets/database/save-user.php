<?php

switch($_SERVER['REQUEST_METHOD']){
    case("OPTIONS"): //Allow preflighting to take place.
        header("Access-Control-Allow-Origin: *");
        header("Access-Control-Allow-Methods: POST");
        header("Access-Control-Allow-Headers: content-type");
        exit;
    case("POST"): //Send the email;
        header("Access-Control-Allow-Origin: *");

        $json = file_get_contents('php://input');

        $params = json_decode($json);

        // user settings
        $users_type = $params->usersType;
        $users_name = $params->usersName;
        $users_email = $params->emailAddress;
        $login_username = $params->loginUsername;
        $login_password = $params->loginPassword;


        // Save to Database
        $hostname="localhost";
        $username="anne";
        $password="regina23";
        $db="annelanghwa";
        $table="user";

        $con = mysqli_connect($hostname,$username,$password,$db);

        if(mysqli_connect_errno()) {
            //error connecting
            echo 'Error: ' . mysqli_connect_error();
            exit();
        }

        if(mysqli_ping($con)) {
            //connected

            $query = "INSERT INTO $table VALUES(";
            $query .= "'',";
            $query .= "'$users_name',";
            $query .= ($login_username == '' ? "NULL" : "'$login_username'").",";
            $query .= "'$login_password',";
            $query .= "'$users_type',";
            $query .= "'SUBSCRIBED',";
            $query .= "'$users_email',";
            $query .= "NULL,";
            $query .= "NULL,";
            $query .= "'',";
            $query .= "NULL)";
                
            $result = mysqli_query($con, $query);

            mysqli_close($con);
        }
        
        break;
    default: //Reject any non POST or OPTIONS requests.
        header("Allow: POST", true, 405);
        exit;
}
?>