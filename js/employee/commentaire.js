// Implémenter le JS de ma page

// Sélection des éléments du formulaire
const formSoumettre = document.getElementById("formulaireSoumettre");
const btnValidation = document.getElementById("btn-soumettre");

btnValidation.addEventListener("click", soumettreAvis);

function soumettreAvis(e) {
    e.preventDefault();  // Empêche le comportement par défaut du bouton

    // Vérification que les éléments sont bien sélectionnés
    console.log("Formulaire soumis");

    // Récupération des données du formulaire
    let dataForm = new FormData(formSoumettre);

    // Préparer les en-têtes de la requête
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    // Préparer les données à envoyer
    let raw = JSON.stringify({
        "auteur": dataForm.get("pseudonym"),
        "contenu": dataForm.get("reviewText"),
        "animal_id": dataForm.get("animalid") // Assurez-vous que l'ID est bien récupéré
    });

    console.log("Données envoyées :", raw);

    let requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
    };

    // Envoyer la requête à l'API
    fetch("https://127.0.0.1:8000/api/commentaire", requestOptions)
        .then(response => {
            if (response.ok) {
                console.log("Réponse OK reçue");
                return response.json();
            }
            throw new Error("Erreur lors de l'envoi du commentaire.");
        })
        .then(result => {
            alert("Merci pour votre avis, il a été soumis pour validation.");
            formSoumettre.reset();  // Réinitialiser le formulaire
            // Fermer le modal après l'envoi
            const modal = bootstrap.Modal.getInstance(document.getElementById('submitReviewModal'));
            modal.hide();
        })
        .catch(error => {
            console.error('Erreur:', error);
            alert("Une erreur s'est produite lors de l'envoi de votre avis.");
        });
}
