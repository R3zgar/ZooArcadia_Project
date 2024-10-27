// Variables pour la table des utilisateurs
const usersTableBody = document.querySelector('#manage-users tbody');
const alertContainer = document.getElementById('alertContainer');

console.log("Variables initialisées.");

// Fonction pour afficher les messages d'alerte
function showAlert(type, message) {
    const alertElement = document.createElement('div');
    alertElement.className = `alert alert-${type} alert-dismissible fade show`;
    alertElement.role = 'alert';
    alertElement.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    
    alertContainer.appendChild(alertElement);

    // Cacher le message après 5 secondes
    setTimeout(() => {
        alertElement.classList.remove('show');
        alertElement.classList.add('d-none');
        alertContainer.removeChild(alertElement);
    }, 7000);
}

// Fonction pour récupérer le token depuis les cookies
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
        return parts.pop().split(';').shift();
    }
    return null;
}

// Fonction pour charger les utilisateurs depuis l'API
async function loadUsers() {
    console.log("Chargement des utilisateurs...");
    const authToken = getCookie('accesstoken');

    if (!authToken) {
        showAlert('danger', "Token non trouvé. Veuillez vous reconnecter.");
        return;
    }

    try {
        const response = await fetch('https://127.0.0.1:8000/api/users', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-AUTH-TOKEN': authToken
            }
        });

        if (response.ok) {
            const users = await response.json();
            populateUserTable(users);
            console.log("Utilisateurs chargés avec succès.");
        } else {
            const errorData = await response.json();
            console.error("Erreur lors de la récupération des utilisateurs:", errorData);
            showAlert('danger', errorData.message || "Erreur lors de la récupération des utilisateurs.");
        }
    } catch (error) {
        console.error('Erreur de connexion:', error);
        showAlert('danger', "Une erreur est survenue pendant la connexion au serveur. Veuillez réessayer plus tard.");
    }
}

// Fonction pour afficher une boîte de dialogue de confirmation personnalisée
function showDeleteConfirmation(user) {
    const confirmationMessage = `Voulez-vous vraiment supprimer l'utilisateur : ${user.firstName} ${user.lastName} avec le rôle ${user.roles.join(', ')} ?`;
    if (confirm(confirmationMessage)) {
        deleteUser(user.id, user.firstName, user.lastName, user.roles);
    } else {
        showAlert('warning', `La suppression de ${user.firstName} ${user.lastName} a été annulée.`);
    }
}

// Fonction pour gérer la suppression de l'utilisateur
async function deleteUser(userId, firstName, lastName, roles) {
    console.log("Suppression de l'utilisateur avec l'ID:", userId);
    const authToken = getCookie('accesstoken');

    if (!authToken) {
        showAlert('danger', "Token non trouvé. Veuillez vous reconnecter.");
        return;
    }

    try {
        const response = await fetch(`https://127.0.0.1:8000/api/users/${userId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'X-AUTH-TOKEN': authToken
            }
        });

        if (response.ok) {
            showAlert('success', `L'utilisateur ${firstName} ${lastName} avec le rôle ${roles.join(', ')} a été supprimé avec succès.`);
            loadUsers(); // Recharge la liste des utilisateurs sans rafraîchir la page
        } else {
            const errorData = await response.json();
            console.error("Erreur lors de la suppression de l'utilisateur:", errorData);
            showAlert('danger', errorData.message || "Erreur lors de la suppression de l'utilisateur.");
        }
    } catch (error) {
        console.error('Erreur de connexion:', error);
        showAlert('danger', "Une erreur est survenue pendant la connexion au serveur. Veuillez réessayer plus tard.");
    }
}

// Fonction pour remplir la table des utilisateurs
function populateUserTable(users) {
    usersTableBody.innerHTML = '';
    users.forEach(user => {
        const roles = user.roles.join(', ');
        const row = document.createElement('tr');
        row.classList.add('hover-row');

        row.innerHTML = `
            <td>${user.lastName}</td>
            <td>${user.firstName}</td>
            <td>${user.email}</td>
            <td>${roles}</td>
            <td>
                <button class="btn btn-warning btn-sm me-2 edit-user-btn">
                    <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-danger btn-sm delete-user-btn">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        `;

        row.querySelector('.delete-user-btn').addEventListener('click', () => showDeleteConfirmation(user));
        usersTableBody.appendChild(row);
    });
}

// Appelle la fonction pour charger les utilisateurs lorsque la page est prête
loadUsers();
