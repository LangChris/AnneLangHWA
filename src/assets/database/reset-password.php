<?php

switch($_SERVER['REQUEST_METHOD']){
    case("OPTIONS"): //Allow preflighting to take place.
        header("Access-Control-Allow-Origin: *");
        header("Access-Control-Allow-Methods: POST");
        header("Access-Control-Allow-Headers: content-type");
        exit;
    case("POST"):
        header("Access-Control-Allow-Origin: *");

        $json = file_get_contents('php://input');

        $params = json_decode($json);

        $email = $params->email;
        $password_reset = $params->password;
        $from_email = $params->fromEmail;
        $admin_name = $params->adminName;

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
                <h3 class='padding-top'>Password Reset</h3>
                <p>Your new password is: ".base64_decode($password_reset)."</p>
            </body>
            </html>";

        $subject = "HWA - Password Reset";

        $headers  = 'MIME-Version: 1.0' . "\r\n";
        $headers .= 'Content-type: text/html; charset=iso-8859-1' . "\r\n";
        $headers .= 'From: '.$admin_name."<".$from_email.">\r\n".
        'Reply-To: '.$from_email."\r\n" .
        'X-Mailer: PHP/' . phpversion();

        $mail_response = mail($email, $subject, $msg, $headers);

        // Update Database
        $hostname="localhost";
        $username="anne";
        $password="regina23";
        $db="annelanghwa";
        $table="login";

        $con = mysqli_connect($hostname,$username,$password,$db);

        if(mysqli_connect_errno()) {
            //error connecting
            echo 'Error: ' . mysqli_connect_error();
            exit();
        }

        if(mysqli_ping($con)) {
            //connected

            $query = "UPDATE $table SET password = '$password_reset'";

            $result = mysqli_query($con, $query);

            mysqli_close($con);
        }
        
        break;
    default: //Reject any non POST or OPTIONS requests.
        header("Allow: POST", true, 405);
        exit;
}
?>