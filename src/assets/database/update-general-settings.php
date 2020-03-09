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
        $order_description = $params->orderDescription;
        $order_message = $params->orderMessage;
        $owner = $params->owner;
        $phone = $params->phone;
        $email = $params->email;
        $default_sort = $params->defaultSort;
        $default_filename = $params->defaultFilename;
        $send_email = $params->sendEmail;
        $active = $params->promoActive;
        $amount = $params->promoAmount;
        $type = $params->promoType;
        $gift = $params->promoGift;
        $code = $params->promoCode;
        $end_date = $params->promoEndDate;
        $plan_one = $params->planOne;
        $plan_two = $params->planTwo;
        $plan_three = $params->planThree;
        $plan_one_price = $params->planOnePrice;
        $plan_two_price = $params->planTwoPrice;
        $plan_three-price = $params->planThreePrice;

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
            $query .= "order_description = '$order_description',";
            $query .= "order_message = '$order_message',";
            $query .= "owner = '$owner',";
            $query .= "email = '$email',";
            $query .= "phone_number = '$phone',";
            $query .= "default_sort_order = '$default_sort',";
            $query .= "default_filename = '$default_filename',";
            $query .= "send_email = '$send_email'";
                
            $result = mysqli_query($con, $query);

            $table="promo";

            $query = "UPDATE $table SET ";
            $query .= "active = '$active',";
            $query .= "type = '$type',";
            $query .= "amount = ".($amount == '' ? "NULL" : "'$amount'").",";
            $query .= "gift = ".($gift == '' ? "NULL" : "'$gift'").",";
            $query .= "code = '$code',";
            $query .= "end_date = '$end_date'";
                
            $result = mysqli_query($con, $query);

            $table="plan";

            $query = "UPDATE $table SET ";
            $query .= "name = '$plan_one',";
            $query .= "price = '$plan_one_price' WHERE id = 1";
                
            $result = mysqli_query($con, $query);

            $query = "UPDATE $table SET ";
            $query .= "name = '$plan_two',";
            $query .= "price = '$plan_two_price' WHERE id = 2";
                
            $result = mysqli_query($con, $query);

            $query = "UPDATE $table SET ";
            $query .= "name = '$plan_three',";
            $query .= "price = '$plan_three_price' WHERE id = 3";
                
            $result = mysqli_query($con, $query);

            mysqli_close($con);
        }
        
        break;
    default: //Reject any non PUT or OPTIONS requests.
        header("Allow: PUT", true, 405);
        exit;
}
?>