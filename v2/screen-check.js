// screen-check.js
(function () {
    const mobileMaxWidth = 768; // Set the maximum width for mobile screens

    // Function to check the screen size
    function checkScreenSize() {
        if (window.innerWidth <= mobileMaxWidth) {
            // Block mobile users
           // alert("This website is not available on mobile devices.");
            window.location.href = "/../../mobile-blocked.html"; // Redirect to a mobile-block page
        }
    }

    // Run the function on page load
    checkScreenSize();

    // Optionally, listen for window resize events to dynamically check
    window.addEventListener("resize", () => {
        checkScreenSize();
    });
})();
