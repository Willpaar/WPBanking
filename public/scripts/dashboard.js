//connect to supabse
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabaseUrl = 'https://bgrisydercrhmvtihfhi.supabase.co';
//not secure can update later
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJncmlzeWRlcmNyaG12dGloZmhpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ3NjA5MTMsImV4cCI6MjA1MDMzNjkxM30.ElC0GaMouwQ96uhzZeeRpb8wo5H0X8R8tYzb4QLjY8s';
const supabase = createClient(supabaseUrl, supabaseKey);

/* // Function to get the logged-in user's name and display it
async function displayUserName() {
    try {
        // Get the current session
        const { data: session, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
            console.error('Error retrieving session:', sessionError.message);
            return;
        }

        console.log('Session:', session); // Debugging line to check if session is valid

        if (session && session.user) {
            // Fetch the user data from the userdata table using the user ID
            const { data, error } = await supabase
                .from('userdata')
                .select('name')
                .eq('userid', session.user.id)
                .single(); // We expect only one row since 'userid' is unique

            if (error) {
                console.error('Error fetching user data:', error);
                document.getElementById('user-name').textContent = 'User';
            } else {
                // Display the user's name
                document.getElementById('user-name').textContent = data.name || 'User'; // Fallback to 'User' if no name is set
            }
        } else {
            // If no session or user is found, redirect to the login page
            console.log('No session found. Redirecting to login.');
            window.location.href = '/login'; // Adjust the path as needed
        }
    } catch (err) {
        console.error('Unexpected error:', err.message);
        alert('An unexpected error occurred.');
    }
}

// Call the function to display the user's name
displayUserName();*/