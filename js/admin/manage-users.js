console.log("Script manage-users.js chargé");

// Vérification du rôle utilisateur
document.addEventListener('DOMContentLoaded', () => {
    const userRole = localStorage.getItem('userRole');
    
    if (userRole !== 'admin') {
        window.location.href = "/403";  // Redirection si l'utilisateur n'est pas admin
        return;
    }

    // Continuez le reste du code si l'utilisateur est admin
    const userForm = document.getElementById('userForm');
    
    // Vérifie que le formulaire existe sur la page
    if (userForm) {
        userForm.addEventListener('submit', function (event) {
            event.preventDefault();
    
            const nom = document.getElementById('nomInput').value;
            const prenom = document.getElementById('prenomInput').value;
            const email = document.getElementById('emailInput').value;
            const role = document.getElementById('roleSelect').value;
    
            // Simuler l'ajout d'un nouvel utilisateur (connexion avec un backend si nécessaire)
            console.log('Nouvel utilisateur ajouté :', { nom, prenom, email, role });
    
            alert('Utilisateur ajouté avec succès !');
        });
    }
});
