console.log("Script manage-habitats.js chargé");

// Vérification du rôle utilisateur
document.addEventListener('DOMContentLoaded', () => {
    const userRole = localStorage.getItem('userRole');
    
    if (userRole !== 'admin') {
        window.location.href = "/403";  // Redirection si l'utilisateur n'est pas admin
        return;
    }

    // Si l'utilisateur est admin, on peut continuer à exécuter le reste du code
    const habitatForm = document.getElementById('habitatForm');
    
    // Vérifie que le formulaire existe sur la page
    if (habitatForm) {
        habitatForm.addEventListener('submit', function (event) {
            event.preventDefault();
    
            const nom = document.getElementById('nomInput').value;
            const description = document.getElementById('descriptionInput').value;
            const type = document.getElementById('typeInput').value;
    
            // Simuler l'ajout d'un nouvel habitat (connexion avec un backend si nécessaire)
            console.log('Nouvel habitat ajouté :', { nom, description, type });
    
            alert('Habitat ajouté avec succès !');
        });
    }
});
