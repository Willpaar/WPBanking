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

