

console.log("commentaire.js est chargé.");

// Récupération des éléments du formulaire
const inputAuteur = document.getElementById("pseudonym");
const inputContenu = document.getElementById("reviewText");
const inputAnimalId = document.getElementById("animal_id");
const btnValidation = document.getElementById("btn-soumettre");
const formSoumettre = document.getElementById("submitReviewForm");
const alertContainer = document.getElementById("alertContainer");

// Ajout des écouteurs d'événements
inputAuteur.addEventListener("keyup", validateForm);
inputContenu.addEventListener("keyup", validateForm);
inputAnimalId.addEventListener("keyup", validateForm);

btnValidation.addEventListener("click", soumettreAvis);

function validateForm() {
    const auteurOk = validateRequired(inputAuteur);
    const contenuOk = validateRequired(inputContenu);
    const animalIdOk = validateAnimalId(inputAnimalId);

    // Activer ou désactiver le bouton de validation en fonction des validations
    btnValidation.disabled = !(auteurOk && contenuOk && animalIdOk);
}

function validateRequired(input) {
    if (input.value.trim() !== "") {
        input.classList.add("is-valid");
        input.classList.remove("is-invalid");
        return true;
    } else {
        input.classList.add("is-invalid");
        input.classList.remove("is-valid");
        return false;
    }
}

function validateAnimalId(input) {
    const id = parseInt(input.value.trim());
    if (!isNaN(id) && id >= 1 && id <= 3) {
        input.classList.add("is-valid");
        input.classList.remove("is-invalid");
        return true;
    } else {
        input.classList.add("is-invalid");
        input.classList.remove("is-valid");
        return false;
    }
}

// Vérifier si le formulaire de soumission est présent sur la page avant d'exécuter le code
document.addEventListener('DOMContentLoaded', () => {
    const formSoumettre = document.getElementById('submitReviewForm');
    
    // Vérifier si le formulaire existe pour éviter les erreurs
    if (formSoumettre) {
        console.log("Formulaire de soumission de commentaire trouvé, activation du script.");

        // Ajouter un écouteur d'événements pour la soumission du formulaire
        formSoumettre.addEventListener('click', soumettreAvis);
    } else {
        console.log("Formulaire de soumission de commentaire introuvable.");
    }
});

// Fonction pour soumettre un avis
async function soumettreAvis(event) {
    event.preventDefault();
    console.log("Démarrage de la soumission de l'avis...");

    // Récupération des données du formulaire
    const auteur = document.getElementById('pseudonym').value.trim();
    const contenu = document.getElementById('reviewText').value.trim();
    const animalId = parseInt(document.getElementById('animal_id').value.trim());

    // Validation des champs
    if (!auteur || !contenu || isNaN(animalId)) {
        showAlert('danger', "Tous les champs sont obligatoires. Veuillez remplir tous les champs.");
        return;
    }

    console.log("Données valides, envoi de la requête...");

    // Préparer les en-têtes de la requête
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    // Préparer les données à envoyer
    const raw = JSON.stringify({
        "animal_id": animalId,
        "auteur": auteur,
        "contenu": contenu,
        "date": new Date().toISOString().split('T')[0] // Envoie la date du jour au format YYYY-MM-DD
    });

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
    };

    try {
        // Envoyer la requête à l'API
        console.log("Envoi de la requête à l'API...");
        const response = await fetch(`${apiUrl}commentaire`, requestOptions);
        const result = await response.json();

        if (response.ok) {
            console.log("Réponse de l'API reçue", result);
            showAlert('success', "Merci pour votre avis, il a été soumis pour validation.");

            // Fermer la page de commentaire après l'envoi
            setTimeout(() => {
                window.location.href = "/#avis"; // Rediriger vers la section 'avis' de la page d'accueil
            }, 2000);

        } else {
            console.error("Erreur lors de la soumission de l'avis :", result);
            showAlert('danger', result.message || "Erreur lors de la soumission de l'avis.");
        }
    } catch (error) {
        console.error('Erreur de connexion:', error);
        showAlert('danger', "Une erreur est survenue pendant la connexion au serveur.");
    }
}


function showLoading() {
    btnValidation.textContent = "Enregistrement en cours...";
    btnValidation.disabled = true;
}

function hideLoading() {
    btnValidation.textContent = "Soumettre l'avis";
    btnValidation.disabled = false;
}

function showAlert(type, message) {
    const alertDiv = document.createElement("div");
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    alertDiv.role = "alert";
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    alertContainer.appendChild(alertDiv);

    setTimeout(() => {
        alertDiv.classList.remove('show');
        alertDiv.classList.add('fade');
        setTimeout(() => {
            alertDiv.remove();
        }, 150);
    }, 5000);
}
