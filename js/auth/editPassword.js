// Variables pour les champs de formulaire et le bouton de validation
const inputPassword = document.getElementById("PasswordInput");
const inputValidationPassword = document.getElementById("ValidatePasswordInput");
const btnValidation = document.getElementById("btn-validation-change-password");
const oldPasswordInput = document.getElementById("OldPasswordInput");

console.log("Variables initialisées.");

if (btnValidation) {
    console.log("Le bouton a été trouvé.");
    btnValidation.addEventListener("click", () => {
        console.log("Le bouton Changer le mot de passe a été cliqué.");
        changePassword();
    });
} else {
    console.error("Le bouton Changer le mot de passe est introuvable.");
}

// Fonction pour afficher les messages d'alerte
function showAlert(type, message) {
    const alertElement = type === 'success' ? document.getElementById('successMessage') : document.getElementById('errorMessage');
    alertElement.textContent = message;
    alertElement.classList.remove('d-none');
    alertElement.classList.add('show');

    // Cacher le message après 5 secondes
    setTimeout(() => {
        alertElement.classList.remove('show');
        alertElement.classList.add('d-none');
    }, 5000);
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

// Fonction pour valider la correspondance des mots de passe
function validateConfirmationPassword(inputPwd, inputConfirmPwd) {
    if (inputPwd.value === inputConfirmPwd.value) {
        inputConfirmPwd.classList.add("is-valid");
        inputConfirmPwd.classList.remove("is-invalid");
        return true;
    } else {
        inputConfirmPwd.classList.add("is-invalid");
        inputConfirmPwd.classList.remove("is-valid");
        return false;
    }
}

// Fonction pour valider le mot de passe selon des critères
function validatePassword(input) {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{8,}$/;
    const passwordUser = input.value;
    if (passwordRegex.test(passwordUser)) {
        input.classList.add("is-valid");
        input.classList.remove("is-invalid");
        return true;
    } else {
        input.classList.remove("is-valid");
        input.classList.add("is-invalid");
        return false;
    }
}

// Fonction permettant de valider l'ensemble du formulaire
function validateForm() {
    const passwordOk = validatePassword(inputPassword);
    const passwordConfirmOk = validateConfirmationPassword(inputPassword, inputValidationPassword);

    // Active le bouton si les deux mots de passe sont valides
    btnValidation.disabled = !(passwordOk && passwordConfirmOk);
}

// Écouter les événements de validation lors de la saisie
inputPassword.addEventListener("keyup", validateForm);
inputValidationPassword.addEventListener("keyup", validateForm);

// Fonction pour changer le mot de passe de l'utilisateur
async function changePassword() {
    console.log("Fonction changePassword appelée.");
    const oldPassword = oldPasswordInput.value;
    const newPassword = inputPassword.value;

    // Vérifie si les mots de passe correspondent
    if (newPassword !== inputValidationPassword.value) {
        showAlert('error', "Les mots de passe ne correspondent pas.");
        return;
    }

    // Récupère le token depuis les cookies
    const authToken = getCookie('accesstoken');
    console.log("Token:", authToken);

    if (!authToken) {
        showAlert('error', "Token non trouvé. Veuillez vous reconnecter.");
        return;
    }

    try {
        // Prépare la requête pour changer le mot de passe
        const response = await fetch("https://127.0.0.1:8000/api/account/change-password", {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "X-AUTH-TOKEN": authToken
            },
            body: JSON.stringify({
                oldPassword: oldPassword,
                newPassword: newPassword
            })
        });

        console.log("Statut de la réponse:", response.status);

        if (response.ok) {
            const data = await response.json();
            showAlert('success', data.message); // Affiche le message de succès à l'utilisateur
            setTimeout(() => {
                window.location.href = "/manage-users"; // Redirige vers la page de gestion des utilisateurs après 2 secondes
            }, 2000);
        } else {
            // Affiche un message d'erreur détaillé en cas de réponse non réussie
            const errorData = await response.json();
            console.error("Erreur lors de la mise à jour du mot de passe:", errorData);
            showAlert('error', errorData.message || "Erreur lors de la mise à jour du mot de passe.");
        }
    } catch (error) {
        console.error('Erreur de connexion:', error);
        showAlert('error', "Une erreur est survenue pendant la connexion au serveur. Veuillez réessayer plus tard.");
    }
}
