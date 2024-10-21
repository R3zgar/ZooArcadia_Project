document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
        window.location.href = '/signin';
        return;
    }

    // Verify token
    fetch('http://localhost:3001/api/verify-token', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            window.location.href = '/signin';
        }
    });

    // Proceed with managing services or habitats
    console.log("Token verified, proceed with managing services/habitats...");
});
