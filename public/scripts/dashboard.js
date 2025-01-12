//connect to supabse
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabaseUrl = 'https://bgrisydercrhmvtihfhi.supabase.co';
//not secure can update later
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJncmlzeWRlcmNyaG12dGloZmhpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ3NjA5MTMsImV4cCI6MjA1MDMzNjkxM30.ElC0GaMouwQ96uhzZeeRpb8wo5H0X8R8tYzb4QLjY8s';
const supabase = createClient(supabaseUrl, supabaseKey);
// Function to load or refresh the dashboard

// Function to load and display user bank accounts
async function loadUserAccounts() {
    try {
        // Get the current user session
        const { data: { user }, error: userError } = await supabase.auth.getUser();

        if (userError || !user) {
            console.error('Error retrieving user:', userError?.message || 'No user found');
            alert('User not authenticated. Please log in again.');
            return;
        }

        // Fetch all bank accounts for the logged-in user
        const { data: accounts, error: accountsError } = await supabase
            .from('bank_accounts')
            .select('account_id, account_type, balance, acc_name') 
            .eq('userid', user.id);
        if (accountsError) {
            console.error('Error fetching accounts:', accountsError.message);
            alert('Failed to load accounts. Please try again.');
            return;
        }

        // Get the container to display the account boxes
        const accountsContainer = document.getElementById('accounts-container');
        accountsContainer.innerHTML = '';  // Clear any existing content

        // Loop through each account and create a box
        accounts.forEach(account => {
            const accountBox = document.createElement('div');
            accountBox.classList.add('account-box');
            accountBox.innerHTML = `
                <h1>${account.acc_name}</h1>
                <h3>${account.account_type}</h3>
                <p>Balance: $${account.balance.toFixed(2)}</p>
                <button class="gear-btn" data-account-id="${account.account_id}">⚙️</button>
            `;
            accountsContainer.appendChild(accountBox);
            
        });


        // If no accounts, show a message
        if (accounts.length === 0) {
            accountsContainer.innerHTML = '<p>No accounts found. Create a new account to get started!</p>';
        }
    } catch (err) {
        console.error('Unexpected error:', err.message);
        alert('An unexpected error occurred. Please try again.');
    }
}


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

        //then load accounts
        await loadUserAccounts();

    } catch (err) {
        console.error('Unexpected error:', err.message);
    }
}

// Load dashboard on page load
document.addEventListener('DOMContentLoaded', async () => {
    await loadDashboard();
});


/*
this section is for creating an account
*/ 


// Add Account Modal Toggle
const addModal = document.getElementById('addModal');
const openAddModal = document.getElementById('openAddModal');

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
        changeModalToAccountForm('Savings');
    });

    document.getElementById('create_checking').addEventListener('click', () => {
        changeModalToAccountForm('Checking');
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
    document.getElementById('createAccountBtn').addEventListener('click', async () => {
        const accountName = document.getElementById('accountName').value;
        if (accountName.trim() === '') {
            alert('Please enter an account name');
            return;
        }

        try {
            // Get the current user session to access the user ID
            const { data: { user }, error: userError } = await supabase.auth.getUser();

            if (userError || !user) {
                console.error('Error retrieving user:', userError?.message || 'No user found');
                alert('User not authenticated. Please log in again.');
                return;
            }

            // Call the SQL function to create a bank account
            const { data, error } = await supabase.rpc('create_bank_account', {
                input_userid: user.id,
                input_account_name: accountName,
                input_account_type: accountType
            });

            if (error) {
                console.error('Error creating account:', error.message);
                alert('Failed to create account. Please try again.');
                return;
            }

            alert(`${accountType} account with name "${accountName}" created!`);

            document.querySelector('.modal-content').classList.remove('open');
            setTimeout(() => {
                addModal.style.display = 'none';
            }, 500);

            await loadUserAccounts();

        } catch (err) {
            console.error('Unexpected error:', err.message);
            alert('An unexpected error occurred. Please try again.');
        }
    });

    // Reattach the close button functionality after replacing the content
    document.getElementById('closeAddModal').addEventListener('click', () => {
        document.querySelector('.modal-content').classList.remove('open');
        setTimeout(() => {
            addModal.style.display = 'none';
        }, 500);
    });
}

/*
this section is for opening account settings
*/ 


// Event listener for gear buttons opens a modal
document.addEventListener('click', (event) => {
    if (event.target.classList.contains('gear-btn')) {
        const accountId = event.target.getAttribute('data-account-id');

    addModal.style.display = 'flex';
    setTimeout(() => {
    document.querySelector('.modal-content').classList.add('open');
    }, 10);

    changeModalToAccountSettings(accountId);

    }
});


function changeModalToAccountSettings(accountId) {
    supabase
        .from('bank_accounts') 
        .select('acc_name, balance')
        .eq('account_id', accountId)
        .single()
        .then(({ data, error }) => {
            if (error) {
                console.error('Error fetching account:', error.message);
                alert('Failed to fetch account data.');
                return;
            }

            const modalContent = document.querySelector('.modal-content');

            const accountFormHTML = `
                <span class="close" id="closeAddModal">&times;</span>
                <h2>${data.acc_name}</h2>
                <button class="submit_but" id="depositBtn">Deposit</button>
                <button class="submit_but" id="withdrawalBtn">Withdraw</button>
                <button class="submit_but" id="transferBtn">Transfer</button>
                <button class="submit_but" id="deleteAccountBtn">Delete Account</button>
            `;

            modalContent.innerHTML = accountFormHTML;

            // Reattach the close button functionality AFTER updating content
            document.getElementById('closeAddModal').addEventListener('click', () => {
                modalContent.classList.remove('open');
                setTimeout(() => {
                    document.querySelector('.modal').style.display = 'none';  // Updated selector
                }, 500);
            });

            //attach withdrawl and deposit buttons
            document.getElementById('depositBtn').addEventListener('click', () => {
                withdrawDepositModal(accountId, 'Deposit', data.balance);
            });
        
            document.getElementById('withdrawalBtn').addEventListener('click', () => {
                withdrawDepositModal(accountId, 'Withdraw', data.balance);
            });

            //delete button
            document.getElementById('deleteAccountBtn').addEventListener('click', () => {
                areYouSureDelete(accountId);
            });

        });
}


function withdrawDepositModal(accountId, type, balance){
    const modalContent = document.querySelector('.modal-content');

    const accountFormHTML = `
    <span class="close" id="closeAddModal">&times;</span>
    <h1>${type} How Much?</h1>
    <p id="balance" >Balance: $${balance}</p>
    <div class="input_box">
        <input type="number" id="ammount" placeholder="${type} Amount" required>
    </div>
    <div class="submit">
        <button class="submit_but" id="submit_ammount">${type}</button>  
    </div>
    `;

    modalContent.innerHTML = accountFormHTML;

    // Reattach the close button functionality AFTER updating content
    document.getElementById('closeAddModal').addEventListener('click', () => {
        modalContent.classList.remove('open');
        setTimeout(() => {
            document.querySelector('.modal').style.display = 'none';  // Updated selector
        }, 500);
    });

    //attach withdrawl and deposit buttons
    document.getElementById('submit_ammount').addEventListener('click', () => {
        const amount = document.getElementById('ammount').value;
        if (amount.trim() === '' || amount <= 0 || !/^\d+(\.\d{1,2})?$/.test(amount)) {
            alert('Please enter a valid amount');
            return;
        }
        changeBalance(accountId, type, amount, balance);
    });

}

async function changeBalance(accountId, type, amount, balance){
    if(type === 'Withdraw'){
        if(balance < amount){
            alert('Insuficient Funds!');
            return;
        }
        balance -= amount;
    }
    else{
        balance += amount;
    }

    const { data, error } = await supabase
        .from('bank_accounts')
        .update({ balance: balance })
        .eq('account_id', accountId);

    if (error) {
        console.error('Error updating balance:', error);
        alert('Failed to update balance');
    } else {
        console.log('Balance updated successfully:', data);
        alert('Balance updated successfully');
    }

    document.querySelector('.modal-content').classList.remove('open');
    setTimeout(() => {
        addModal.style.display = 'none';
    }, 500);

    await loadUserAccounts();
}

function areYouSureDelete(accountId){
    const modalContent = document.querySelector('.modal-content');

    const accountFormHTML = `
        <span class="close" id="closeAddModal">&times;</span>
        <h2>Are You Sure?</h2>
        <div class - "delete_btns">
            <button class="confirmation_but" id="Cancel">Cancel</button>
            <button class="confirmation_but" id="Delete">Delete</button>
        </div>
    `;

    modalContent.innerHTML = accountFormHTML;

    // Reattach the close button functionality AFTER updating content
    document.getElementById('closeAddModal').addEventListener('click', () => {
        modalContent.classList.remove('open');
        setTimeout(() => {
            document.querySelector('.modal').style.display = 'none';  // Updated selector
        }, 500);
    });

    document.getElementById('Cancel').addEventListener('click', () => {
        changeModalToAccountSettings(accountId);
    });

    document.getElementById('Delete').addEventListener('click', () => {
        deleteAccount(accountId);
    });
}


async function deleteAccount(accountId) {
    const { data, error } = await supabase
        .from('bank_accounts')
        .delete()
        .eq('account_id', accountId);

    if (error) {
        console.error('Error deleting account:', error);
        alert('Failed to delete the account.');
    } else {
        console.log('Account deleted:', data);
        alert('Account deleted successfully.');
    }

    document.querySelector('.modal-content').classList.remove('open');
    setTimeout(() => {
        addModal.style.display = 'none';
    }, 500);

    await loadUserAccounts();
}

