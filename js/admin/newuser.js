const inputNom = document.getElementById("NomInput");
const inputPreNom = document.getElementById("PrenomInput");
const inputMail = document.getElementById("EmailInput");
const inputPassword = document.getElementById("PasswordInput");
const inputValidationPassword = document.getElementById("ValidatePasswordInput");
const inputRole = document.getElementById("RoleSelect");
const btnValidation = document.getElementById("btn-validation-inscription");
const formInscription = document.getElementById("formulaireInscription");

inputNom.addEventListener("keyup", validateForm); 
inputPreNom.addEventListener("keyup", validateForm);
inputMail.addEventListener("keyup", validateForm);
inputPassword.addEventListener("keyup", validateForm);
inputValidationPassword.addEventListener("keyup", validateForm);
inputRole.addEventListener("change", validateForm);

btnValidation.addEventListener("click", inscrireUtilisateur);

// Gönderim öncesinde kullanıcıya bilgi vermek için bir "Yükleniyor" mesajı veya spinner gösterebiliriz.
function showLoading() {
    btnValidation.textContent = "Enregistrement en cours...";
    btnValidation.disabled = true;
}

// Gönderim sonrasında düğme metnini eski haline döndürüyoruz.
function hideLoading() {
    btnValidation.textContent = "Inscription";
    btnValidation.disabled = false;
}

function validateForm() {
    const nomOk = validateRequired(inputNom);
    const prenomOk = validateRequired(inputPreNom);
    const mailOk = validateMail(inputMail);
    const passwordOk = validatePassword(inputPassword);
    const passwordConfirmOk = validateConfirmationPassword(inputPassword, inputValidationPassword);
    const roleOk = inputRole.value !== "";

    btnValidation.disabled = !(nomOk && prenomOk && mailOk && passwordOk && passwordConfirmOk && roleOk);
}

function inscrireUtilisateur(event) {
    event.preventDefault();

    // Yükleniyor mesajını göster
    showLoading();

    // Vérifier si les mots de passe ne correspondent pas
    if (inputPassword.value !== inputValidationPassword.value) {
        alert("Les mots de passe ne correspondent pas. Veuillez vérifier.");
        hideLoading();
        return;
    }

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    // Préparer les données à envoyer
    const raw = JSON.stringify({
        "firstName": inputNom.value,
        "lastName": inputPreNom.value,
        "email": inputMail.value,
        "password": inputPassword.value,
        "roles": [inputRole.value] // Ajoute le rôle sélectionné
    });

    // Options de la requête fetch
    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
    };

    // Envoyer les données avec fetch
    fetch("https://127.0.0.1:8000/api/registration", requestOptions)
        .then(response => {
            hideLoading();
            if (response.ok) {
                return response.json();
            } else {
                alert("Erreur lors de l'inscription");
                throw new Error("Erreur: " + response.status);
            }
        })
        .then(result => {
            // Affiche le message de succès immédiatement
            alert(`${inputNom.value} ${inputPreNom.value} avec le rôle ${inputRole.value} a été enregistré avec succès.`);
            
            // Redirige vers la page de gestion des utilisateurs après 1 seconde
            setTimeout(() => {
                window.location.href = "/manage-users";
            }, 1000);
        })
        .catch(error => {
            console.log('Erreur:', error);
            hideLoading();
        });
}
