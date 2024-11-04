
# Zoo Arcadia - Full Stack Project

## Description du Projet

Zoo Arcadia est une application web avancée conçue pour la gestion d'un zoo moderne. Ce projet permet une gestion complète des animaux, des habitats, des services et des consultations vétérinaires. Le système utilise une architecture front-end et back-end séparée, permettant une expérience utilisateur fluide et une gestion administrative efficace. Le back-end est développé avec Symfony 6.4, utilisant MySQL et MongoDB pour le stockage des données, tandis que le front-end est conçu avec HTML5, CSS3, JavaScript et Bootstrap 5 pour une interface utilisateur réactive et intuitive. Les fonctionnalités d'authentification sécurisée offrent un accès personnalisé pour différents rôles (administrateur, employé, vétérinaire).

## Fonctionnalités Principales

### Back-End
- **Gestion des Animaux** : Création, visualisation, mise à jour et suppression des informations des animaux du zoo.
- **Gestion des Habitats** :  Attribution des animaux à leurs habitats (e.g., Savane, Jungle, Marais) avec une structure de relation complète.
- **Gestion des Services** : CRUD des services proposés tels que les visites guidées, les restaurants, etc.
- **Consultations Vétérinaires** :  Gestion des rapports de santé des animaux.
- **Authentification Sécurisée** : Inscription et connexion avec des rôles et permissions spécifiques, utilisant un système d'API Key.
- **Documentation API** : Documentation complète accessible via `/api/doc`, facilitant l'intégration et les tests avec Postman.

### Front-End
- **Page d'accueil** : Accès à une vue d'ensemble du zoo avec des informations visuelles et textuelles sur les habitats et services.
- **Navigation Intuitive ** : Un menu de navigation permettant un accès rapide aux différentes sections : Accueil, Services, Habitats, Connexion et Contact.
- **Consultation des Animaux et Habitats ** : Vue détaillée des animaux disponibles dans chaque habitat, avec des informations spécifiques pour chaque espèce.
- **Commentaires des Visiteurs ** : Les visiteurs peuvent laisser des avis, lesquels sont validés par les employés avant publication.
- **Réactivité Multi-Plateforme ** : Conception réactive pour une expérience cohérente sur ordinateurs, tablettes et mobiles.

## Technologies Utilisées

### Back-End
- **Symfony 6.4** : Framework back-end principal, avec gestion des routes, de la sécurité et des entités.
- **PHP 8.1+** : Langage de programmation pour le développement du projet.
- **MySQL** : Base de données relationnelle pour le stockage structuré des données.
- **MongoDB** : Utilisé pour le stockage NoSQL, notamment pour les données analytiques et statistiques.
- **Node.js et Postman** : Outils pour les tests et la documentation des API.

### Front-End
- **HTML5** : Structure sémantique des pages pour une accessibilité améliorée.
- **CSS3 & Bootstrap 5** : Stylisation et mise en page réactive assurant une cohérence visuelle et une adaptabilité multi-plateforme.
- **JavaScript (ES6+)** : Dynamisme et interactivité pour une expérience utilisateur moderne.
- **Fetch API** : Communication efficace avec le back-end pour charger et afficher les données en temps réel.
- **VSCode** : Éditeur de code utilisé pour le développement avec des extensions facilitant la gestion des projets front-end.


## Prérequis

Avant de commencer, assurez-vous d'avoir les éléments suivants installés :

- **PHP 8.1 ou supérieur**
- **Composer** pour la gestion des dépendances PHP
- **Symfony CLI** (facultatif mais recommandé)
- **MySQL et MongoDB**  pour la gestion des données
- **Git**  pour le versionnement
- **Node.js** (version 14 ou plus récente) et **npm** ou **yarn** pour la gestion des dépendances.
- **Postman **  pour tester les endpoints de l’API
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

**Backend**

Installez toutes les dépendances PHP pour le back-end avec Composer :

```bash
cd backend
composer install
```

**Front-End**

Installez toutes les dépendances pour le front-end avec npm ou yarn :

```bash
cd frontend
npm install
# ou
yarn install
```

### 3. Configuration des Bases de Données

Modifiez le fichier `.env.local` et `.env` pour configurer les connexions aux bases de données MySQL et MongoDB dans le dossier `backend` :

```makefile
DATABASE_URL="mysql://[utilisateur]:[motdepasse]@127.0.0.1:3306/zooarcadia"
MONGODB_URL="mongodb://127.0.0.1:27017"
MONGODB_DB="zooarcadia_analytics"
```

Créer la Base de Données et Exécuter les Migrations
```bash
php bin/console doctrine:database:create
php bin/console doctrine:migrations:migrate
```

### 4. Charger les Données Fictives (Fixtures)

Pour initialiser les données pour les tests, chargez les données fictives :

```bash
php bin/console doctrine:fixtures:load
```


### 5. Lancer le Serveur de Développement

Pour démarrer le serveur Symfony pour le back-end :

```bash
symfony server:start
```

Pour démarrer le serveur de développement pour le front-end :

```bash
php -S localhost:3000
# ou avec l'extension PHP Server (VSCode)
```

L'application sera accessible aux adresses suivantes :

- **Back-End** : https://127.0.0.1:8000
- **Front-End** : http://localhost:3000

## Documentation de l'API

L'API est documentée avec NelmioApiDoc. Vous pouvez consulter la documentation complète à l'adresse suivante :

```arduino
http://127.0.0.1:8000/api/doc
```

## Authentification des Utilisateurs

### Inscription
- **Route ** : `POST /api/register`
- **Exemple de Corps de Requête : ** 

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "user@example.com",
  "password": "password123"
}
```

### Connexion
- **Route ** : `POST /api/login`
- **Exemple de Corps de Requête : ** 

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

Les utilisateurs reçoivent un token JWT pour les requêtes protégées :

```vbnet
Authorization: API Key
Key: X-AUTH-TOKEN
Value: [votre-token(94d948b81b5d021d1b16354720d54c89774f8522)]
Add to: Header
Key: Content-Type - Value:application/json
```


## Exemples de Requêtes API

### Créer un Nouvel Animal
- **Route ** : `POST /api/animal`
- **Corps de la Requête : ** 

```json
{
  "prenom_animal": "Simba",
  "race_animal": "Lion",
  "etat_animal": "En bonne santé",
  "image": "simba.jpg",
  "habitat_id": 1
}
```

### Lister tous les Services
- **Route ** : `POST /api/service`


```json
[
  {
    "id": 1,
    "nom_service": "Visite guidée",
    "description_service": "Une visite guidée du zoo avec un guide expérimenté."
  },
  {
    "id": 2,
    "nom_service": "Petit train",
    "description_service": "Un tour du zoo en petit train pour les familles."
  }
]
```

## Tests

Pour exécuter les tests unitaires et fonctionnels du projet :

```bash
application Postman

php bin/phpunit
```



## Déploiement

## Déploiement sur Platform.sh

1. Assurez-vous que votre projet est activé sur **Platform.sh**.

2. **Ajoutez les fichiers Platform.sh** nécessaires :
    - Créez un fichier `.platform.app.yaml` pour configurer l'application sur Platform.sh.

   Voici un exemple basique :

   ```yaml
   name: zooarcadia
   type: 'php:8.1'
   disk: 1024

   build:
       flavor: composer

   relationships:
       database: 'mysql:mysql'

   web:
       locations:
           '/':
               root: 'public'
               passthru: '/index.php'
   ```

3. **Poussez votre code** sur Platform.sh :

   ```bash
   git add .
   git commit -m "Déploiement sur Platform.sh"
   git push platform main
   ```

4. **Base de données** : Vous pouvez importer votre base de données MariaDB directement depuis MySQL Workbench ou via Platform.sh.

   Utilisez l'interface de **Platform.sh** pour définir les variables d'environnement comme `DATABASE_URL`.


## Auteurs

- **R3zgar** - Développeur principal


## Licence

Ce projet est sous licence **MIT**. Veuillez consulter le fichier `LICENSE` pour plus d'informations.

---

Développé avec passion pour préserver et promouvoir la biodiversité. 🌍🌿🐾
