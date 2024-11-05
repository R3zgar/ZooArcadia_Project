const apiUrl = "https://master-7rqtwti-unhphrs4kyslw.fr-3.platformsh.site/api/";

// Écouter l'événement 'submit' pour le formulaire de nouveau rapport
document.getElementById("newReportForm").addEventListener("click", function(event) {
    event.preventDefault(); // Empêcher l'envoi par défaut du formulaire

    // Récupérer les valeurs du formulaire
    const etat = document.getElementById("etatAnimalInput").value;
    const nourriture = document.getElementById("nourritureInput").value;
    const grammage = document.getElementById("grammageInput").value;
    const datePassage = "2024-10-12"; // Exemple de date (peut être rendu dynamique si nécessaire)
    const animalId = 1; // ID de l'animal, cela peut être modifié dynamiquement selon le cas

    // Vérifier si tous les champs sont remplis
    if (!etat || !nourriture || !grammage) {
        alert("Veuillez remplir tous les champs.");
        return;
    }

    // Créer l'en-tête de la requête
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    // Préparer les données pour la requête
    const raw = JSON.stringify({
        "etat_animal": etat,
        "nourriture": nourriture,
        "grammage": parseInt(grammage),  // Assurez-vous que le grammage soit un entier
        "date_passage": datePassage,
        "animal_id": animalId
    });

    // Options pour la requête fetch
    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
    };

    // Envoyer la requête fetch vers l'API pour créer un nouveau rapport vétérinaire
    fetch(`${apiUrl}veterinaire_rapport`, requestOptions)
    .then(response => {
        if(response.ok){
            return response.json();  // Convertir la réponse en JSON si tout va bien
        } else {
            throw new Error("Erreur lors de l'ajout du rapport");
        }
    })
    .then(result => {
        console.log(result);  // Afficher la réponse dans la console pour le débogage
        alert("Nouveau rapport ajouté avec succès !");
        
        // Réinitialiser le formulaire après l'ajout du rapport
        document.getElementById("newReportForm").reset();

        // Fermer le modal après succès
        const modal = bootstrap.Modal.getInstance(document.getElementById("addReportModal"));
        modal.hide();
    })
    .catch(error => {
        console.error('Erreur:', error);  // Afficher une erreur en cas d'échec
        alert("Une erreur s'est produite lors de l'ajout du rapport.");
    });
});
