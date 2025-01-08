//connect to supabse
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabaseUrl = 'https://bgrisydercrhmvtihfhi.supabase.co';
//not secure can update later
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJncmlzeWRlcmNyaG12dGloZmhpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ3NjA5MTMsImV4cCI6MjA1MDMzNjkxM30.ElC0GaMouwQ96uhzZeeRpb8wo5H0X8R8tYzb4QLjY8s';
const supabase = createClient(supabaseUrl, supabaseKey);
// Function to load or refresh the dashboard

async function loadDashboard() {
    try {
        // Get the current user session
        const { data: { user }, error } = await supabase.auth.getUser();

        if (error || !user) {
            console.error('Error retrieving user or no user signed in:', error?.message || 'No user');
            // Redirect to login page if no user is signed in
            window.location.href = '/login';
            return;
        }

        console.log('Current user:', user);

        // Fetch the user's name from the userdata table
        const { data: userdata, error: userdataError } = await supabase
            .from('userdata')
            .select('name')
            .eq('userid', user.id)
            .single(); // Assuming `userid` is unique

        if (userdataError) {
            console.error('Error retrieving user data:', userdataError.message);
            alert('Failed to load user data.');
            return;
        }

        // Update the dashboard with the user's name
        const userNameElement = document.getElementById('user-name');
        if (userNameElement) {
            userNameElement.textContent = userdata.name || 'User'; // Fallback if name is null
        }
    } catch (err) {
        console.error('Unexpected error:', err.message);
    }
}

// Load dashboard on page load
document.addEventListener('DOMContentLoaded', async () => {
    await loadDashboard();
});


// Add Account Modal Toggle
const addModal = document.getElementById('addModal');
const openAddModal = document.getElementById('openAddModal');
const closeAddModal = document.getElementById('closeAddModal');

// Function to reset modal content to original menu (Savings and Checking buttons)
function resetModalToOriginalMenu() {
    const modalContent = document.querySelector('.modal-content');

    // Set the modal content to the original account creation menu
    const originalMenuHTML = `
        <span class="close" id="closeAddModal">&times;</span>
        <h2>Create a New Account</h2>
        <div class="btn_cont">
            <button class="submit_but" id="create_savings">Savings Account</button>
        </div>
        <div class="btn_cont">
            <button class="submit_but" id="create_checking">Checking Account</button>
        </div>
    `;

    modalContent.innerHTML = originalMenuHTML;

    // Reattach the event listeners to the buttons
    document.getElementById('create_savings').addEventListener('click', () => {
        changeModalToAccountForm('Savings Account');
    });

    document.getElementById('create_checking').addEventListener('click', () => {
        changeModalToAccountForm('Checking Account');
    });

    // Reattach the close button functionality
    document.getElementById('closeAddModal').addEventListener('click', () => {
        document.querySelector('.modal-content').classList.remove('open');
        setTimeout(() => {
            addModal.style.display = 'none';
        }, 500);
    });
}

// Open Add Account Modal
openAddModal.addEventListener('click', () => {
    addModal.style.display = 'flex';
    setTimeout(() => {
        document.querySelector('.modal-content').classList.add('open');
    }, 10); // Delay to allow smooth animation

    // Reset the modal to the original menu every time it opens
    resetModalToOriginalMenu();
});

// Close Add Account Modal
closeAddModal.addEventListener('click', () => {
    document.querySelector('.modal-content').classList.remove('open');
    setTimeout(() => {
        addModal.style.display = 'none';
    }, 500); // Delay to match animation duration
});

// Function to change modal to account creation form
function changeModalToAccountForm(accountType) {
    const modalContent = document.querySelector('.modal-content');
    const btnCont = document.querySelectorAll('.btn_cont');

    // Remove the existing buttons
    btnCont.forEach(btn => btn.style.display = 'none');

    // Add new form content
    const accountFormHTML = `
        <span class="close" id="closeAddModal">&times;</span>
        <h2>Create ${accountType}</h2>
        <div class="input_box">
            <input type="text" id="accountName" placeholder="Account Name" required>
        </div>
        <div class="submit">
            <button class="submit_but" id="createAccountBtn">Create ${accountType} Account</button>  
        </div>
    `;
    
    modalContent.innerHTML = accountFormHTML;

    // Set the submit button functionality
    document.getElementById('createAccountBtn').addEventListener('click', () => {
        const accountName = document.getElementById('accountName').value;
        if (accountName.trim() === '') {
            alert('Please enter an account name');
            return;
        }
        alert(`${accountType} account with name "${accountName}" created!`);
        // Optionally, you can perform actual account creation logic here.
    });

    // Reattach the close button functionality after replacing the content
    document.getElementById('closeAddModal').addEventListener('click', () => {
        document.querySelector('.modal-content').classList.remove('open');
        setTimeout(() => {
            addModal.style.display = 'none';
        }, 500);
    });
}

