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
        $years = $params->years;
        $home_type = $params->homeType;
        $address_line = $params->addressLine;
        $city = $params->city;
        $state = $params->state;
        $zip = $params->zip;
        $buyer_name = $params->buyerName;
        $buyer_email = $params->buyerEmail;
        $buyer_phone = $params->buyerPhone;
        $close_start_date = $params->closeStartDate;
        $optional_coverage = $params->optionalCoverage;
        $realtor_name = $params->realtorName;
        $realtor_email = $params->realtorEmail;
        $realtor_company = $params->realtorCompany;
        $realtor_zip = $params->realtorZip;
        $title_agent_email = $params->titleAgentEmail;
        $promo = $params->promo;
        $special_request = $params->specialRequest;
        $created_date = $params->createdDate;
        $send_email = $params->sendEmail;
        $admin_name = $params->adminName;
        $admin_email = $params->adminEmail;
        $order_total = $params->orderTotal;
        $user_id = $params->userId;

        function clean_string($string) {
            $bad = array("content-type","bcc:","to:","cc:","href");
            return str_replace($bad,"",$string);
        }

        $msg = "
    <html>
        <head>
            <style>
                body {
                    margin:0;
                    font-family: 'Roboto', sans-serif;
                    font-weight: 300;
                    background-color: #4894a4;
                }
                
                h3 {
                    font-weight: bold;
                    text-align: center;
                    color: #eb5e17;
                }

                .header {
                    font-weight: bold;
                }
                
                table {
                    margin: 0 auto;
                    width: 50%;
                    min-width: 340px;
                    text-align: left;
                    padding-bottom: 25px;
                }
                
                .padding-top {
                    padding-top: 20px;
                }
                
                .group-header {
                    text-align: left;
                    text-decoration: underline;
                }

                .group-label:before {
                    content: '-- ';
                }
                
                p {
                    text-align: center;
                }
            </style>
        </head>
        <body>
            <h3 class='padding-top'>Order Submitted</h3>
            <p>Thank you for your order. Invoice will be emailed seperatly</p>
            <table>
                <tr>
                    <th>Name:</th>
                    <td>".clean_string($name)."</td>
                </tr>
                <tr>
                    <th>Email:</th>
                    <td>".clean_string($email)."</td>
                </tr>
                <tr>
                    <th>Plan:</th>
                    <td>".clean_string($plan)."</td>
                </tr>
                <tr>
                    <th>Years:</th>
                    <td>".clean_string($years)."</td>
                </tr>";

                foreach($optional_coverage as $option) {
                    $msg .= "
                            <tr>
                                <th>Coverage:</th>
                                <td>".clean_string($option)."</td>
                            </tr>";
                }

                $msg .= "
                <tr>
                    <th>Close/Start Date:</th>
                    <td>".clean_string($close_start_date)."</td>
                </tr>
                <tr>
                    <th>Home Type:</th>
                    <td>".clean_string($home_type)."</td>
                </tr>
                <tr>
                    <th>Address Line:</th>
                    <td>".clean_string($address_line)."</td>
                </tr>
                <tr>
                    <th>City:</th>
                    <td>".clean_string($city)."</td>
                </tr>
                <tr>
                    <th>State:</th>
                    <td>".clean_string($state)."</td>
                </tr>
                <tr>
                    <th>Zip:</th>
                    <td>".clean_string($zip)."</td>
                </tr>
                <tr>
                    <th class='group-header'>Buyer</th>
                </tr>
                <tr>
                    <th class='group-label'>Name:</th>
                    <td>".clean_string($buyer_name)."</td>
                </tr>
                <tr>
                    <th class='group-label'>Email:</th>
                    <td>".clean_string($buyer_email)."</td>
                </tr>
                <tr>
                    <th class='group-label'>Phone:</th>
                    <td>".clean_string($buyer_phone)."</td>
                </tr>
                <tr>
                    <th class='group-header'>Realtor</th>
                </tr>
                <tr>
                    <th class='group-label'>Name:</th>
                    <td>".clean_string($realtor_name)."</td>
                </tr>
                <tr>
                    <th class='group-label'>Email:</th>
                    <td>".clean_string($realtor_email)."</td>
                </tr>
                <tr>
                    <th class='group-label'>Company:</th>
                    <td>".clean_string($realtor_company)."</td>
                </tr>
                <tr>
                    <th class='group-label'>Office Zip:</th>
                    <td>".clean_string($realtor_zip)."</td>
                </tr>
                <tr>
                    <th>Title Agent Email:</th>
                    <td>".clean_string($title_agent_email)."</td>
                </tr>
                <tr>
                    <th>Promo:</th>
                    <td>".clean_string($promo)."</td>
                </tr>";

                foreach($special_request as $request) {
                    $msg .= "
                            <tr>
                                <th>Special Request:</th>
                                <td>".clean_string($request)."</td>
                            </tr>";
                }

                $msg .= "
                </table>
                <h3>Order Total: ".clean_string($order_total)."</h3>
            </body>
        </html>";

        $subject = "HWA Home Warranty Order";

        if($send_email) {
            $headers  = 'MIME-Version: 1.0' . "\r\n";
            $headers .= 'Content-type: text/html; charset=iso-8859-1' . "\r\n";
            $headers .= 'From: '.$name."<".$email.">\r\n".
            'Reply-To: '.$email."\r\n" .
            'X-Mailer: PHP/' . phpversion();

            $mail_response = mail($admin_email, $subject, $msg, $headers);

            $headers  = 'MIME-Version: 1.0' . "\r\n";
            $headers .= 'Content-type: text/html; charset=iso-8859-1' . "\r\n";
            $headers .= 'From: '.$admin_name."<".$admin_email.">\r\n".
            'Reply-To: '.$admin_email."\r\n" .
            'X-Mailer: PHP/' . phpversion();

            $mail_response = mail($email, $subject, $msg, $headers);
        }

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

            $optional_coverage_string = '';
            foreach($optional_coverage as $option) {
                $optional_coverage_string .= $option .", ";
            }
            $optional_coverage_string = empty($optional_coverage_string) ? null : substr($optional_coverage_string, 0, -2);

            $special_request_string = '';
            foreach($special_request as $request) {
                $special_request_string .= $request .", ";
            }
            $special_request_string = empty($special_request_string) ? null : substr($special_request_string, 0, -2);

            $query = "INSERT INTO $table VALUES(";
            $query .= "'',";
            $query .= "'$user_id',";
            $query .= "'$name',";
            $query .= "'$email',";
            $query .= ($plan == '' ? "NULL" : "'$plan'").",";
            $query .= ($years == '' ? "NULL" : "'$years'").",";
            $query .= ($home_type == '' ? "NULL" : "'$home_type'").",";
            $query .= ($address_line == '' ? "NULL" : "'$address_line'").",";
            $query .= ($city == '' ? "NULL" : "'$city'").",";
            $query .= ($state == '' ? "NULL" : "'$state'").",";
            $query .= ($zip == '' ? "NULL" : "'$zip'").",";
            $query .= ($buyer_name == '' ? "NULL" : "'$buyer_name'").",";
            $query .= ($buyer_email == '' ? "NULL" : "'$buyer_email'").",";
            $query .= ($buyer_phone == '' ? "NULL" : "'$buyer_phone'").",";
            $query .= "NULL,";
            $query .= "NULL,";
            $query .= "NULL,";
            $query .= ($close_start_date == '' ? "NULL" : "'$close_start_date'").",";
            $query .= ($optional_coverage_string == '' ? "NULL" : "'$optional_coverage_string'").",";
            $query .= ($special_request_string == '' ? "NULL" : "'$special_request_string'").",";
            $query .= "NULL,";
            $query .= ($realtor_name == '' ? "NULL" : "'$realtor_name'").",";
            $query .= ($realtor_email == '' ? "NULL" : "'$realtor_email'").",";
            $query .= ($realtor_company == '' ? "NULL" : "'$realtor_company'").",";
            $query .= ($realtor_zip == '' ? "NULL" : "'$realtor_zip'").",";
            $query .= ($title_agent_email == '' ? "NULL" : "'$title_agent_email'").",";
            $query .= ($promo == '' ? "NULL" : "'$promo'").",";
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