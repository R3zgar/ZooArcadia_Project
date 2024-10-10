# Zoo Arcadia - Application Web

## Description du projet

L'application "Zoo Arcadia" est une plateforme web interactive développée pour le zoo Arcadia, permettant aux visiteurs d'explorer les habitats et les animaux du zoo, de consulter les services proposés, et de laisser des avis. L'application comporte aussi des espaces sécurisés pour les vétérinaires, employés, et administrateurs, leur permettant de gérer les informations sur les animaux et d'assurer le bon fonctionnement du zoo.

## Fonctionnalités

### Pour les visiteurs
- **Page d'accueil** : Présentation du zoo avec des images et des informations sur les habitats et les services.
- **Menu de navigation** : Accès rapide aux différentes sections (accueil, services, habitats, connexion, contact).
- **Consultation des animaux** : Vue des différents habitats et des animaux qui y vivent, avec détails sur chaque animal.
- **Avis des visiteurs** : Les visiteurs peuvent laisser des commentaires qui sont validés par les employés avant publication.

### Pour les vétérinaires, employés et administrateurs
- **Connexion sécurisée** : Seuls les vétérinaires, employés et administrateurs peuvent se connecter avec un nom d'utilisateur et un mot de passe.
- **Gestion des animaux** : Les vétérinaires peuvent enregistrer des comptes rendus de santé des animaux.
- **Gestion des services** : Les administrateurs peuvent modifier les services du zoo.
- **Statistiques** : Consultation des statistiques sur les animaux les plus populaires.

## Technologies utilisées

### Front-end
- **HTML5** : Structure des pages web.
- **CSS3 (Bootstrap)** : Mise en page réactive et stylisation.
- **JavaScript** : Interactions dynamiques sur la page.

### Back-end
- **PHP (avec PDO)** : Gestion des interactions serveur, des requêtes et de la logique métier.
- **MySQL** : Base de données relationnelle pour stocker les utilisateurs, les animaux, les habitats, et les services.
- **MongoDB** : Base de données NoSQL pour stocker les statistiques des consultations des pages des animaux.

## Prérequis

Avant d'installer et d'exécuter l'application localement, assurez-vous d'avoir les éléments suivants installés sur votre machine :
- **PHP** (version 7.4 ou plus récente)
- **MySQL** (ou MariaDB)
- **MongoDB**
- **Apache ou Nginx** pour servir l'application.
- **Git** pour cloner le dépôt.
- **Un environnement local** comme XAMPP, WAMP ou MAMP.

## Installation et configuration

### 1. Cloner le dépôt GitHub

Clonez ce dépôt sur votre machine locale :

```bash
git clone https://github.com/votre-nom-utilisateur/zooarcadia_project.git
cd zooarcadia_project
