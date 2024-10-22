//Implémenter le JS de ma page

const inputPseudonym = document.getElementById("pseudonym");
const inputReview = document.getElementById("reviewText");
const btnValidation = document.getElementById("btn-soumettre");
const formSoumettre = document.getElementById("formulaireSoumettre");

btnValidation.addEventListener("click", soumettreAvis);


function soumettreAvis(){

    let dataForm = new FormData(formSoumettre);

    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    let raw = JSON.stringify({
        "auteur": dataForm.get("nom"),
        "contenu": dataForm.get("avis"),
        "animal_id": dataForm.get("animalid")
    });

    let requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow"
    };

     // Envoyer la requête
     fetch("https://127.0.0.1:8000/api/commentaire", requestOptions)
     .then(response => {
         if (response.ok) {
             return response.json();
         } else {
             throw new Error('Erreur lors de l\'envoi du commentaire.');
         }
     })
     .then(result => {
         // Afficher un message de succès
         alert("Bravo " + dataForm.get("pseudonym") + ", votre avis a été soumis avec succès !");
         document.location.href = "/";
     })
     .catch(error => {
         console.log('Erreur:', error);
         alert("Une erreur s'est produite lors de l'envoi de votre avis.");
     });
}
