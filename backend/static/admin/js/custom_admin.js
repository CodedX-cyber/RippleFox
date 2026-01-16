document.addEventListener('DOMContentLoaded', function() {
    // Add active class to current menu item
    const currentPath = window.location.pathname;
    document.querySelectorAll('.app-list a').forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        }
    });

    // Add toggle for mobile menu
    const menuToggle = document.createElement('button');
    menuToggle.className = 'menu-toggle';
    menuToggle.innerHTML = '☰ Menu';
    menuToggle.style.display = 'none';
    document.querySelector('#header').appendChild(menuToggle);

    // Toggle sidebar on mobile
    menuToggle.addEventListener('click', function() {
        const sidebar = document.querySelector('#content-related');
        sidebar.style.display = sidebar.style.display === 'none' ? 'block' : 'none';
    });

    // Handle responsive menu
    function handleResize() {
        const sidebar = document.querySelector('#content-related');
        if (window.innerWidth <= 1024) {
            menuToggle.style.display = 'block';
            sidebar.style.display = 'none';
        } else {
            menuToggle.style.display = 'none';
            sidebar.style.display = 'block';
        }
    }

    // Initial check
    handleResize();
    window.addEventListener('resize', handleResize);

    // Add confirmation for delete actions
    document.querySelectorAll('.deletelink').forEach(link => {
        link.addEventListener('click', function(e) {
            if (!confirm('Are you sure you want to delete this item?')) {
                e.preventDefault();
            }
        });
    });

    // Improve form validation
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            const requiredFields = form.querySelectorAll('[required]');
            let isValid = true;

            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.style.borderColor = '#dc3545';
                }
            });

            if (!isValid) {
                e.preventDefault();
                alert('Please fill in all required fields');
            }
        });
    });
});
