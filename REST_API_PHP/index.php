<?php

header('Access-Control-Allow-Origin: *');

include './connectToDB.php';

/* function getFriends() {
  if ($this->get_request_method() != "POST") {
  $this->response('', 406);
  }

  $id = $this->_request['id'];

  $sql = mysqli_query($db, "SELECT user.user_id, user.user_username, user.user_name, user.user_surname FROM user, friend WHERE (friend.friend_one = '$id' or friend.friend_two = '$id') and friend.friend_status = 3");
  if (mysqli_num_rows($sql) > 0) {
  $result = array();
  while ($rlt = mysqli_fetch_array($sql, MYSQL_ASSOC)) {
  $result[] = $rlt;
  }
  // If success everythig is good send header as "OK" and return list of users in JSON format
  $this->response($this->json($result), 200);
  }
  $this->response('', 204); // If no records "No Content" status
  } */

function json($data) {
    if (is_array($data)) {
        return json_encode($data);
    }
}

/**
 * Deliver HTTP Response
 * @param string $format The desired HTTP response content type: [json, html, xml]
 * @param string $api_response The desired HTTP response data
 * @return void
 * */
function deliver_response($format, $api_response) {

    // Define HTTP responses
    $http_response_code = array(
        200 => 'OK',
        400 => 'Bad Request',
        401 => 'Unauthorized',
        403 => 'Forbidden',
        404 => 'Not Found'
    );

    // Set HTTP Response
    header('HTTP/1.1 ' . $api_response['status'] . ' ' . $http_response_code[$api_response['status']]);

    // Process different content types
    if (strcasecmp($format, 'json') == 0) {

        // Set HTTP Response Content Type
        header('Content-Type: application/json; charset=utf-8');

        // Format data into a JSON response
        $json_response = json_encode($api_response);

        // Deliver formatted data
        echo $json_response;
    } elseif (strcasecmp($format, 'xml') == 0) {

        // Set HTTP Response Content Type
        header('Content-Type: application/xml; charset=utf-8');

        // Format data into an XML response (This is only good at handling string data, not arrays)
        $xml_response = '<?xml version="1.0" encoding="UTF-8"?>' . "\n" .
                '<response>' . "\n" .
                "\t" . '<code>' . $api_response['code'] . '</code>' . "\n" .
                "\t" . '<data>' . $api_response['data'] . '</data>' . "\n" .
                '</response>';

        // Deliver formatted data
        echo $xml_response;
    } else {

        // Set HTTP Response Content Type (This is only good at handling string data, not arrays)
        header('Content-Type: text/html; charset=utf-8');

        // Deliver formatted data
        echo $api_response['data'];
    }

    // End script process
    exit;
}

// Define whether an HTTPS connection is required
$HTTPS_required = FALSE;

// Define whether user authentication is required
$authentication_required = FALSE;

// Define API response codes and their related HTTP response
$api_response_code = array(
    0 => array('HTTP Response' => 400, 'Message' => 'Unknown Error'),
    1 => array('HTTP Response' => 200, 'Message' => 'Success'),
    2 => array('HTTP Response' => 403, 'Message' => 'HTTPS Required'),
    3 => array('HTTP Response' => 401, 'Message' => 'Authentication Required'),
    4 => array('HTTP Response' => 401, 'Message' => 'Authentication Failed'),
    5 => array('HTTP Response' => 404, 'Message' => 'Invalid Request'),
    6 => array('HTTP Response' => 400, 'Message' => 'Invalid Response Format')
);

// Set default HTTP response of 'ok'
$response['code'] = 0;
$response['status'] = 404;
$response['data'] = NULL;
$response['success'] = false;

// --- Step 2: Authorization
// Optionally require connections to be made via HTTPS
if ($HTTPS_required && $_SERVER['HTTPS'] != 'on') {
    $response['code'] = 2;
    $response['status'] = $api_response_code[$response['code']]['HTTP Response'];
    $response['data'] = $api_response_code[$response['code']]['Message'];

    // Return Response to browser. This will exit the script.
    deliver_response($_GET['format'], $response);
}

// Optionally require user authentication
if ($authentication_required) {

    if (empty($_POST['username']) || empty($_POST['password'])) {
        $response['code'] = 3;
        $response['status'] = $api_response_code[$response['code']]['HTTP Response'];
        $response['data'] = $api_response_code[$response['code']]['Message'];

        // Return Response to browser
        deliver_response($_GET['format'], $response);
    }

    // Return an error response if user fails authentication. This is a very simplistic example
    // that should be modified for security in a production environment
    elseif ($_POST['username'] != 'foo' && $_POST['password'] != 'bar') {
        $response['code'] = 4;
        $response['status'] = $api_response_code[$response['code']]['HTTP Response'];
        $response['data'] = $api_response_code[$response['code']]['Message'];

        // Return Response to browser
        deliver_response($_GET['format'], $response);
    }
}

$response['data'] = '';

if (isset($_POST['method'])) {

    $method = $_POST['method'];

    if (strcasecmp($method, 'login') == 0 and isset($_POST['username']) and isset($_POST['password'])) {
        $username = $_POST['username'];
        $password = $_POST['password'];

        // Input validations
        if (!empty($username) and ! empty($password)) {
            $sql = mysqli_query($db, "SELECT user_id, user_username, user_name, user_surname FROM user WHERE user_username = '$username' AND user_password = '" . $password . "' LIMIT 1");
            if (mysqli_num_rows($sql) > 0) {
                $result = mysqli_fetch_array($sql, MYSQLI_ASSOC);
                $response['data'] = json($result);
                $response['success'] = true;
                $response['status'] = 200;
            } else {
                $response['status'] = 200;
                $response['success'] = false;
            }
        } else {
            $response['status'] = 404;
            $response['success'] = false;
        }
    } else if (strcasecmp($method, 'getfriends') == 0 and isset($_POST['username'])) {
        $username = $_POST['username'];

        // Input validations
        if (!empty($username)) {
            //This SQL statement gets all the usernames for a person/user
            $sql = mysqli_query($db, "SELECT user_id FROM user WHERE user_username='$username'");
            if (mysqli_num_rows($sql) > 0) {
                if($result = mysqli_fetch_row($sql))
                {
                    $sql = mysqli_query($db,"SELECT friend_one FROM friend WHERE user_id='$result[0]' and friend_status = 3");
                    if (mysqli_num_rows($sql) >0)
                    {
                        $jsonData = array();
                
                        while($result = mysqli_fetch_row($sql)){
                            $jsonData[] = $result;
                        }
                        $response['data'] = json_encode($jsonData);
                        $response['success'] = true;
                        $response['status'] = 200;
                    }
                    else
                    {
                        $response['status'] = 404;
                        $response['success'] = false;
                    }
                }
                else
                {
                    $response['status'] = 404;
                    $response['success'] = false;
                }
            }
        } else {
            $response['status'] = 404;
            $response['success'] = false;
        }
    }else if (strcasecmp($method, 'subscribe') == 0 and isset($_POST['username']) and isset($_POST['password']) and isset($_POST['surname']) and isset($_POST['name'])) {
        $username = $_POST['username'];
        $password = $_POST['password'];
        $surname = $_POST['surname'];
        $name = $_POST['name'];

        // Input validations
        if (!empty($username)) {
            //This SQL statement gets all the usernames for a person/user
            $sql = mysqli_query($db, "INSERT INTO user (user_name,user_password,user_username,user_surname) values('$name','$password','$username', '$surname') ");
            $response['status'] = 200;
            $response['success'] = true;
               
        } else {
            $response['status'] = 404;
            $response['success'] = false;
        }
    }
}

deliver_response('json', $response);
?>
            
