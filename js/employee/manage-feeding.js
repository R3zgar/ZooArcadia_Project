

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

async function loadVeterinaireRapports() {
    console.log("Chargement des rapports vétérinaires...");
    const authToken = getCookie('accesstoken');
    console.log("authToken:", authToken); 

    if (!authToken) {
        showAlert('danger', "Token non trouvé. Veuillez vous reconnecter.");
        return;
    }

    try {
        const response = await fetch(`${apiUrl}veterinaire_rapport`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-AUTH-TOKEN': authToken
            }
        });

        if (response.ok) {
            const data = await response.json();
            rapportsData = data.data; 
            populateVeterinaireRapportsTable(rapportsData);
            console.log("Rapports vétérinaires chargés avec succès.");
        } else {
            const errorData = await response.json();
            console.error("Erreur lors de la récupération des rapports vétérinaires:", errorData);
            showAlert('danger', errorData.message || "Erreur lors de la récupération des rapports vétérinaires.");
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

    // Charger les rapports vétérinaires lorsque la page est prête
    loadVeterinaireRapports();

    highlightMaladeRows();


}




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
                <button class="btn btn-danger btn-sm" onclick="deleteVeterinaireRapport(${rapport.id}, '${rapport.etat_animal}')" title="Supprimer">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        `;
        veterinaireRapportsTableBody.appendChild(row);
    });
    highlightMaladeRows();
}





// Fonction pour gérer la suppression d'un rapport vétérinaire
async function deleteVeterinaireRapport(rapportId, etatAnimal) {
    console.log("Demande de suppression pour le rapport ID:", rapportId);
    const authToken = getAuthTokenFromCookie();

    if (!authToken) {
        showAlert('danger', "Token non trouvé. Veuillez vous reconnecter.");
        return;
    }

    // Assurez-vous que etatAnimal est défini correctement avant de continuer
    if (!etatAnimal) {
        etatAnimal = "inconnu";
    }

    // Afficher une confirmation avant de supprimer le rapport
    if (!confirm(`Êtes-vous sûr de vouloir supprimer ce rapport vétérinaire pour l'animal en état "${etatAnimal}" ? Cette action est irréversible.`)) {
        showAlert('warning', "La suppression a été annulée pour l'animal en état: " + etatAnimal);
        return;
    }

    try {
        const response = await fetch(`${apiUrl}veterinaire_rapport/${rapportId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'X-AUTH-TOKEN': authToken
            }
        });

        if (response.ok) {
            showAlert('success', `Rapport vétérinaire supprimé avec succès pour l'animal en état: ${etatAnimal}`);
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
        const response = await fetch(`${apiUrl}veterinaire_rapport/${rapportId}`, {
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




// Charger les rapports vétérinaires lorsque la page est prête
loadVeterinaireRapports();


// Fonction pour récupérer le token depuis les cookies
function getAuthTokenFromCookie() {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; accesstoken=`);
    if (parts.length === 2) {
        return parts.pop().split(';').shift();
    }
    return null;
}

// Fonction pour ajouter un nouveau rapport vétérinaire
async function addVeterinaireRapport(event) {
    event.preventDefault();

    const etatAnimal = document.getElementById('etatAnimalInput').value.trim();
    const nourriture = document.getElementById('nourritureInput').value.trim();
    const grammage = document.getElementById('grammageInput').value.trim();
    const datePassage = document.getElementById('datePassageInput').value.trim();
    const animalId = parseInt(document.getElementById('animalIdInput').value.trim());

    // Validation des champs
    if (!etatAnimal || !nourriture || !grammage || !datePassage || isNaN(animalId)) {
        showAlert('danger', "Tous les champs sont obligatoires. Veuillez remplir tous les champs.");
        return;
    }

    // Validation pour l'ID de l'animal (1 à 3)
    if (animalId < 1 || animalId > 3) {
        showAlert('danger', "L'ID de l'animal doit être compris entre 1 et 3.");
        return;
    }

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("X-AUTH-TOKEN", getAuthTokenFromCookie());

    const raw = JSON.stringify({
        "etat_animal": etatAnimal,
        "nourriture": nourriture,
        "grammage": parseInt(grammage),
        "date_passage": datePassage,
        "animal_id": animalId
    });

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
    };

    try {
        const response = await fetch(`${apiUrl}veterinaire_rapport`, requestOptions);
        const result = await response.json();

        if (response.ok) {
            showAlert('success', "Nouveau rapport vétérinaire ajouté avec succès.");
            loadVeterinaireRapports(); // Recharger la liste après l'ajout
            const addModal = bootstrap.Modal.getInstance(document.getElementById('addFeedingModal'));
            addModal.hide();
            document.getElementById('addFeedingForm').reset();
        } else {
            console.error("Erreur lors de l'ajout du rapport:", result);
            showAlert('danger', result.message || "Erreur lors de l'ajout du rapport vétérinaire.");
        }
    } catch (error) {
        console.error('Erreur de connexion:', error);
        showAlert('danger', "Une erreur est survenue pendant la connexion au serveur.");
    }
}


// Écouter l'événement de soumission du formulaire d'ajout
document.getElementById('addFeedingForm').addEventListener('submit', addVeterinaireRapport);




// Fonction pour ouvrir le modal de modification avec les données du rapport
function openEditModal(rapport) {
    const editModal = new bootstrap.Modal(document.getElementById('editFeedingModal'));
    document.getElementById('editEtatAnimalInput').value = rapport.etat_animal;
    document.getElementById('editNourritureInput').value = rapport.nourriture;
    document.getElementById('editGrammageInput').value = rapport.grammage;
    document.getElementById('editDatePassageInput').value = rapport.date_passage;
    document.getElementById('rapportIdInput').value = rapport.id;
    editModal.show();
}

// Écouter l'événement de soumission du formulaire de modification
document.getElementById('editFeedingForm').addEventListener('submit', saveRapportChanges);


// Charger les rapports vétérinaires lorsque la page est prête
document.addEventListener('DOMContentLoaded', loadVeterinaireRapports);
// Charger les rapports vétérinaires lorsque la page est prête
loadVeterinaireRapports();