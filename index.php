<?php
// Redirect to the dist folder
// header("Cache-Control: no-cache, must-revalidate");
// header("Location: Login.html");

// exit;
// //echo "hi";
?>

<?php
// Check if the user is on a mobile device
function isMobileDevice() {
    $userAgent = $_SERVER['HTTP_USER_AGENT'];
    
    // A simple check for common mobile device indicators in the User-Agent string
    return preg_match('/(iphone|ipod|android|webos|blackberry|bb|playbook|mobile|windows phone)/i', $userAgent);
}

// Redirect based on device type
if (isMobileDevice()) {
    // Redirect to the mobile-blocked page if the user is on a mobile device
    header("Location: ../taralabalu");
    exit;
} else
 {
    // Redirect to the login page if the user is on a web (desktop/tablet) device
    header("Location: v2/Login.html");
    exit;
}
?>
