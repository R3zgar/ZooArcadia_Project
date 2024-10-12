import Route from "./Route.js";

// Définir ici les routes spécifiques à Zoo Arcadia
export const allRoutes = [
    new Route("/", "Accueil", "/pages/home.html"),
    new Route("/services", "Services", "/pages/services.html"),
    new Route("/habitats", "Habitats", "/pages/habitats.html"),
    new Route("/contact", "Contact", "/pages/contact.html"),
    new Route("/confidentialite", "Politique de confidentialité", "/pages/confidentialite.html"),
    new Route("/account", "Mon compte", "/pages/auth/account.html"),
    new Route("/signin", "Connexion", "/pages/auth/signin.html"),
    new Route("/signup", "Inscriotion", "/pages/auth/signup.html"),
    new Route("/editPassword", "Changement de mot de passe", "/pages/auth/editPassword.html"),

];

// Le titre du site Web
export const websiteName = "Zoo Arcadia";
