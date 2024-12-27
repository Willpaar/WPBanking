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


import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

//connect to supabse
const supabaseUrl = 'https://bgrisydercrhmvtihfhi.supabase.co';
//not secure can update later
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJncmlzeWRlcmNyaG12dGloZmhpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ3NjA5MTMsImV4cCI6MjA1MDMzNjkxM30.ElC0GaMouwQ96uhzZeeRpb8wo5H0X8R8tYzb4QLjY8s';
const supabase = createClient(supabaseUrl, supabaseKey);

//sign up function
document.getElementById('create_acc_btn').addEventListener('click', async () => {
    const name = document.querySelector('.signup_container input[placeholder="Name"]').value;  // Get the name
    const email = document.querySelector('.signup_container input[placeholder="Email"]').value;
    const password = document.querySelector('.signup_container input[placeholder="Password"]').value;
    const confirmPassword = document.querySelector('.signup_container input[placeholder="Confirm Password"]').value;

    if (!name) {
        alert('Please give display name');
        return;
    }

    if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
    }

    try {
        // Check if email already exists
        const { data: emailExists, error: checkError } = await supabase.rpc('check_email_exists', { email_input: email });

        if (checkError) {
            console.error('Error checking email:', checkError);
            alert('An error occurred while checking for the email. Please try again later.');
            return;
        }

        if (emailExists) {
            alert('This email is already registered. Please log in.');
            return;
        }

        // Sign up the user
        const { data: authData, error: authError } = await supabase.auth.signUp({ email, password });

        if (authError) {
            alert('Error signing up: ' + authError.message);
            console.error('Error signing up:', authError);
            return;
        }

        console.log('Signup successful, user data:', authData);

        // Update the name in the `userdata` table
        const { data: updatedUserData, error: updateError } = await supabase
            .from('userdata')
            .update({ name: name })
            .eq('userid', authData.user.id);

        if (updateError) {
            console.error('Error updating userdata:', updateError);
            alert('An error occurred while updating your name. Please try again later.');
            return;
        }

        alert('Signup successful! Please check your email to verify your account.');

    } catch (err) {
        console.error('Unexpected error:', err.message);
        alert('Unexpected error occurred. Please try again later.');
    }
});


// Forgot password email send
document.getElementById('send_email_btn').addEventListener('click', async () => {
    const email = document.querySelector('.forgotpassword_container input[placeholder="Email"]').value;

    try {
        // Check if email exists in the database
        const { data: emailExists, error: checkError } = await supabase.rpc('check_email_exists', { email_input: email });

        if (checkError) {
            console.error('Error checking email:', checkError);
            alert('An error occurred while checking for the email. Please try again later.');
            return;
        }

        if (!emailExists) {
            alert('This email is not registered. Please check your email and try again.');
            return;
        }
        
        // Send password reset email with custom redirect URL
        const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: 'http://localhost:3000/forgot'  // Custom redirect URL
        });

        if (resetError) {
            alert('Error sending password reset email: ' + resetError.message);
            return;
        }

        alert('Password reset email sent! Please check your inbox.');
    } catch (err) {
        console.error('Unexpected error:', err.message);
        alert('Unexpected error occurred. Please try again later.');
    }
});

// Sign in function
document.getElementById('submit_btn').addEventListener('click', async (event) => {
    event.preventDefault();  // Prevents the default form submission behavior

    const email = document.querySelector('.login_container input[placeholder="Email"]').value;
    const password = document.querySelector('.login_container input[placeholder="Password"]').value;
    const rememberMe = document.getElementById('check').checked;  // Check if 'Remember Me' is checked

    if (!email || !password) {
        alert('Please enter both email and password');
        return;
    }

    try {
        // Sign in the user with Supabase
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) {
            console.error('Error signing in:', error.message);
            alert('Invalid credentials or error signing in.');
            return;
        }

        console.log('Sign in successful, user data:', data);

        // If 'Remember Me' is checked, the session is automatically persisted by Supabase
        // No need to manually call setAuth() here.

        // Redirect to the dashboard after successful login
        window.location.href = '/dashboard'; // Adjust the URL as needed

    } catch (err) {
        console.error('Unexpected error:', err.message);
        alert('Unexpected error occurred. Please try again later.');
    }
});


