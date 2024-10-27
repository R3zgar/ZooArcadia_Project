// Variables pour la table des commentaires
const commentsTableBody = document.querySelector('#commentsTableBody');
const alertContainer = document.getElementById('alertContainer');

console.log("Variables initialisées pour la gestion des commentaires.");

// Fonction pour afficher un message d'alerte dans alertContainer
function showAlert(type, message) {
    const alertElement = document.createElement('div');
    alertElement.className = `alert alert-${type} alert-dismissible fade show`;
    alertElement.role = 'alert';
    alertElement.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;

    // Ajout de l'élément d'alerte au conteneur
    alertContainer.appendChild(alertElement);

    // Supprimer le message après 5 secondes
    setTimeout(() => {
        if (alertContainer.contains(alertElement)) {
            alertContainer.removeChild(alertElement);
        }
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

// Fonction pour charger les commentaires depuis l'API
async function loadComments() {
    console.log("Chargement des commentaires...");
    const authToken = getCookie('accesstoken');

    if (!authToken) {
        showAlert('danger', "Token non trouvé. Veuillez vous reconnecter.");
        return;
    }

    try {
        const response = await fetch('https://127.0.0.1:8000/api/commentaire', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-AUTH-TOKEN': authToken
            }
        });

        console.log('Statut de la réponse:', response.status);
        const data = await response.json();
        console.log('Données reçues:', data);

        if (response.ok) {
            populateCommentTable(data.data);
            console.log("Commentaires chargés avec succès.");
        } else {
            console.error("Erreur lors de la récupération des commentaires:", data);
            showAlert('danger', data.message || "Erreur lors de la récupération des commentaires.");
        }
    } catch (error) {
        console.error('Erreur de connexion:', error);
        showAlert('danger', "Une erreur est survenue pendant la connexion au serveur. Veuillez réessayer plus tard.");
    }
}



// Fonction pour approuver un commentaire
async function approveComment(commentId) {
    console.log("Approbation du commentaire ID:", commentId);
    const authToken = getCookie('accesstoken');

    if (!authToken) {
        showAlert('danger', "Token non trouvé. Veuillez vous reconnecter.");
        return;
    }

    try {
        const response = await fetch(`https://127.0.0.1:8000/api/commentaire/${commentId}/approve`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'X-AUTH-TOKEN': authToken
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Erreur côté serveur:', errorData);
            showAlert('danger', errorData.message || 'Erreur lors de la validation du commentaire.');
        } else {
            const result = await response.json();
            showAlert('success', result.message);

            // Recharger les commentaires pour afficher les mises à jour
            loadComments(); 
        }
    } catch (error) {
        console.error('Erreur de connexion:', error);
        showAlert('danger', "Une erreur est survenue pendant la connexion au serveur. Veuillez réessayer plus tard.");
    }
}

// Fonction pour gérer la suppression d'un commentaire
async function deleteComment(commentId) {
    console.log("Suppression du commentaire avec l'ID:", commentId);
    const authToken = getCookie('accesstoken');

    if (!authToken) {
        showAlert('danger', "Token non trouvé. Veuillez vous reconnecter.");
        return;
    }

    try {
        const response = await fetch(`https://127.0.0.1:8000/api/commentaire/${commentId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'X-AUTH-TOKEN': authToken
            }
        });

        if (response.ok) {
            showAlert('success', "Commentaire supprimé avec succès.");
            loadComments();
        } else {
            const errorData = await response.json();
            console.error("Erreur lors de la suppression du commentaire:", errorData);
            showAlert('danger', errorData.message || "Erreur lors de la suppression du commentaire.");
        }
    } catch (error) {
        console.error('Erreur de connexion:', error);
        showAlert('danger', "Une erreur est survenue pendant la connexion au serveur. Veuillez réessayer plus tard.");
    }
}


function populateCommentTable(comments) {
    commentsTableBody.innerHTML = '';
    comments.forEach(comment => {
        const status = comment.status.toLowerCase() === 'approuvé'
            ? '<span class="badge bg-success">Approuvé</span>'
            : '<span class="badge bg-warning">En attente</span>';

        // Vérification si le commentaire est déjà approuvé
        const isApproved = comment.status.toLowerCase() === 'approuvé';

        const row = document.createElement('tr');
        row.classList.add('hover-row');

        row.innerHTML = `
            <td>${comment.auteur}</td>
            <td>${comment.contenu}</td>
            <td>${comment.created_at}</td>
            <td>${status}</td>
            <td class="action-buttons d-flex flex-column flex-md-row justify-content-center align-items-center gap-2">
                <button class="btn btn-success btn-sm mb-2 mb-md-0" onclick="approveComment(${comment.id})" title="Approuver" ${isApproved ? 'disabled' : ''}>
                    <i class="bi bi-check-circle"></i>
                </button>
                <button class="btn btn-danger btn-sm" onclick="deleteComment(${comment.id})" title="Supprimer">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        `;

        commentsTableBody.appendChild(row);
    });
}



// Charger les commentaires lorsque la page est prête
loadComments();
