///////////////// Log-in functions //////////////////
document.addEventListener('DOMContentLoaded', () => {
    // Check if there is a session cookie
    const sessionCookie = document.cookie.includes('session=');

    // Get references to menu elements
    const logoutLink = document.getElementById('logoutLink');
    const loginLink = document.getElementById('loginLink');
    const usuarisPageLink = document.getElementById('usuarisPageLink');

    // Show or hide links based on the presence of the session cookie
    if (sessionCookie) {
        logoutLink.style.display = 'block'; // Show "Log Out" link
        loginLink.style.display = 'none'; // Hide "Log In" link
        usuarisPageLink.style.display = 'block';
    } else {
        logoutLink.style.display = 'none'; // Hide "Log Out" link
        loginLink.style.display = 'block'; // Show "Log In" link
        usuarisPageLink.style.display = 'none';
    }

    // Function to log out
    function logout() {
        fetch('/logout', { method: 'GET' })
            .then(response => {
                if (response.redirected) {
                    window.location.href = "/"; // Redirect to the login page or another desired page
                }
            })
            .catch(error => {
                console.error('Error logging out:', error);
            });
    }
    logoutLink.addEventListener('click', logout); // Associate the log out function with the click event on the link
});
