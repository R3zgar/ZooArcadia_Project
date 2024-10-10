import Route from "./Route.js";

// Définir ici les routes spécifiques à Zoo Arcadia
export const allRoutes = [
    new Route("/", "Accueil", "/pages/home.html"),
    new Route("/services", "Services", "/pages/services.html"),
    new Route("/habitats", "Habitats", "/pages/habitats.html"),
    new Route("/contact", "Contact", "/pages/contact.html"),
    new Route("/connexion", "Connexion", "/pages/connexion.html"),
];

// Le titre du site Web
export const websiteName = "Zoo Arcadia";
