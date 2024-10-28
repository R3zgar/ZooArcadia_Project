// Variables pour la table des rapports vétérinaires
const veterinaireRapportsTableBody = document.querySelector('#veterinaireRapportsTable');
const alertContainer = document.getElementById('alertContainer');
let rapportsData = [];

console.log("Variables initialisées pour la gestion des rapports vétérinaires.");




// Fonction pour afficher un message d'alerte dans alertContainer en fonction de l'état de l'animal
function showAlert(type, message, etatAnimal = '') {
    const alertElement = document.createElement('div');
    alertElement.className = `alert alert-${type} alert-dismissible fade show`;
    alertElement.role = 'alert';
    alertElement.innerHTML = `
        ${message} ${etatAnimal ? `: ${etatAnimal}` : ''}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    alertContainer.appendChild(alertElement);

    // Supprimer le message après 7 secondes et réinitialiser les couleurs
    setTimeout(() => {
        if (alertContainer.contains(alertElement)) {
            alertContainer.removeChild(alertElement);
            resetRowColors(); // Réinitialiser les couleurs des lignes après la suppression de l'alerte
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

// Fonction pour charger les rapports vétérinaires depuis l'API
async function loadVeterinaireRapports() {
    console.log("Chargement des rapports vétérinaires...");
    const authToken = getCookie('accesstoken');

    if (!authToken) {
        showAlert('danger', "Token non trouvé. Veuillez vous reconnecter.");
        return;
    }

    try {
        const response = await fetch('https://127.0.0.1:8000/api/veterinaire_rapport', {
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
            rapportsData = data.data; // Store the data globally
            populateVeterinaireRapportsTable(rapportsData);
            console.log("Rapports vétérinaires chargés avec succès.");
        } else {
            console.error("Erreur lors de la récupération des rapports vétérinaires:", data);
            showAlert('danger', data.message || "Erreur lors de la récupération des rapports vétérinaires.");
        }
    } catch (error) {
        console.error('Erreur de connexion:', error);
        showAlert('danger', "Une erreur est survenue pendant la connexion au serveur. Veuillez réessayer plus tard.");
    }
}


// Fonction pour vérifier l'état des animaux et afficher un résumé
function checkAnimalHealth() {
    const malades = rapportsData.filter(rapport => rapport.etat_animal.toLowerCase() === 'malade').length;
    const enBonneSante = rapportsData.filter(rapport => rapport.etat_animal.toLowerCase() === 'en bonne santé').length;

    if (malades > 0) {
        showAlert('danger', `Attention, ${malades} animal(s) est/sont malade(s).`);
    } else {
        showAlert('success', `Tous les animaux sont en bonne santé. (${enBonneSante} animal(s))`);
    }
}

// Charger les rapports vétérinaires lorsque la page est prête
loadVeterinaireRapports();



// Fonction pour surligner les lignes des animaux malades
function highlightMaladeRows(rapports) {
    const rows = document.querySelectorAll('#veterinaireRapportsTable tr');
    rows.forEach(row => {
        const etatAnimal = row.querySelector('td:first-child')?.textContent.toLowerCase();
        if (etatAnimal === 'malade') {
            row.classList.add('table-danger');
        }
    });

    // Supprimer le surlignage après 7 secondes (correspondant à la durée de l'alerte)
    setTimeout(() => {
        rows.forEach(row => {
            row.classList.remove('table-danger');
        });
    }, 7000);
}




function populateVeterinaireRapportsTable(rapports) {
    veterinaireRapportsTableBody.innerHTML = '';
    rapports.forEach(rapport => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${rapport.etat_animal}</td>
            <td>${rapport.nourriture}</td>
            <td>${rapport.grammage} g</td>
            <td>${rapport.date_passage}</td>
            <td>${rapport.updatedAt}</td>
            <td class="action-buttons">
                <button class="btn btn-warning btn-sm" title="Modifier" onclick='openEditModal(${JSON.stringify(rapport)})'>
                    <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-danger btn-sm" onclick="deleteVeterinaireRapport(${rapport.id})" title="Supprimer">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        `;
        veterinaireRapportsTableBody.appendChild(row);
    });
}







// Fonction pour gérer la suppression d'un rapport vétérinaire
async function deleteVeterinaireRapport(rapportId, etatAnimal) {
    console.log("Demande de suppression pour le rapport ID:", rapportId);
    const authToken = getCookie('accesstoken');

    if (!authToken) {
        showAlert('danger', "Token non trouvé. Veuillez vous reconnecter.");
        return;
    }

    // Afficher une confirmation avant de supprimer le rapport
    if (!confirm(`Êtes-vous sûr de vouloir supprimer ce rapport vétérinaire pour l'animal en état "${etatAnimal}" ? Cette action est irréversible.`)) {
        showAlert('warning', "La suppression a été annulée pour l'animal en état: " + etatAnimal);
        return;
    }

    try {
        const response = await fetch(`https://127.0.0.1:8000/api/veterinaire_rapport/${rapportId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'X-AUTH-TOKEN': authToken
            }
        });

        if (response.ok) {
            showAlert('success', "Rapport vétérinaire supprimé avec succès pour l'animal en état: " + etatAnimal);
            loadVeterinaireRapports(); // Recharger la liste des rapports après suppression
        } else {
            const errorData = await response.json();
            console.error("Erreur lors de la suppression du rapport vétérinaire:", errorData);
            showAlert('danger', errorData.message || "Erreur lors de la suppression du rapport vétérinaire.");
        }
    } catch (error) {
        console.error('Erreur de connexion:', error);
        showAlert('danger', "Une erreur est survenue pendant la connexion au serveur. Veuillez réessayer plus tard.");
    }
}







// Fonction pour ouvrir le modal pour la modification d'un rapport
function openEditModal(rapport) {
    const editModal = new bootstrap.Modal(document.getElementById('editFeedingModal'));
    if (!editModal) {
        console.error("Modal couldn't be found.");
        return;
    }
    // Préremplir les champs du formulaire avec les données du rapport
    document.getElementById('editEtatAnimalInput').value = rapport.etat_animal;
    document.getElementById('editNourritureInput').value = rapport.nourriture;
    document.getElementById('editGrammageInput').value = rapport.grammage;
    document.getElementById('editDatePassageInput').value = rapport.date_passage;
    document.getElementById('rapportIdInput').value = rapport.id;

    // Afficher le modal de modification
    editModal.show();
    console.log('Modal ouvert pour le rapport:', rapport);
}

// Fonction pour sauvegarder les modifications du rapport
async function saveRapportChanges(event) {
    event.preventDefault();

    const rapportId = document.getElementById('rapportIdInput').value;
    const etatAnimal = document.getElementById('editEtatAnimalInput').value;
    const nourriture = document.getElementById('editNourritureInput').value;
    const grammage = document.getElementById('editGrammageInput').value;
    const datePassage = document.getElementById('editDatePassageInput').value;

    const authToken = getCookie('accesstoken');

    if (!authToken) {
        showAlert('danger', "Token non trouvé. Veuillez vous reconnecter.");
        return;
    }

    try {
        const response = await fetch(`https://127.0.0.1:8000/api/veterinaire_rapport/${rapportId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-AUTH-TOKEN': authToken
            },
            body: JSON.stringify({
                etat_animal: etatAnimal,
                nourriture: nourriture,
                grammage: grammage,
                date_passage: datePassage
            })
        });

        if (response.ok) {
            const result = await response.json();
            showAlert('success', result.message || "Rapport vétérinaire mis à jour avec succès.", etatAnimal);
            loadVeterinaireRapports(); // Recharger la liste des rapports après la mise à jour
            const editModal = bootstrap.Modal.getInstance(document.getElementById('editFeedingModal'));
            editModal.hide();
        } else {
            const errorData = await response.json();
            console.error("Erreur lors de la modification du rapport:", errorData);
            showAlert('danger', errorData.message || "Erreur lors de la modification du rapport vétérinaire.");
        }
    } catch (error) {
        console.error('Erreur de connexion:', error);
        showAlert('danger', "Une erreur est survenue pendant la connexion au serveur. Veuillez réessayer plus tard.");
    }
}

// Écouter l'événement de soumission du formulaire de modification
document.getElementById('editFeedingForm').addEventListener('submit', saveRapportChanges);


// Charger les rapports vétérinaires lorsque la page est prête
loadVeterinaireRapports();


