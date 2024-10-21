document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token'); // Récupération du token stocké dans localStorage

    if (!token) {
        alert('Token non trouvé, redirection vers la page de connexion.');
        window.location.href = '/signin'; // Redirection vers la page de connexion si le token est absent
        return;
    }

    try {
        // Requête pour obtenir la liste des utilisateurs via le token
        const response = await fetch('http://localhost:3001/api/users', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`, // Ajout du token dans l'en-tête Authorization
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const users = await response.json(); // Récupération des utilisateurs
            console.log(users); // Affichage de la liste des utilisateurs dans la console
        } else {
            alert('Token invalide, veuillez vous reconnecter.');
            window.location.href = '/signin'; // Redirection si le token est invalide
        }
    } catch (error) {
        console.error('Erreur lors de la vérification du token:', error);
        window.location.href = '/signin'; // Redirection en cas d'erreur
    }
});
