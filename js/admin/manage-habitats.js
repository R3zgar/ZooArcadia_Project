// Variables pour le corps de la table des habitats
const habitatTableBody = document.querySelector('#manage-habitats tbody');
const alertContainer = document.getElementById('alertContainer');

console.log("Variables initialisées pour la gestion des habitats.");

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

// Fonction pour charger les habitats depuis l'API
async function loadHabitats() {
    console.log("Chargement des habitats...");
    const authToken = getCookie('accesstoken');

    if (!authToken) {
        showAlert('danger', "Token non trouvé. Veuillez vous reconnecter.");
        return;
    }

    try {
        const response = await fetch('https://127.0.0.1:8000/api/habitat', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-AUTH-TOKEN': authToken
            }
        });

        if (response.ok) {
            const habitats = await response.json();
            populateHabitatTable(habitats.data);
            console.log("Habitats chargés avec succès.");
        } else {
            const errorData = await response.json();
            console.error("Erreur lors de la récupération des habitats:", errorData);
            showAlert('danger', errorData.message || "Erreur lors de la récupération des habitats.");
        }
    } catch (error) {
        console.error('Erreur de connexion:', error);
        showAlert('danger', "Une erreur est survenue pendant la connexion au serveur. Veuillez réessayer plus tard.");
    }
}

// Fonction pour remplir la table des habitats
function populateHabitatTable(habitats) {
    habitatTableBody.innerHTML = ''; // Vide le corps de la table avant de remplir
    habitats.forEach(habitat => {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${habitat.nom_habitat}</td>
            <td>${habitat.description_habitat}</td>
            <td><img src="/images/${habitat.image}" alt="${habitat.nom_habitat}" style="width: 70px; height: 50px;"></td>
            <td>
                <button class="btn btn-warning btn-sm me-2 edit-habitat-btn">
                    <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-danger btn-sm delete-habitat-btn">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        `;

        // Ajout de l'événement pour le bouton de suppression
        row.querySelector('.delete-habitat-btn').addEventListener('click', (event) => {
            event.stopPropagation();
            showDeleteConfirmation(habitat);
        });

        // Ajout de l'événement pour le bouton de modification (optionnel)
        row.querySelector('.edit-habitat-btn').addEventListener('click', (event) => {
            event.stopPropagation();
            showAlert('info', `Modification de l'habitat avec ID ${habitat.id}. (Fonctionnalité à implémenter)`);
        });

        habitatTableBody.appendChild(row);
    });
}





// Fonction pour ajouter un nouvel habitat
document.getElementById('habitatForm').addEventListener('submit', async (e) => {
  e.preventDefault(); // Empêche le rechargement de la page

  // Récupère les valeurs des champs de formulaire
  const name = document.getElementById('habitatName').value.trim();
  const description = document.getElementById('habitatDescription').value.trim();
  const image = document.getElementById('habitatImage').value.trim();

  const authToken = getCookie('accesstoken');

  if (!authToken) {
      showAlert('danger', "Token non trouvé. Veuillez vous reconnecter.");
      return;
  }

  try {
      const response = await fetch('https://127.0.0.1:8000/api/habitat', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'X-AUTH-TOKEN': authToken
          },
          body: JSON.stringify({
              nom_habitat: name,
              description_habitat: description,
              image: image
          })
      });

      const data = await response.json();

      if (response.ok) {
          showAlert('success', "Habitat ajouté avec succès !");
          loadHabitats(); // Recharge la liste des habitats
          const addModal = bootstrap.Modal.getInstance(document.getElementById('addHabitatModal'));
          addModal.hide();
          document.getElementById('habitatForm').reset(); // Réinitialise le formulaire
      } else {
          console.error("Erreur lors de l'ajout de l'habitat :", data);
          showAlert('danger', data.message || "Erreur lors de l'ajout de l'habitat.");
      }
  } catch (error) {
      console.error("Erreur de connexion :", error);
      showAlert('danger', "Une erreur est survenue pendant la connexion au serveur.");
  }
});

// Charge les habitats au chargement de la page
document.addEventListener('DOMContentLoaded', loadHabitats);




// Fonction pour afficher une boîte de dialogue de confirmation personnalisée
function showDeleteConfirmation(habitat) {
    const confirmationMessage = `Voulez-vous vraiment supprimer l'habitat : ${habitat.nom_habitat} ?`;
    if (confirm(confirmationMessage)) {
        deleteHabitat(habitat.id, habitat.nom_habitat);
    } else {
        showAlert('warning', `La suppression de l'habitat ${habitat.nom_habitat} a été annulée.`);
    }
}

// Fonction pour gérer la suppression de l'habitat
async function deleteHabitat(habitatId, habitatName) {
    console.log("Suppression de l'habitat avec l'ID:", habitatId);
    const authToken = getCookie('accesstoken');

    if (!authToken) {
        showAlert('danger', "Token non trouvé. Veuillez vous reconnecter.");
        return;
    }

    try {
        const response = await fetch(`https://127.0.0.1:8000/api/habitat/${habitatId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'X-AUTH-TOKEN': authToken
            }
        });

        if (response.ok) {
            showAlert('success', `L'habitat ${habitatName} a été supprimé avec succès.`);
            loadHabitats(); // Recharge la liste des habitats sans rafraîchir la page
        } else {
            const errorData = await response.json();
            console.error("Erreur lors de la suppression de l'habitat:", errorData);
            showAlert('danger', errorData.message || "Erreur lors de la suppression de l'habitat.");
        }
    } catch (error) {
        console.error('Erreur de connexion:', error);
        showAlert('danger', "Une erreur est survenue pendant la connexion au serveur. Veuillez réessayer plus tard.");
    }
}

// Charger les habitats lorsque la page est prête
loadHabitats();
