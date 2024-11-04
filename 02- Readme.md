
# Zoo Arcadia - Front-End

## Description du Projet

L'interface utilisateur de **Zoo Arcadia** est une application web interactive conçue pour offrir aux visiteurs une expérience immersive et intuitive lors de la découverte des animaux et habitats du zoo, ainsi que des services disponibles. Le front-end de Zoo Arcadia intègre une esthétique moderne et une navigation fluide, permettant aux utilisateurs de se connecter facilement avec la nature et la faune que le zoo préserve.

## Fonctionnalités

### Fonctionnalités Principales pour les Visiteurs
- **Page d'accueil** : Accès à une vue d'ensemble du zoo avec des informations visuelles et textuelles sur les habitats et services.
- **Navigation Intuitive** : Un menu de navigation permettant un accès rapide aux différentes sections : Accueil, Services, Habitats, Connexion et Contact.
- **Consultation des Animaux et Habitats** : Vue détaillée des animaux disponibles dans chaque habitat, avec des informations spécifiques pour chaque espèce.
- **Commentaires des Visiteurs** : Les visiteurs peuvent laisser des avis et des commentaires, lesquels sont validés par les employés avant publication.
- **Réactivité Multi-Plateforme** : Conception réactive pour offrir une expérience cohérente sur ordinateurs, tablettes et mobiles.

### Fonctionnalités pour les Employés, Vétérinaires et Administrateurs
- **Connexion Sécurisée** : Authentification sécurisée pour accéder aux espaces dédiés des employés, vétérinaires et administrateurs.
- **Gestion des Animaux et Services** : Interface intuitive permettant aux vétérinaires de gérer les informations sur les animaux et aux administrateurs de gérer les services offerts par le zoo.

## Technologies Utilisées

### Front-End
- **HTML5** : Structure sémantique des pages pour une accessibilité améliorée.
- **CSS3 & Bootstrap 5** : Stylisation et mise en page réactive assurant une cohérence visuelle et une adaptabilité multi-plateforme.
- **JavaScript (ES6+)** : Dynamisme et interactivité pour une expérience utilisateur moderne.
- **Fetch API** : Communication efficace avec le back-end pour charger et afficher les données en temps réel.
- **VSCode** : Éditeur de code utilisé pour le développement avec des extensions facilitant la gestion des projets front-end.

### Back-End (Intégré)
- **Symfony 6.4** : Fournit des endpoints API sécurisés pour alimenter l'interface utilisateur avec des données à jour.
- **MySQL et MongoDB** : Bases de données utilisées pour stocker les informations des animaux, habitats, services et statistiques des visites.

## Prérequis

Avant de commencer, assurez-vous d'avoir installé les éléments suivants :
- **Node.js** (version 14 ou plus récente) et **npm** ou **yarn** pour la gestion des dépendances.
- **Un navigateur moderne** (Chrome, Firefox, Edge, Safari) pour tester l'application.
- **Backend configuré** avec l'API Zoo Arcadia opérationnelle.

## Installation et Configuration

### 1. Cloner le Dépôt

Commencez par cloner le dépôt GitHub du front-end sur votre machine locale.

```bash
git clone https://github.com/R3zgar/ZooArcadia_Project.git
cd ZooArcadia_Project
```

### 2. Installer les Dépendances

Installez toutes les dépendances nécessaires via **npm** ou **yarn**.

```bash
npm install
# ou
yarn install
```

### 3. Configurer les Variables d'Environnement

Créez un fichier `.env.local` à la racine du projet pour définir l'URL de l'API back-end.

```env
const API_URL = "http://127.0.0.1:8000/api";
```

Assurez-vous que l'URL pointe vers votre back-end configuré.

### 4. Lancer le Serveur de Développement

Pour démarrer le serveur de développement avec l'extension PHP Server, utilisez la commande suivante :

```bash
php -S localhost:3000
# ou
PHP Server EXTENTION
```

Accédez à l'application en ouvrant [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## Scripts Disponibles

- **`npm start`** : Démarre le serveur de développement.
- **`npm run build`** : Génère une version optimisée de l'application pour la production.
- **`npm test`** : Exécute les tests unitaires pour vérifier la qualité du code.

## Structure du Projet

- **public/** : Contient les fichiers statiques comme `index.html` et les icônes.
- **src/** : Contient le code source principal de l'application.
  - **components/** : Composants réutilisables de l'interface utilisateur.
  - **pages/** : Différentes pages de l'application (Accueil, Services, Habitats, etc.).
  - **services/** : Services pour la gestion des requêtes API vers le back-end.
  - **styles/** : Fichiers CSS personnalisés pour des styles supplémentaires.

## Intégration avec le Back-End

Le front-end interagit avec le back-end via des requêtes API RESTful sécurisées. Toutes les opérations de gestion (CRUD) pour les animaux, habitats, services, et utilisateurs sont effectuées via l'API. L'authentification est gérée avec des tokens JWT pour sécuriser l'accès aux fonctionnalités restreintes.

## Contribution

Si vous souhaitez contribuer à ce projet, veuillez suivre les étapes ci-dessous :
1. Créez une nouvelle branche pour votre fonctionnalité (`git checkout -b feature/ma-fonctionnalite`).
2. Faites vos modifications et testez-les.
3. Soumettez une Pull Request avec une description détaillée de vos changements.

## Licence

Ce projet est sous licence **MIT**. Veuillez consulter le fichier `LICENSE` pour plus d'informations.

---

Développé avec passion pour préserver et promouvoir la biodiversité. 🌍🌿🐾
