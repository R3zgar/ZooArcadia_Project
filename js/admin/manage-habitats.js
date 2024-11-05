const apiUrl = "https://master-7rqtwti-unhphrs4kyslw.fr-3.platformsh.site/api/";

// Variables pour le corps de la table des habitats
const habitatTableBody = document.querySelector('#habitatTableBody');
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
        console.log("Envoi de la requête API pour récupérer les habitats...");
        const response = await fetch(`${apiUrl}habitat`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-AUTH-TOKEN': authToken
            }
        });

        console.log("Réponse de l'API reçue.");
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

// Fonction pour remplir la table des habitats avec un lien vers habitats.html
function populateHabitatTable(habitats) {
    habitatTableBody.innerHTML = ''; // Vider le contenu de la table avant de la remplir
    
    habitats.forEach(habitat => {
        const row = document.createElement('tr');

        // Créer un lien pour chaque nom d'habitat qui renvoie à l'ID correspondant dans habitats.html
        row.innerHTML = `
           <td><a href="habitats#${habitat.nom_habitat.toLowerCase()}" class="text-decoration-none text-dark">${habitat.nom_habitat}</a></td>

            <td>${habitat.description_habitat}</td>
            <td><img src="/images/${habitat.image}" alt="${habitat.nom_habitat}" style="width: 70px; height: 50px;"></td>
            <td class="action-buttons d-flex flex-column flex-md-row justify-content-center align-items-center gap-2">
                <button class="btn btn-warning btn-sm edit-habitat-btn">
                    <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-danger btn-sm delete-habitat-btn">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        `;

        // Ajout des événements pour les boutons de modification et de suppression
        row.querySelector('.edit-habitat-btn').addEventListener('click', (event) => {
            event.stopPropagation();
            editHabitat(habitat); // Envoyer les données de l'habitat à modifier
        });

        row.querySelector('.delete-habitat-btn').addEventListener('click', (event) => {
            event.stopPropagation();
            showDeleteConfirmation(habitat);
        });

        habitatTableBody.appendChild(row);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    loadHabitats();

    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.id = 'searchInput';
    searchInput.className = 'form-control mb-3';
    searchInput.placeholder = "Rechercher par nom d'habitat...";
    searchInput.addEventListener('keyup', filterHabitats);

    const mainContainer = document.querySelector('.container');
    mainContainer.insertBefore(searchInput, mainContainer.querySelector('.table-responsive'));
});



// Fonction pour ouvrir le modal de modification avec les données de l'habitat
function editHabitat(habitat) {
    document.getElementById('editHabitatId').value = habitat.id;
    document.getElementById('editHabitatName').value = habitat.nom_habitat;
    document.getElementById('editHabitatDescription').value = habitat.description_habitat;
    document.getElementById('editHabitatImage').value = habitat.image;

    const editHabitatModal = new bootstrap.Modal(document.getElementById('editHabitatModal'));
    editHabitatModal.show();
}

// Fonction pour sauvegarder les modifications de l'habitat
async function saveHabitatChanges() {
    const id = document.getElementById('editHabitatId').value;
    const name = document.getElementById('editHabitatName').value.trim();
    const description = document.getElementById('editHabitatDescription').value.trim();
    const image = document.getElementById('editHabitatImage').value.trim();

    const authToken = getCookie('accesstoken');
    if (!authToken) {
        showAlert('danger', "Token non trouvé. Veuillez vous reconnecter.");
        return;
    }

    try {
        const response = await fetch(`${apiUrl}habitat/${id}`, {
            method: 'PUT',
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

        if (response.ok) {
            showAlert('success', "Les modifications ont été enregistrées avec succès.");
            loadHabitats();  // Rafraîchit la liste des habitats
            const editHabitatModal = bootstrap.Modal.getInstance(document.getElementById('editHabitatModal'));
            editHabitatModal.hide();
        } else {
            const errorData = await response.json();
            console.error("Erreur lors de la modification de l'habitat:", errorData);
            showAlert('danger', errorData.message || "Erreur lors de la modification de l'habitat.");
        }
    } catch (error) {
        console.error("Erreur de connexion:", error);
        showAlert('danger', "Une erreur est survenue pendant la connexion au serveur.");
    }
}

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
        const response = await fetch(`${apiUrl}habitat/${habitatId}`, {
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





function displayAnimals(animals) {
    console.log("Les donnes:", animals);
    const habitatSections = document.getElementById("habitat-sections");

    // Initialisation des sections d'habitat
    const habitats = {
        "Savane": [],
        "Jungle": [],
        "Marais": []
    };

    // Grouper les animaux par habitat
    animals.forEach(animal => {
        habitats[animal.habitat.nom_habitat].push(animal);
    });

    // Créer des sections pour chaque habitat et y ajouter les animaux
    for (const [habitatName, habitatAnimals] of Object.entries(habitats)) {
        const habitatSection = document.createElement("div");
        habitatSection.classList.add("habitat-section", "mb-5");


        const habitatTitle = document.createElement("h2");
        habitatTitle.classList.add("text-secondary", "mb-4");
        habitatTitle.textContent = `Les Animaux de la ${habitatName}`;

        habitatSection.appendChild(habitatTitle);

        const animalRow = document.createElement("div");
        animalRow.classList.add("row");

        // Créer une carte pour chaque animal et l'ajouter à la section de l'habitat
        habitatAnimals.forEach(animal => {
            const animalCard = document.createElement("div");
            animalCard.classList.add("col-md-4", "mb-4");

            animalCard.innerHTML = `
                <div class="card shadow-sm">
                    <img src="/images/${animal.image}" class="card-img-top" alt="${animal.prenom_animal}">
                    <div class="card-body text-center">
                        <h5 class="card-title">${animal.prenom_animal}</h5>
                        <p class="card-text">${animal.race_animal}</p>
                        <p class="text-muted">Santé: ${animal.etat_animal}</p>
                        <p class="text-primary">Vues: ${animal.view_count}</p> <!-- view_count burada görüntülenir -->
                    </div>
                </div>
            `;

            // Ajouter l'événement de clic pour augmenter le view_count
            animalCard.addEventListener('click', () => {
                updateViewCount(animal.id);
            });

            animalRow.appendChild(animalCard);
        });

        habitatSection.appendChild(animalRow);
        habitatSections.appendChild(habitatSection);
    }
}



// Fonction pour mettre à jour le view_count d'un animal
async function updateViewCount(animalId) {
    const authToken = getCookie('accesstoken');
    if (!authToken) {
        showAlert('danger', "Token non trouvé. Veuillez vous reconnecter.");
        return;
    }

    try {
        const response = await fetch(`${apiUrl}animal/${animalId}/view`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-AUTH-TOKEN': authToken
            }
        });

        if (response.ok) {
            console.log(`view_count mis à jour pour l'animal avec l'ID ${animalId}.`);
            loadHabitats();
        } else {
            console.error("Erreur lors de la mise à jour de view_count:", await response.json());
        }
    } catch (error) {
        console.error("Erreur de connexion pour la mise à jour de view_count:", error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadHabitats();
});


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
      const response = await fetch(`${apiUrl}habitat`, {
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


// Fonction pour filtrer les habitats par nom
function filterHabitats() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const rows = document.querySelectorAll('#habitatTableBody tr');

    rows.forEach(row => {
        const habitatName = row.querySelector('td').innerText.toLowerCase();
        if (habitatName.includes(searchInput)) {
            row.style.display = ''; // Affiche la ligne si elle correspond
        } else {
            row.style.display = 'none'; // Masque la ligne si elle ne correspond pas
        }
    });
}



