// Variables pour la gestion des alertes
const alertContainer = document.getElementById('alertContainer');

// Fonction pour afficher les messages d'alerte
function showAlert(type, message) {
    const alertElement = document.createElement('div');
    alertElement.className = `alert alert-${type} alert-dismissible fade show`;
    alertElement.role = 'alert';
    alertElement.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Fermer"></button>
    `;
    alertContainer.appendChild(alertElement);

    // Supprime l'alerte après 7 secondes
    setTimeout(() => {
        alertContainer.removeChild(alertElement);
    }, 7000);
}

// Fonction pour récupérer le token d'accès depuis les cookies
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
        return parts.pop().split(';').shift();
    }
    return null;
}

// Fonction pour charger les informations de l'animal et afficher view_count uniquement dans le modal
async function loadAnimalInfo(animalName, modalId) {
    console.log("Chargement des informations de l'animal :", animalName);
    const authToken = getCookie('accesstoken');

    if (!authToken) {
        showAlert('danger', "Token introuvable. Veuillez vous reconnecter.");
        return;
    }

    try {
        const response = await fetch(`${apiUrl}animal`, {
            method: 'GET',
            headers: {
                'X-AUTH-TOKEN': authToken
            }
        });

        if (response.ok) {
            const data = await response.json();
            const animalData = data.data.find(animal => animal.prenom_animal === animalName);

            if (animalData) {
                // Met à jour le view_count dans le modal correspondant
                document.querySelector(`#${modalId} .view-count`).innerText = animalData.view_count;
            } else {
                console.error("Erreur : Animal non trouvé.");
                showAlert('danger', "Animal non trouvé.");
            }
        } else {
            console.error("Erreur lors du chargement des informations de l'animal. Code:", response.status);
            showAlert('danger', `Erreur lors du chargement des informations de l'animal. Code: ${response.status}`);
        }
    } catch (error) {
        console.error("Erreur de connexion pour le chargement de l'animal :", error);
        showAlert('danger', "Une erreur est survenue pendant la connexion au serveur.");
    }
}

// Fonction pour incrémenter le view_count uniquement lorsque le modal est affiché une fois
async function incrementViewCount(animalName, modalId) {
    console.log(`Incrémentation de view_count pour: ${animalName}`);
    const authToken = getCookie('accesstoken');
    if (!authToken) {
        showAlert('danger', "Token non trouvé. Veuillez vous reconnecter.");
        return;
    }

    try {
        const response = await fetch(`${apiUrl}animal/${animalName}/view`, {
            method: 'PUT',
            headers: {
                'X-AUTH-TOKEN': authToken
            }
        });

        if (response.ok) {
            const updatedData = await response.json();
            console.log(`view_count mis à jour pour ${animalName}: Nouveau view_count: ${updatedData.view_count}`);

            // Recharge les informations de l'animal pour afficher le nouveau view_count dans le modal
            loadAnimalInfo(animalName, modalId);
        } else {
            console.error("Erreur lors de la mise à jour de view_count :", await response.json());
        }
    } catch (error) {
        console.error("Erreur de connexion pour la mise à jour de view_count :", error);
    }
}

// Charger les informations des animaux au chargement de la page

document.addEventListener('DOMContentLoaded', () => {
    loadAnimalInfo('Leo', 'lionModal');
    loadAnimalInfo('Grace', 'girafeModal');
    loadAnimalInfo('Dumbo', 'elephantModal');
    loadAnimalInfo('Rajah', 'tigreModal');
    loadAnimalInfo('Coco', 'singeModal');
    loadAnimalInfo('Perroquet Ara', 'oiseauxExotiquesModal');
    loadAnimalInfo('Nile', 'crocodileModal');
    loadAnimalInfo('Shelly', 'tortueModal');
});

// Ajouter des événements pour incrémenter le view_count de chaque animal au moment où le modal est affiché

document.getElementById('lionModal').addEventListener('shown.bs.modal', () => {
    incrementViewCount('Leo', 'lionModal');
});

document.getElementById('girafeModal').addEventListener('shown.bs.modal', () => {
    incrementViewCount('Grace', 'girafeModal');
});

document.getElementById('elephantModal').addEventListener('shown.bs.modal', () => {
    incrementViewCount('Dumbo', 'elephantModal');
});

document.getElementById('tigreModal').addEventListener('shown.bs.modal', () => {
    incrementViewCount('Rajah', 'tigreModal');
});

document.getElementById('singeModal').addEventListener('shown.bs.modal', () => {
    incrementViewCount('Coco', 'singeModal');
});

document.getElementById('oiseauxExotiquesModal').addEventListener('shown.bs.modal', () => {
    incrementViewCount('Perroquet Ara', 'oiseauxExotiquesModal');
});

document.getElementById('crocodileModal').addEventListener('shown.bs.modal', () => {
    incrementViewCount('Nile', 'crocodileModal');
});

document.getElementById('tortueModal').addEventListener('shown.bs.modal', () => {
    incrementViewCount('Shelly', 'tortueModal');
});
