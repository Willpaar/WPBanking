/*
code to pull out dashboard
*/
document.addEventListener('DOMContentLoaded', () => {
    const dashboardBtn = document.querySelector('.dashboard_btn');
    const dashboard = document.querySelector('.dashboard');

    // Check if the elements are found
    if (!dashboardBtn || !dashboard) {
        console.error('Dashboard button or menu not found!');
        return;
    }

    // Toggle visibility of the dashboard menu when the button is clicked
    dashboardBtn.addEventListener('click', () => {
        dashboard.classList.toggle('active');
    });

    // Automatically hide the dashboard menu when resizing to larger screens
    window.addEventListener('resize', () => {
        if (window.innerWidth > 920) {
            // Close the dashboard menu if it's open on larger screens
            dashboard.classList.remove('active');
        }
    });
});


/*
makes buttons go back to normal size when clicked
*/
// Get both buttons by their unique IDs
const submitBtnLogin = document.getElementById('submit_btn');
const submitBtnSignup = document.getElementById('create_acc_btn');

// Function to shrink the button when clicked
function shrinkButton(button) {
    button.style.width = '20vw';
    button.style.height = '3vw';
}

// Function to restore the button size after release
function restoreButtonSize(button) {
    setTimeout(() => {
        button.style.width = '';
        button.style.height = '';
    }, 300); // Delay to make the transition visible
}

// Add event listeners to both buttons
submitBtnLogin.addEventListener('mousedown', function () {
    shrinkButton(submitBtnLogin);
});

submitBtnLogin.addEventListener('mouseup', function () {
    restoreButtonSize(submitBtnLogin);
});

submitBtnSignup.addEventListener('mousedown', function () {
    shrinkButton(submitBtnSignup);
});

submitBtnSignup.addEventListener('mouseup', function () {
    restoreButtonSize(submitBtnSignup);
});


/*
open sign up menu
*/
// Get the signup container and relevant elements
const signupContainer = document.getElementById('signupModal');
const signupContent = signupContainer.querySelector('.signup');
const signupLink = document.querySelector('.create_account a');
const closeSignup = document.getElementById('closeModal');

// Show the signup container when "Sign Up" is clicked
signupLink.addEventListener('click', (event) => {
    event.preventDefault(); // Prevent default link behavior
    signupContainer.style.display = 'block';
    setTimeout(() => {
        signupContent.classList.add('open'); // Trigger the slide-up animation
    }, 10); // Delay to ensure animation starts
});

// Hide the signup container when the close button is clicked
closeSignup.addEventListener('click', () => {
    signupContent.classList.remove('open'); // Slide content back down
    setTimeout(() => {
        signupContainer.style.display = 'none';
    }, 500); // Wait for animation to complete
});

// Optional: Hide the signup container if the user clicks outside the signup content
signupContainer.addEventListener('click', (event) => {
    if (event.target === signupContainer) {
        signupContent.classList.remove('open'); // Slide content back down
        setTimeout(() => {
            signupContainer.style.display = 'none';
        }, 500); // Wait for animation to complete
    }
});


/*
pop up for forgot password
 */
// Forgot Password Modal Toggle
const forgotPasswordModal = document.getElementById('forgotPasswordModal');
const forgotPasswordLink = document.querySelector('.forgot a'); // Your "Forgot Password" link
const closeForgotPassword = document.getElementById('closeForgotPassword');

// Open Forgot Password Modal
forgotPasswordLink.addEventListener('click', () => {
    forgotPasswordModal.style.display = 'flex';
    setTimeout(() => {
        document.querySelector('.forgotpassword').classList.add('open');
    }, 10); // Delay to allow smooth animation
});

// Close Forgot Password Modal
closeForgotPassword.addEventListener('click', () => {
    document.querySelector('.forgotpassword').classList.remove('open');
    setTimeout(() => {
        forgotPasswordModal.style.display = 'none';
    }, 500); // Delay to match animation duration
});

