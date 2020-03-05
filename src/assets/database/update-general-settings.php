<?php

switch($_SERVER['REQUEST_METHOD']){
    case("OPTIONS"): //Allow preflighting to take place.
        header("Access-Control-Allow-Origin: *");
        header("Access-Control-Allow-Methods: PUT");
        header("Access-Control-Allow-Headers: content-type");
        exit;
    case("PUT"):
        header("Access-Control-Allow-Origin: *");

        $json = file_get_contents('php://input');

        $params = json_decode($json);

        $title = $params->title;
        $subtitle = $params->subtitle;
        $description = $params->description;
        $owner = $params->owner;
        $phone = $params->phone;
        $email = $params->email;
        $default_sort = $params->defaultSort;
        $default_filename = $params->defaultFilename;
        $send_email = $params->sendEmail;

        // Update to Database
        $hostname="localhost";
        $username="anne";
        $password="regina23";
        $db="annelanghwa";
        $table="general_settings";

        $con = mysqli_connect($hostname,$username,$password,$db);

        if(mysqli_connect_errno()) {
            //error connecting
            echo 'Error: ' . mysqli_connect_error();
            exit();
        }

        if(mysqli_ping($con)) {
            //connected

            $query = "UPDATE $table SET ";
            $query .= "webpage_title = '$title',";
            $query .= "webpage_subtitle = '$subtitle',";
            $query .= "webpage_description = '$description',";
            $query .= "owner = '$owner',";
            $query .= "email = '$email',";
            $query .= "phone_number = '$phone',";
            $query .= "default_sort_order = '$default_sort',";
            $query .= "default_filename = '$default_filename',";
            $query .= "send_email = '$send_email'";
                
            $result = mysqli_query($con, $query);

            mysqli_close($con);
        }
        
        break;
    default: //Reject any non PUT or OPTIONS requests.
        header("Allow: PUT", true, 405);
        exit;
}
?>