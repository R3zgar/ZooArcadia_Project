import Route from "./Route.js";

// Définir ici les routes spécifiques à Zoo Arcadia
export const allRoutes = [
    new Route("/", "Accueil", "/pages/home.html", []),
    new Route("/services", "Services", "/pages/services.html", []),
    new Route("/habitats", "Habitats", "/pages/habitats.html", []),
    new Route("/contact", "Contact", "/pages/contact.html",[]),
    new Route("/confidentialite", "Politique de confidentialité", "/pages/confidentialite.html", []),

    new Route("/account", "Mon compte", "/pages/auth/account.html", ["disconnected"]),
    new Route("/signin", "Connexion", "/pages/auth/signin.html", ["disconnected"], "/js/auth/signin.js"),
    new Route("/signup", "Inscriotion", "/pages/auth/signup.html", ["disconnected"],"/js/auth/signup.js"),
    new Route("/editPassword", "Changement de mot de passe", "/pages/auth/editPassword.html", ["admin", "veteriner", "employee"]),

    new Route("/manage-users", "Gestion des utilisateurs", "/pages/admin/manage-users.html", ["admin"], "/js/admin/manage-users.js"),
    new Route("/manage-services", "Gestion des services", "/pages/admin/manage-services.html", ["emploee"], "/js/admin/manage-services.js"),
    new Route("/manage-habitats", "Gestion des habitats", "/pages/admin/manage-habitats.html", ["veteriner"], "/js/admin/manage-habitats.js"),

    new Route("/employee/manage-food", "Gestion des stocks alimentaires", "/pages/employee/manage-food.html", ["emploee"]),
    new Route("/employee/validate-reviews", "Validation des avis", "/pages/employee/validate-reviews.html", ["emploee"]),
    
    new Route("/veterinary/checkups", "Contrôles de santé", "/pages/veterinary/checkups.html", ["veteriner"]),
    new Route("/veterinary/animal-reports", "Rapports de santé", "/pages/veterinary/animal-reports.html", ["veteriner"]),


];

// Le titre du site Web
export const websiteName = "Zoo Arcadia";
