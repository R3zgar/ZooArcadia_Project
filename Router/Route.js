export default class Route {
  constructor(url, title, pathHtml, authorize, pathJS = "") {
      this.url = url;
      this.title = title;
      this.pathHtml = pathHtml;
      this.pathJS = pathJS;
      this.authorize = authorize;
  }

  navigateWithHash() {
    if (window.location.hash) {
        const target = document.querySelector(window.location.hash);
        if (target) {
            target.scrollIntoView({ behavior: "smooth" });
        }
    }
}
}

/*
[] -> Tout le monde peut y accéder
["disconnected"] -> Réserver aux utilisateurs déconnecté 
["admin"] -> Réserver aux utilisateurs avec le rôle admin 
["veteriner"] -> Réserver aux utilisateurs avec le rôle veteriner 
["employee"] -> Réserver aux utilisateurs avec le rôle employee
["admin", "veteriner", "employee"] -> Réserver aux utilisateurs avec le rôle admin, veteriner et employee
*/    