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
            <td class="text-center align-middle">${user.lastName}</td>
            <td class="text-center align-middle">${user.firstName}</td>
            <td class="text-center align-middle">${user.email}</td>
            <td class="text-center align-middle">${roles}</td>
            <td class="text-center">
                <button class="btn btn-warning btn-sm edit-user-btn mb-1" style="padding: 0.2rem 0.4rem; font-size: 0.75rem;">
                    <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-danger btn-sm delete-user-btn mb-1" style="padding: 0.2rem 0.4rem; font-size: 0.75rem;">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        `;

        // Ajout de l'événement pour le bouton de modification
        row.querySelector('.edit-user-btn').addEventListener('click', (event) => {
            event.stopPropagation(); // Empêche l'événement de propagation pour éviter d'ouvrir deux fois le modal
            showEditUserModal(user);
        });

        // Ajout de l'événement pour le bouton de suppression
        row.querySelector('.delete-user-btn').addEventListener('click', (event) => {
            event.stopPropagation(); // Empêche l'événement de propagation pour éviter d'ouvrir deux fois le modal
            showDeleteConfirmation(user);
        });

        // Ajout de l'événement pour l'ensemble de la ligne
        row.addEventListener('click', () => showEditUserModal(user));

        usersTableBody.appendChild(row);
    });
}

// Fonction pour afficher le modal de modification avec les données de l'utilisateur
function showEditUserModal(user) {
    document.getElementById('editUserId').value = user.id;
    document.getElementById('editLastName').value = user.lastName;
    document.getElementById('editFirstName').value = user.firstName;
    document.getElementById('editEmail').value = user.email;

    // Sélectionne le rôle approprié dans le select
    document.getElementById('editRoles').value = user.roles[0];

    const editUserModal = new bootstrap.Modal(document.getElementById('editUserModal'));
    editUserModal.show();
}

// Fonction pour gérer la sauvegarde des modifications de l'utilisateur
async function saveUserChanges() {
    const userId = document.getElementById('editUserId').value;
    const lastName = document.getElementById('editLastName').value;
    const firstName = document.getElementById('editFirstName').value;
    const email = document.getElementById('editEmail').value;
    const role = document.getElementById('editRoles').value;

    const authToken = getCookie('accesstoken');

    if (!authToken) {
        showAlert('danger', "Token non trouvé. Veuillez vous reconnecter.");
        return;
    }

    try {
        const response = await fetch(`https://127.0.0.1:8000/api/users/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-AUTH-TOKEN': authToken
            },
            body: JSON.stringify({
                lastName: lastName,
                firstName: firstName,
                email: email,
                roles: [role] // Envoie le rôle sélectionné comme un tableau
            })
        });

        if (response.ok) {
            showAlert('success', "Les modifications ont été enregistrées avec succès.");
            loadUsers();
            const editUserModal = bootstrap.Modal.getInstance(document.getElementById('editUserModal'));
            editUserModal.hide();
        } else {
            const errorData = await response.json();
            console.error("Erreur lors de la modification de l'utilisateur:", errorData);
            showAlert('danger', errorData.message || "Erreur lors de la modification de l'utilisateur.");
        }
    } catch (error) {
        console.error('Erreur de connexion:', error);
        showAlert('danger', "Une erreur est survenue pendant la connexion au serveur. Veuillez réessayer plus tard.");
    }
}

// Ajout de l'événement pour le bouton de sauvegarde des modifications
document.getElementById('saveUserChanges').addEventListener('click', saveUserChanges);

// Charger les utilisateurs lorsque la page est prête
loadUsers();



// Fonction pour ajuster le tableau uniquement pour les écrans mobiles
function adjustTableForMobile() {
    const table = document.querySelector('.table');
    if (window.innerWidth <= 768) {
        // Appliquer les classes pour les petits écrans
        table.classList.add('table-sm'); // Compacte le tableau pour mobile
        table.classList.add('w-auto');    // Limite la largeur au contenu pour mobile
    } else {
        // Supprimer les classes pour les grands écrans (desktop)
        table.classList.remove('table-sm');
        table.classList.remove('w-auto');
    }
}

// Exécuter la fonction au chargement et lors du redimensionnement de la fenêtre
window.addEventListener('load', adjustTableForMobile);
window.addEventListener('resize', adjustTableForMobile);
