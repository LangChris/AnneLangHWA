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

        $id = $params->orderId;
        $email = $params->email;
        $name = $params->name;
        $plan = $params->plan;
        $years = $params->years;
        $home_type = $params->homeType;
        $address_line = $params->addressLine;
        $city = $params->city;
        $state = $params->state;
        $zip = $params->zip;
        $buyer_name = $params->buyerName;
        $buyer_email = $params->buyerEmail;
        $seller_name = $params->sellerName;
        $seller_email = $params->sellerEmail;
        $close_start_date = $params->closeStartDate;
        $optional_coverage = $params->optionalCoverage;
        $hvac_coverage = $params->hvacCoverage;
        $realtor_name = $params->realtorName;
        $realtor_email = $params->realtorEmail;
        $title_agent_email = $params->titleAgentEmail;
        $promo = $params->promo;

        // Update to Database
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

            $optional_coverage_string = '';
            foreach($optional_coverage as $option) {
                $optional_coverage_string .= $option .", ";
            }
            $optional_coverage_string = empty($optional_coverage_string) ? null : substr($optional_coverage_string, 0, -2);

            $query = "UPDATE $table SET ";
            $query .= "name = '$name',";
            $query .= "email = '$email',";
            $query .= "plan = ".($plan == '' ? "NULL" : "'$plan'").",";
            $query .= "years = ".($years == '' ? "NULL" : "'$years'").",";
            $query .= "home_type = ".($home_type == '' ? "NULL" : "'$home_type'").",";
            $query .= "address_line = ".($address_line == '' ? "NULL" : "'$address_line'").",";
            $query .= "city = ".($city == '' ? "NULL" : "'$city'").",";
            $query .= "state = ".($state == '' ? "NULL" : "'$state'").",";
            $query .= "zip = ".($zip == '' ? "NULL" : "'$zip'").",";
            $query .= "buyer_name = ".($buyer_name == '' ? "NULL" : "'$buyer_name'").",";
            $query .= "buyer_email = ".($buyer_email == '' ? "NULL" : "'$buyer_email'").",";
            $query .= "seller_name = ".($seller_name == '' ? "NULL" : "'$seller_name'").",";
            $query .= "seller_email = ".($seller_email == '' ? "NULL" : "'$seller_email'").",";
            $query .= "close_start_date = ".($close_start_date == '' ? "NULL" : "'$close_start_date'").",";
            $query .= "optional_coverage = ".($optional_coverage_string == '' ? "NULL" : "'$optional_coverage_string'").",";
            $query .= "hvac_coverage = ".($hvac_coverage == '' ? "NULL" : "'$hvac_coverage'").",";
            $query .= "realtor_name = ".($realtor_name == '' ? "NULL" : "'$realtor_name'").",";
            $query .= "realtor_email = ".($realtor_email == '' ? "NULL" : "'$realtor_email'").",";
            $query .= "title_agent_email = ".($title_agent_email == '' ? "NULL" : "'$title_agent_email'").",";
            $query .= "promo = ".($promo == '' ? "NULL" : "'$promo'");
            $query .= " WHERE id = '$id'";
                
            $result = mysqli_query($con, $query);

            mysqli_close($con);
        }
        
        break;
    default: //Reject any non PUT or OPTIONS requests.
        header("Allow: PUT", true, 405);
        exit;
}
?>