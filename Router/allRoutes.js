import Route from "./Route.js";

// Définir ici les routes spécifiques à Zoo Arcadia
export const allRoutes = [
    new Route("/", "Accueil", "/pages/home.html", []),
    new Route("/services", "Services", "/pages/services.html", []),
    new Route("/habitats", "Habitats", "/pages/habitats.html", [], "/js/habitats.js"),
    new Route("/contact", "Contact", "/pages/contact.html", [], "/js/contact.js"),
    new Route("/confidentialite", "Politique de confidentialité", "/pages/confidentialite.html", []),

    new Route("/account", "Mon compte", "/pages/auth/account.html", ["disconnected"]),
    new Route("/signin", "Connexion", "/pages/auth/signin.html", ["disconnected"], "/js/auth/signin.js"),
    new Route("/signup", "Inscriotion", "/pages/auth/signup.html", ["disconnected"],"/js/auth/signup.js"),
    new Route("/editPassword", "Changement de mot de passe", "/pages/auth/editPassword.html", ["ROLE_ADMIN", "ROLE_VETERINAIRE", "ROLE_EMPLOYE"], "/js/auth/editPassword.js"),

    new Route("/manage-users", "Gestion des utilisateurs", "/pages/admin/manage-users.html", ["ROLE_ADMIN"], "/js/admin/manage-users.js"),
    new Route("/manage-services", "Gestion des services", "/pages/admin/manage-services.html", ["ROLE_EMPLOYE"], "/js/admin/manage-services.js"),
    new Route("/manage-habitats", "Gestion des habitats", "/pages/admin/manage-habitats.html", ["ROLE_VETERINAIRE"], "/js/admin/manage-habitats.js"),

    new Route("/manage-feeding", "Gérer l'alimentation", "/pages/employee/manage-feeding.html", ["ROLE_EMPLOYE", "ROLE_VETERINAIRE"], "/js/employee/manage-feeding.js"),
    new Route("/validate-reviews", "Validation des avis", "/pages/employee/validate-reviews.html", ["ROLE_EMPLOYE"]),
    
    new Route("/checkups", "Contrôles de santé", "/pages/veterinary/checkups.html", ["ROLE_VETERINAIRE"]),
    new Route("/animal-reports", "Rapports de santé", "/pages/veterinary/animal-reports.html", ["ROLE_VETERINAIRE"], "/js/veterinary/animal-reports.js"),

    new Route("/new-users", "Ajouter des nouvelle  utilisateurs", "/pages/admin/newuser.html", ["ROLE_ADMIN"], "/js/admin/newuser.js"),
    new Route("/commentaire", "Ajouter les nouvelle commentaires", "/pages/employee/commentaire.html", [], "/js/employee/commentaire.js"),
   

];

// Le titre du site Web
export const websiteName = "Zoo Arcadia";
