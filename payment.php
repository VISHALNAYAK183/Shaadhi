<?php
// Razorpay Webhook Secret Key - Set this in your Razorpay Dashboard
$webhook_secret = 'M0b1c0#280';

// Read the incoming raw POST data
$input = file_get_contents('php://input');

// Decode the JSON payload into a PHP array
$data = json_decode($input, true);

// Get the signature sent by Razorpay in the headers
$signature = $_SERVER['HTTP_X_RAZORPAY_SIGNATURE'];

// Verify the webhook signature
$expected_signature = hash_hmac('sha256', $input, $webhook_secret);

// Check if the received signature matches the expected one
if ($signature != $expected_signature) {
    // Invalid signature, so reject the request
    http_response_code(400); // Bad Request
    echo 'Invalid signature';
    exit;
}

// Log the event (optional)
file_put_contents('webhook.log', print_r($data, true), FILE_APPEND);

// Process the webhook data
if ($data['event'] == 'payment.captured') {
    // A payment was successfully captured, process it
    $payment_id = $data['payload']['payment']['entity']['id'];
    $order_id = $data['payload']['payment']['entity']['order_id'];
    $amount = $data['payload']['payment']['entity']['amount'];

    // Your business logic: e.g., update order status in your database
    // Example:
    // update_order_status($order_id, 'paid');
 $updateTranLog = array( 
        "LOG" =>$data, 
         "type"=>"UPDATE",
		 "transaction_id"=>$order_id,
		 "payment_id"=>$payment_id,
		 "transaction_status"=>$data['payload']['payment']['entity']['status']
      );

      $encodeUpdateTranLog = json_encode($updateTranLog);

      $ch = curl_init();
  curl_setopt($ch, CURLOPT_URL,"https://www.sharutech.com/matrimony/token_cashfree.php");
      curl_setopt($ch, CURLOPT_POST, 1);
      curl_setopt($ch, CURLOPT_POSTFIELDS,$encodeUpdateTranLog);
      curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json' ));

      // receive server response ...
      curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

      $server_output = curl_exec ($ch);
    
      curl_close ($ch); 

    // Respond with a success status
    http_response_code(200); // OK
    echo 'Payment captured successfully';
} elseif ($data['event'] == 'payment.failed') {
    // A payment failed, handle the failure
    $payment_id = $data['payload']['payment']['entity']['id'];
    $failure_reason = $data['payload']['payment']['entity']['failure_reason'];

    // Your business logic: e.g., mark the order as failed
    // Example:
    // update_order_status($order_id, 'failed');

    // Respond with a success status
    http_response_code(200); // OK
    echo 'Payment failed';
} else {
    // Handle other events if needed
    http_response_code(200); // OK
    echo 'Event not handled';
}

?>
