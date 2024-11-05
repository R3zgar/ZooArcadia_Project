

// Récupération des éléments HTML pour le formulaire de connexion
const mailInput = document.getElementById("EmailInput");
const passwordInput = document.getElementById("PasswordInput");
const btnSignin = document.getElementById("btnSignin");
const signinForm = document.getElementById("signinForm");

// Événement déclenché lorsque l'utilisateur clique sur le bouton de connexion
btnSignin.addEventListener("click", function(event) {
    event.preventDefault();  // Empêche l'envoi du formulaire par défaut
    checkCredentials();  // Appelle la fonction de vérification des identifiants
});

// Fonction pour vérifier les identifiants de connexion
function checkCredentials(){
    // Récupérer les données du formulaire
    let dataForm = new FormData(signinForm);  
    
    // Définir les en-têtes de la requête
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    // Créer la requête JSON avec l'email et le mot de passe
    let raw = JSON.stringify({
        "username": dataForm.get("email"),  // Email de l'utilisateur
        "password": dataForm.get("password")  // Mot de passe de l'utilisateur
    });

    // Options de la requête fetch
    let requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    // Envoi de la requête pour vérifier les informations de connexion
    fetch(`${apiUrl}login`, requestOptions)
    .then(response => {
        if(response.ok){
            return response.json();  // Si la réponse est valide, la convertir en JSON
        }
        else{
            // Si les informations d'identification sont incorrectes, afficher une erreur
            mailInput.classList.add("is-invalid");
            passwordInput.classList.add("is-invalid");
            throw new Error("Identifiants incorrects");
        }
    })
    .then(result => {
        if(result && result.apiToken) {  // Vérifie si le token existe
            const token = result.apiToken;  // Récupérer le token API de la réponse
            setToken(token);  // Stocker le token dans un cookie

            const userRole = result.roles[0];  // Récupérer le rôle de l'utilisateur

            // Enregistrer le rôle de l'utilisateur dans un cookie
            setCookie(RoleCookieName, userRole, 7);

            // Rediriger l'utilisateur en fonction de son rôle
            if (userRole === 'ROLE_ADMIN') {
                window.location.href = '/manage-users';  // Redirection vers la page d'administration
            } else if (userRole === 'ROLE_EMPLOYE') {
                window.location.href = '/manage-services';  // Redirection vers la page des services
            } else if (userRole === 'ROLE_VETERINAIRE') {
                window.location.href = '/manage-habitats';  // Correction de l'URL (habitats au lieu de habitat)
            } else {
                alert("Vous n'avez pas accès à cette section.");  // Afficher une alerte pour les rôles inconnus
            }
        } else {
            throw new Error("Réponse du serveur invalide");  // Gestion des erreurs si le token est manquant
        }
    })
    .catch(error => {
        console.log('Erreur:', error);  // Afficher l'erreur dans la console
        alert("Une erreur s'est produite lors de la connexion. Veuillez réessayer.");  // Afficher une alerte en cas d'erreur
    });
}
