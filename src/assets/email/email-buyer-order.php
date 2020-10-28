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
        
        break;
    default: //Reject any non POST or OPTIONS requests.
        header("Allow: POST", true, 405);
        exit;
}
?>