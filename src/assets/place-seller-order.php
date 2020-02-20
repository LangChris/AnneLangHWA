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

        $email = $params->email;
        $name = $params->name;
        $plan = $params->plan;
        $home_type = $params->homeType;
        $address_line = $params->addressLine;
        $city = $params->city;
        $state = $params->state;
        $zip = $params->zip;
        $seller_name = $params->sellerName;
        $seller_email = $params->sellerEmail;
        $start_date = $params->startDate;
        $hvac_coverage = $params->hvacCoverage;
        $realtor_name = $params->realtorName;
        $realtor_email = $params->realtorEmail;
        $created_date = $params->createdDate;
        
        function clean_string($string) {
            $bad = array("content-type","bcc:","to:","cc:","href");
            return str_replace($bad,"",$string);
        }

        $msg = "
    <html>
        <head>
            <style>
                h2 {
                    font-weight: bold;
                }
                
                .header {
                    font-weight: bold;
                }
            </style>
        </head>
        <body>
            <h2>Hi I would like to place a new Home Warranty Order:</h2>
            <br />
            <table>
                <tr>
                    <td class='header'>Name:</td>
                    <td>".clean_string($name)."</td>
                </tr>
                <tr>
                    <td class='header'>Email:</td>
                    <td>".clean_string($email)."</td>
                </tr>
                <tr>
                    <td class='header'>Plan:</td>
                    <td>".clean_string($plan)."</td>
                </tr>
                <tr>
                    <td class='header'>Home Type:</td>
                    <td>".clean_string($home_type)."</td>
                </tr>
                <tr>
                    <td class='header'>Address Line:</td>
                    <td>".clean_string($address_line)."</td>
                </tr>
                <tr>
                    <td class='header'>City:</td>
                    <td>".clean_string($city)."</td>
                </tr>
                <tr>
                    <td class='header'>State:</td>
                    <td>".clean_string($state)."</td>
                </tr>
                <tr>
                    <td class='header'>Zip:</td>
                    <td>".clean_string($zip)."</td>
                </tr>
                <tr>
                    <td class='header'>Seller Name:</td>
                    <td>".clean_string($seller_name)."</td>
                </tr>
                <tr>
                    <td class='header'>Seller Email:</td>
                    <td>".clean_string($seller_email)."</td>
                </tr>
                <tr>
                    <td class='header'>Start Date:</td>
                    <td>".clean_string($start_date)."</td>
                </tr>
                <tr>
                    <td class='header'>HVAC Coverage:</td>
                    <td>".clean_string($hvac_coverage)."</td>
                </tr>
                <tr>
                    <td class='header'>Referring Realtor Name:</td>
                    <td>".clean_string($realtor_name)."</td>
                </tr>
                <tr>
                    <td class='header'>Referring Realtor Email:</td>
                    <td>".clean_string($realtor_email)."</td>
                </tr>
            </table>
        </body>
    </html>";

        $email_to = "Anne.Lang@hwahomewarranty.com";
        $subject = "HWA Home Warranty Order";

        $headers  = 'MIME-Version: 1.0' . "\r\n";
        $headers .= 'Content-type: text/html; charset=iso-8859-1' . "\r\n";

        $headers .= 'From: '.$name."<".$email.">\r\n".
        'Reply-To: '.$email."\r\n" .
        'X-Mailer: PHP/' . phpversion();

        $mail_response = mail($email_to, $subject, $msg, $headers);

        // Save to Database
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

            $query = "INSERT INTO $table VALUES(";
            $query .= "'',";
            $query .= "'$name',";
            $query .= "'$email',";
            $query .= ($plan == '' ? "NULL" : "'$plan'").",";
            $query .= "NULL,";
            $query .= ($home_type == '' ? "NULL" : "'$home_type'").",";
            $query .= ($address_line == '' ? "NULL" : "'$address_line'").",";
            $query .= ($city == '' ? "NULL" : "'$city'").",";
            $query .= ($state == '' ? "NULL" : "'$state'").",";
            $query .= ($zip == '' ? "NULL" : "'$zip'").",";
            $query .= "NULL,";
            $query .= "NULL,";
            $query .= ($seller_name == '' ? "NULL" : "'$seller_name'").",";
            $query .= ($seller_email == '' ? "NULL" : "'$seller_email'").",";
            $query .= ($start_date == '' ? "NULL" : "'$start_date'").",";
            $query .= "NULL,";
            $query .= ($hvac_coverage == '' ? "NULL" : "'$hvac_coverage'").",";
            $query .= ($realtor_name == '' ? "NULL" : "'$realtor_name'").",";
            $query .= ($realtor_email == '' ? "NULL" : "'$realtor_email'").",";
            $query .= "NULL,";
            $query .= "NULL,";
            $query .= "0,";
            $query .= "'$created_date')";

            $result = mysqli_query($con, $query);

            mysqli_close($con);

        }

        break;
    default: //Reject any non POST or OPTIONS requests.
        header("Allow: POST", true, 405);
        exit;
}
?>