// Importations nécessaires pour l'API
const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');

// Initialisation de l'application Express
const app = express();
const PORT = 3001; // Port sur lequel l'API écoute

// Middleware pour parser les requêtes JSON
app.use(bodyParser.json());

// Liste des utilisateurs simulée
const users = [
    { email: "admin@example.com", password: "password123", role: "admin" },
    { email: "user@example.com", password: "password123", role: "employee" }
];

// Clé secrète utilisée pour signer les tokens JWT
const SECRET_KEY = "secret-key";

// Middleware pour vérifier si le token JWT est valide
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Extraction du token de l'en-tête Authorization

    if (!token) return res.sendStatus(401); // Si aucun token n'est présent, renvoyer une erreur 401 (Non autorisé)

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.sendStatus(403); // Si le token n'est pas valide, renvoyer une erreur 403 (Interdit)
        req.user = user; // Stocker les infos utilisateur dans req.user
        next(); // Passer à la prochaine fonction middleware ou à la route suivante
    });
};

// Route de connexion (Login) pour obtenir un token JWT
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;

    // Vérification des identifiants
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) {
        return res.status(401).json({ message: "Identifiants invalides" });
    }

    // Création d'un token JWT avec le rôle de l'utilisateur
    const token = jwt.sign({ role: user.role }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ token }); // Envoi du token en réponse
});

// Route protégée pour accéder à la liste des utilisateurs
app.get('/api/users', authenticateToken, (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: "Accès interdit" }); // Seuls les admins peuvent accéder à cette route
    }

    // Si l'utilisateur est admin, renvoyer la liste des utilisateurs
    res.json(users);
});

// Démarrage du serveur sur le port spécifié
app.listen(PORT, () => {
    console.log(`Serveur d'authentification JWT est en cours d'exécution sur le port ${PORT}`);
});
