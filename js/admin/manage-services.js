
const apiUrl = "https://master-7rqtwti-unhphrs4kyslw.fr-3.platformsh.site/api/";

// Variables pour la table des commentaires
const commentsTableBody = document.querySelector('#commentsTableBody');
const alertContainer = document.getElementById('alertContainer');

// Variables pour la table des services
const servicesTableBody = document.querySelector('#servicesTableBody');

console.log("Variables initialisées pour la gestion des services.");
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
        const response = await fetch(`${apiUrl}commentaire`, {
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
        const response = await fetch(`${apiUrl}commentaire/${commentId}/approve`, {
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
    const authToken = getCookie('accesstoken');

    if (!authToken) {
        showAlert('danger', "Token non trouvé. Veuillez vous reconnecter.");
        return;
    }

    // Afficher une confirmation avant de supprimer le commentaire
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce commentaire ? Cette action est irréversible.")) {
        return;
    }

    try {
        const response = await fetch(`${apiUrl}commentaire/${commentId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'X-AUTH-TOKEN': authToken
            }
        });

        if (response.ok) {
            showAlert('success', "Commentaire supprimé avec succès.");
            loadComments(); // Rafraîchir la liste des commentaires après suppression
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
        <td class="text-center align-middle">${comment.auteur}</td>
        <td class="text-center align-middle">${comment.contenu}</td>
        <td class="text-center align-middle">${comment.created_at}</td>
        <td class="text-center align-middle">${status}</td>
        <td class="text-center align-middle">
            <div class="d-flex flex-column flex-md-row justify-content-center align-items-center gap-1">
                <button class="btn btn-success btn-sm mb-1 mb-md-0" onclick="approveComment(${comment.id})" title="Approuver" ${isApproved ? 'disabled' : ''} style="padding: 0.1rem 0.3rem; font-size: 0.7rem; align-self: center;">
                    <i class="bi bi-check-circle"></i>
                </button>
                <button class="btn btn-danger btn-sm mb-1 mb-md-0" onclick="deleteComment(${comment.id})" title="Supprimer" style="padding: 0.1rem 0.3rem; font-size: 0.7rem; align-self: center;">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
        </td>
    `;
    
    
    
    

        commentsTableBody.appendChild(row);
    });
}



// Charger les commentaires lorsque la page est prête
loadComments();


/// Fonction pour remplir la table des services
function populateServiceTable(services) {
    const servicesTableBody = document.querySelector('#servicesTableBody');
    servicesTableBody.innerHTML = '';

    services.forEach(service => {
        const row = document.createElement('tr');
        row.classList.add('hover-row');


            row.innerHTML = `
                <td class="text-center align-middle">${service.nom_service}</td>
                <td class="text-center align-middle">${service.description_service}</td>
                <td class="text-center align-middle">
                    <div class="action-buttons d-flex flex-column flex-md-row justify-content-center align-items-center gap-1">
                        <button class="btn btn-warning btn-sm mb-1 mb-md-0" onclick="editService(${service.id})" title="Modifier" style="padding: 0.1rem 0.3rem; font-size: 0.7rem;">
                            <i class="bi bi-pencil"></i>
                        </button>
                        <button class="btn btn-danger btn-sm mb-1 mb-md-0" onclick="deleteService(${service.id}, '${service.nom_service}')" title="Supprimer" style="padding: 0.1rem 0.3rem; font-size: 0.7rem;">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </td>
            `;

    
    

        servicesTableBody.appendChild(row);
    });
}




async function loadServices() {
    console.log("Chargement des services...");
    const authToken = getCookie('accesstoken');

    if (!authToken) {
        showAlert('danger', "Token non trouvé. Veuillez vous reconnecter.");
        return;
    }

    try {
        const response = await fetch(`${apiUrl}service`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-AUTH-TOKEN': authToken
            }
        });

        console.log('Statut de la réponse:', response.status);
        const data = await response.json();
        console.log('Données reçues:', data); // Gelen verileri kontrol etmek için

        if (response.ok) {
            populateServiceTable(data.data);
            console.log("Services chargés avec succès.");
        } else {
            console.error("Erreur lors de la récupération des services:", data);
            showAlert('danger', data.message || "Erreur lors de la récupération des services.");
        }
    } catch (error) {
        console.error('Erreur de connexion:', error);
        showAlert('danger', "Une erreur est survenue pendant la connexion au serveur. Veuillez réessayer plus tard.");
    }
}

// Fonction pour gérer la modification d'un service
function editService(serviceId) {
    console.log(`Modification du service avec l'ID: ${serviceId}`);
    const authToken = getCookie('accesstoken');

    // Vérifier si le token est disponible
    if (!authToken) {
        showAlert('danger', "Token non trouvé. Veuillez vous reconnecter.");
        return;
    }

    // Récupérer les données du service pour pré-remplir le formulaire de modification
    fetch(`${apiUrl}service/${serviceId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'X-AUTH-TOKEN': authToken
        }
    })
    .then(response => {
        console.log('Statut de la réponse:', response.status); // Yanıt durumu kontrolü
        return response.json();
    })
    .then(data => {
        console.log('Données reçues pour la modification:', data); // API'den alınan veriler
        
        // Vérifier si les données sont présentes
        if (data?.data?.nom_service && data?.data?.description_service) {
            const service = data.data;

            // Pré-remplir les champs du formulaire avec les données du service
            document.getElementById('serviceIdInput').value = service.id || '';
            document.getElementById('nomServiceInput').value = service.nom_service || '';
            document.getElementById('descriptionServiceInput').value = service.description_service || '';

            // Ouvrir le modal de modification
            const addServiceModal = new bootstrap.Modal(document.getElementById('addServiceModal'));
            addServiceModal.show();
        } else {
            showAlert('danger', "Erreur lors de la récupération des données du service.");
        }
    })
    .catch(error => {
        console.error("Erreur lors de la récupération du service:", error);
        showAlert('danger', "Une erreur est survenue pendant la connexion au serveur. Veuillez réessayer plus tard.");
    });
}



// Fonction pour mettre à jour un service existant
async function updateService(serviceId, nomService, descriptionService) {
    console.log("Mise à jour du service ID:", serviceId);

    const authToken = getCookie('accesstoken');
    if (!authToken) {
        showAlert('danger', "Token non trouvé. Veuillez vous reconnecter.");
        return;
    }

    try {
        const response = await fetch(`${apiUrl}service/${serviceId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-AUTH-TOKEN': authToken
            },
            body: JSON.stringify({
                nom_service: nomService,
                description_service: descriptionService
            })
        });

        if (response.ok) {
            const result = await response.json();
            showAlert('success', result.message || 'Service mis à jour avec succès.');
        } else {
            const errorData = await response.json();
            console.error("Erreur lors de la mise à jour du service:", errorData);
            showAlert('danger', errorData.message || "Erreur lors de la mise à jour du service.");
        }
    } catch (error) {
        console.error('Erreur de connexion:', error);
        showAlert('danger', "Une erreur est survenue pendant la connexion au serveur. Veuillez réessayer plus tard.");
    }
}


// Fonction pour ouvrir le modal pour ajouter un nouveau service
function openAddServiceModal() {
    console.log("Ouverture du modal pour ajouter un nouveau service.");
    
    // Réinitialiser les champs du formulaire avant d'ouvrir le modal
    document.getElementById('serviceIdInput').value = ''; // ID alanını temizle
    document.getElementById('nomServiceInput').value = ''; // Nom alanını temizle
    document.getElementById('descriptionServiceInput').value = ''; // Description alanını temizle

    // Ouvrir le modal
    const addServiceModal = new bootstrap.Modal(document.getElementById('addServiceModal'));
    addServiceModal.show();
}

// Écouter l'événement de clic sur le bouton "Ajouter un service"
document.getElementById('addServiceModalLabel').addEventListener('click', openAddServiceModal);


// Fonction pour ajouter un nouveau service
async function addService(nomService, descriptionService) {
    console.log("Ajout d'un nouveau service:", nomService);

    const authToken = getCookie('accesstoken');
    if (!authToken) {
        showAlert('danger', "Token non trouvé. Veuillez vous reconnecter.");
        return;
    }

    try {
        const response = await fetch(`${apiUrl}service`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-AUTH-TOKEN': authToken
            },
            body: JSON.stringify({
                nom_service: nomService,
                description_service: descriptionService
            })
        });

        if (response.ok) {
            const result = await response.json();
            showAlert('success', result.message || 'Nouveau service créé avec succès.');
        } else {
            const errorData = await response.json();
            console.error("Erreur lors de l'ajout du service:", errorData);
            showAlert('danger', errorData.message || "Erreur lors de l'ajout du service.");
        }
    } catch (error) {
        console.error('Erreur de connexion:', error);
        showAlert('danger', "Une erreur est survenue pendant la connexion au serveur. Veuillez réessayer plus tard.");
    }
}




// Fonction pour gérer la sauvegarde des modifications de service
async function saveServiceChanges(event) {
    event.preventDefault();
    
    const serviceId = document.getElementById('serviceIdInput').value;
    const nomService = document.getElementById('nomServiceInput').value;
    const descriptionService = document.getElementById('descriptionServiceInput').value;

    const authToken = getCookie('accesstoken');

    if (!authToken) {
        showAlert('danger', "Token non trouvé. Veuillez vous reconnecter.");
        return;
    }

    try {
        const response = await fetch(`${apiUrl}service/${serviceId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-AUTH-TOKEN': authToken
            },
            body: JSON.stringify({
                nom_service: nomService,
                description_service: descriptionService
            })
        });

        if (response.ok) {
            const result = await response.json();
            showAlert('success', result.message);
            loadServices(); // Recharger les services pour afficher les mises à jour
            const addServiceModal = bootstrap.Modal.getInstance(document.getElementById('addServiceModal'));
            addServiceModal.hide();
        } else {
            const errorData = await response.json();
            console.error("Erreur lors de la modification du service:", errorData);
            showAlert('danger', errorData.message || "Erreur lors de la modification du service.");
        }
    } catch (error) {
        console.error('Erreur de connexion:', error);
        showAlert('danger', "Une erreur est survenue pendant la connexion au serveur. Veuillez réessayer plus tard.");
    }
}



// Écouter l'événement de soumission du formulaire de service
document.getElementById('serviceForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const serviceId = document.getElementById('serviceIdInput').value; // Récupérer l'ID du service à partir du champ caché
    const nomService = document.getElementById('nomServiceInput').value;
    const descriptionService = document.getElementById('descriptionServiceInput').value;

    console.log('Service ID:', serviceId);
    console.log('Nom du Service:', nomService);
    console.log('Description du Service:', descriptionService);

    if (serviceId) {
        // Mettre à jour un service existant
        await updateService(serviceId, nomService, descriptionService);
    } else {
        // Ajouter un nouveau service
        await addService(nomService, descriptionService);
    }

    // Réinitialiser le formulaire et masquer le modal après soumission
    this.reset();
    const editModal = bootstrap.Modal.getInstance(document.getElementById('addServiceModal'));
    editModal.hide();

    // Recharger la liste des services pour afficher les changements
    loadServices();
});






// Fonction pour gérer la suppression d'un service
async function deleteService(serviceId, nomService) {
    console.log(`Demande de suppression du service: ${nomService} avec l'ID: ${serviceId}`);
    const authToken = getCookie('accesstoken');

    if (!authToken) {
        showAlert('danger', "Token non trouvé. Veuillez vous reconnecter.");
        return;
    }

    // Afficher un message de confirmation avant de procéder à la suppression
    if (!confirm(`Êtes-vous sûr de vouloir supprimer le service : ${nomService} ? Cette action est irréversible.`)) {
        showAlert('warning', "La suppression a été annulée.");
        return;
    }

    try {
        const response = await fetch(`${apiUrl}service/${serviceId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'X-AUTH-TOKEN': authToken
            }
        });

        if (response.ok) {
            showAlert('success', `Service "${nomService}" supprimé avec succès.`);
            loadServices(); // Recharger la liste des services pour mettre à jour l'affichage
        } else {
            const errorData = await response.json();
            console.error("Erreur lors de la suppression du service:", errorData);
            showAlert('danger', errorData.message || "Erreur lors de la suppression du service.");
        }
    } catch (error) {
        console.error('Erreur de connexion:', error);
        showAlert('danger', "Une erreur est survenue pendant la connexion au serveur. Veuillez réessayer plus tard.");
    }
}



// Charger les services lorsque la page est prête
loadServices();