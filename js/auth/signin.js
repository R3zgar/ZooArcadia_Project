
const mailInput = document.getElementById("EmailInput")
const passwordInput = document.getElementById("PasswordInput")
const btnSingin = document.getElementById("btnSignin");

btnSingin.addEventListener("click", checkCredentials);

function checkCredentials(){

    // Ici, une requête API sera effectuée pour vérifier les identifiants dans la base de données
    if(mailInput.value == "test@gmail.com" && passwordInput.value == "12345"){
        // Il faudra récupérer un token réel depuis l'API
        const token = "fjsd94rGh3kTz9Lm82PvQbX6nA5sjkF45LpMxN7QyHcRtZ0wBd";
        setToken(token);

        // Enregistrer ce token dans les cookies
        setCookie(RoleCookieName, "client", 7);
        window.location.replace("/");
    }
    else{
        mailInput.classList.add("is-invalid");
        passwordInput.classList.add("is-invalid");
    }
}