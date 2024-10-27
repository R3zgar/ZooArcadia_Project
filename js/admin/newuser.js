// Récupération des éléments du formulaire
const inputNom = document.getElementById("NomInput");
const inputPreNom = document.getElementById("PrenomInput");
const inputMail = document.getElementById("EmailInput");
const inputPassword = document.getElementById("PasswordInput");
const inputValidationPassword = document.getElementById("ValidatePasswordInput");
const inputRole = document.getElementById("RoleSelect");
const btnValidation = document.getElementById("btn-validation-inscription");
const formInscription = document.getElementById("formulaireInscription");

// Ajout des écouteurs d'événements
inputNom.addEventListener("keyup", validateForm); 
inputPreNom.addEventListener("keyup", validateForm);
inputMail.addEventListener("keyup", validateForm);
inputPassword.addEventListener("keyup", validateForm);
inputValidationPassword.addEventListener("keyup", validateForm);
inputRole.addEventListener("change", validateForm);

btnValidation.addEventListener("click", inscrireUtilisateur);

function validateForm() {
    const nomOk = validateRequired(inputNom);
    const prenomOk = validateRequired(inputPreNom);
    const mailOk = validateMail(inputMail);
    const passwordOk = validatePassword(inputPassword);
    const passwordConfirmOk = validateConfirmationPassword(inputPassword, inputValidationPassword);
    const roleOk = inputRole.value !== "";

    btnValidation.disabled = !(nomOk && prenomOk && mailOk && passwordOk && passwordConfirmOk && roleOk);
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

function validateMail(input) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(input.value.trim())) {
        input.classList.add("is-valid");
        input.classList.remove("is-invalid");
        return true;
    } else {
        input.classList.add("is-invalid");
        input.classList.remove("is-valid");
        return false;
    }
}

function validatePassword(input) {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{8,}$/;
    if (passwordRegex.test(input.value)) {
        input.classList.add("is-valid");
        input.classList.remove("is-invalid");
        return true;
    } else {
        input.classList.add("is-invalid");
        input.classList.remove("is-valid");
        return false;
    }
}

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

function inscrireUtilisateur(event) {
    event.preventDefault();
    showLoading();

    if (inputPassword.value !== inputValidationPassword.value) {
        alert("Les mots de passe ne correspondent pas. Veuillez vérifier.");
        hideLoading();
        return;
    }

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
        "firstName": inputNom.value,
        "lastName": inputPreNom.value,
        "email": inputMail.value,
        "password": inputPassword.value,
        "roles": [inputRole.value]
    });

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
    };

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
            alert(`${inputNom.value} ${inputPreNom.value} avec le rôle ${inputRole.value} a été enregistré avec succès.`);
            setTimeout(() => {
                window.location.href = "/manage-users";
            }, 1000);
        })
        .catch(error => {
            console.log('Erreur:', error);
            hideLoading();
        });
}

function showLoading() {
    btnValidation.textContent = "Enregistrement en cours...";
    btnValidation.disabled = true;
}

function hideLoading() {
    btnValidation.textContent = "Inscription";
    btnValidation.disabled = false;
}
