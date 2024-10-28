import Route from "./Route.js";
import { allRoutes, websiteName } from "./allRoutes.js";

// Création d'une route pour la page 404 (page introuvable)
const route404 = new Route("404", "Page introuvable", "/pages/404.html", ["disconnected"]);

// Fonction pour récupérer la route correspondant à une URL donnée
const getRouteByUrl = (url) => {
  let currentRoute = null;
  // Parcours de toutes les routes pour trouver la correspondance
  allRoutes.forEach((element) => {
    if (element.url === url) {
      currentRoute = element;
    }
  });
  // Si aucune correspondance n'est trouvée, on retourne la route 404
  return currentRoute || route404;
};

// Fonction pour charger le contenu de la page
const LoadContentPage = async () => {
  const path = window.location.pathname;
  // Récupération de la route actuelle basée sur l'URL
  const actualRoute = getRouteByUrl(path);

  // Vérification des droits d'accès pour la page
  const allRolesArray = actualRoute.authorize;

  if (allRolesArray.length > 0) {
    // Si la page est accessible uniquement aux utilisateurs déconnectés
    if (allRolesArray.includes("disconnected")) {
      if (isConnected()) {
        // Redirection vers la page d'accueil si l'utilisateur est connecté
        window.location.replace("/");
      }
    } else {
      // Récupération du rôle de l'utilisateur connecté
      const roleUser = getRole();
      // Si le rôle de l'utilisateur ne correspond pas à ceux autorisés, redirection
      if (!allRolesArray.includes(roleUser)) {
        window.location.replace("/");
      }
    }
  }

  // Récupération du contenu HTML de la route
  const html = await fetch(actualRoute.pathHtml).then((data) => data.text());
  // Insertion du contenu HTML dans l'élément avec l'ID "main-page"
  document.getElementById("main-page").innerHTML = html;

  // Ajout du contenu JavaScript si disponible pour la route
  if (actualRoute.pathJS !== "") {
    let scriptTag = document.createElement("script");
    scriptTag.setAttribute("type", "text/javascript");
    scriptTag.setAttribute("src", actualRoute.pathJS);
    document.querySelector("body").appendChild(scriptTag);
  }

  // Mise à jour du titre de la page
  document.title = actualRoute.title + " - " + websiteName;

  // Afficher et masquer les éléments en fonction du rôle de l'utilisateur
  showAndHideElementsForRoles();
};

// Fonction pour gérer les événements de routage (clics sur les liens)
const routeEvent = (e) => {
  e.preventDefault(); // Empêche le comportement par défaut du lien
  // Mise à jour de l'URL dans l'historique du navigateur
  window.history.pushState({}, "", e.target.href);
  // Chargement du contenu de la nouvelle page
  LoadContentPage();
};

// Gestion de l'événement de retour en arrière dans l'historique du navigateur
window.addEventListener("popstate", LoadContentPage);
// Assignation de la fonction routeEvent pour les clics sur les liens
window.route = routeEvent;

// Ajout d'un écouteur pour les clics sur les liens avec la classe 'route'
document.querySelectorAll('.route').forEach((link) => {
  link.addEventListener("click", routeEvent);
});

// Chargement initial du contenu de la page
LoadContentPage();

