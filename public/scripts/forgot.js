//connect to supabse
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabaseUrl = 'https://bgrisydercrhmvtihfhi.supabase.co';
//not secure can update later
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJncmlzeWRlcmNyaG12dGloZmhpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ3NjA5MTMsImV4cCI6MjA1MDMzNjkxM30.ElC0GaMouwQ96uhzZeeRpb8wo5H0X8R8tYzb4QLjY8s';
const supabase = createClient(supabaseUrl, supabaseKey);


//change password
document.getElementById('change_btn').addEventListener('click', async () => {

    const password = document.querySelector('.forgot_container input[placeholder="Password"]').value;
    const confirmPassword = document.querySelector('.forgot_container input[placeholder="Confirm Password"]').value;

    if (password !== confirmPassword) {
        alert('Passwords do not match!');
        console.log('Passwords do not match'); // Debugging: Ensure the condition is being evaluated
        return;
    }

    try {
        // Update the user's password
        const { error } = await supabase.auth.updateUser({
            password: password, // Setting the new password
        });

        if (error) {
            console.error('Error updating password:', error);
            alert('Error changing password: ' + error.message);
            return;
        }

        alert('Password successfully changed!');
        console.log('Password updated successfully'); // Debugging: Confirmation the update succeeded
    } catch (err) {
        console.error('Unexpected error:', err.message);
        alert('Unexpected error occurred. Please try again later.');
    }
});
