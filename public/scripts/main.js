import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

//connect to supabse
const supabaseUrl = 'https://bgrisydercrhmvtihfhi.supabase.co';
//not secure can update later
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJncmlzeWRlcmNyaG12dGloZmhpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ3NjA5MTMsImV4cCI6MjA1MDMzNjkxM30.ElC0GaMouwQ96uhzZeeRpb8wo5H0X8R8tYzb4QLjY8s';
const supabase = createClient(supabaseUrl, supabaseKey);

/**
other functions we need
 */
//reattatch the close button
function attachCloseModal() {
    document.getElementById('closeAddModal').addEventListener('click', () => {
        document.querySelector('.modal-content').classList.remove('open');
        setTimeout(() => {
            addModal.style.display = 'none';
        }, 500);
    });
}

function capitalizeFirstLetter(string) {
    return string
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
}

/*
functions to show signup and forgot modal
*/
// Open Add Account Modal
const addModal = document.getElementById('addModal');
const opencreateModal = document.querySelectorAll('.create_account a');
const openforgotModal = document.querySelectorAll('.forgot a');

// Function to handle opening the modal
const openModal = (event) => {
    event.preventDefault(); // Prevent default link behavior
    addModal.style.display = 'flex'; // Open modal with flex display

    // Smooth animation for modal
    setTimeout(() => {
        document.querySelector('.modal-content').classList.add('open');
    }, 10); // Delay to allow smooth animation
};

// Event listener for opening the addModal (create account)
opencreateModal.forEach(link => {
    link.addEventListener('click', (event) => {
        openModal(event); // Open the modal
        changeModalSignUp(); // Change the modal content to sign-up form
    });
});

// Event listener for opening the addModal (forgot account)
openforgotModal.forEach(link => {
    link.addEventListener('click', (event) => {
        openModal(event); // Open the modal
        changeModalToForgot(); // Change the modal content to forgot password form
    });
});

// Function to reset modal content to sign-up form
async function changeModalSignUp() {
    const modalContent = document.querySelector('.modal-content');

    // Set the modal content to the sign-up menu
    const originalMenuHTML = `
        <span class="close" id="closeAddModal">&times;</span>
        <h2>Sign Up</h2>
        <div class="input_box_cont">
            <input type="text" class="input_box" placeholder="Name" autocomplete="off" required>
        </div>
        <div class="input_box_cont">
            <input type="text" class="input_box" placeholder="Email" autocomplete="off" required>
        </div>
        <div class="input_box_cont">
            <input type="password" class="input_box" placeholder="Password" autocomplete="off" required>
        </div>
        <div class="input_box_cont">
            <input type="password" class="input_box" placeholder="Confirm Password" autocomplete="off" required>
        </div>
        <div class="submit">
            <button class="submit_but" id="create_acc_btn">Create Account</button>
        </div>
    `;
    modalContent.innerHTML = originalMenuHTML;

    // Attach event listener for closing the modal
    attachCloseModal();

    //sign up function
    document.getElementById('create_acc_btn').addEventListener('click', async () => {
        const name = capitalizeFirstLetter(document.querySelector('.modal-content input[placeholder="Name"]').valueP);
        const email = document.querySelector('.modal-content input[placeholder="Email"]').value;
        const password = document.querySelector('.modal-content input[placeholder="Password"]').value;
        const confirmPassword = document.querySelector('.modal-content input[placeholder="Confirm Password"]').value;
        
        if (!name) {
            alert('Please give display name');
            return;
        }

        if(!email){
            alert('Pleae enter an email');
            return;
        }

        if(!password){
            alert('Pleae enter a password');
            return;
        }

        if (password !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }

        name = capitalizeFirstLetter(name);

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
    }

// Function to reset modal content to forgot password form
async function changeModalToForgot() {
    const modalContent = document.querySelector('.modal-content');

    // Set the modal content to the forgot password menu
    const originalMenuHTML = `
        <span class="close" id="closeAddModal">&times;</span>
        <h2>Forgot Password</h2>
        <div class="input_box_cont">
            <input type="text" class="input_box" placeholder="Email" autocomplete="off" required>
        </div>
        <div class="submit">
            <button class="submit_but" id="send_email_btn">Send Email</button>
        </div>
    `;
    modalContent.innerHTML = originalMenuHTML;

    // Forgot password email send
document.getElementById('send_email_btn').addEventListener('click', async () => {
    const email = document.querySelector('.modal-content input[placeholder="Email"]').value;

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


    // Attach event listener for closing the modal
    attachCloseModal();
}


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

        window.location.href = `/dashboard`;
    } catch (err) {
        console.error('Unexpected error:', err.message);
        alert('Unexpected error occurred. Please try again later.');
    }
});