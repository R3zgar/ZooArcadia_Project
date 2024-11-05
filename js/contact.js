(function() {
    emailjs.init("JCQqRbPV8QhBAFAAW");  
})();

document.getElementById('contactForm').addEventListener('submit', function(event) {
    event.preventDefault(); 
    
    // Récupérer le nom de l'expéditeur
    const nomExpediteur = document.getElementById('nameInput').value;

    emailjs.sendForm('service_2bkx9a8', 'template_9pni0j4', this)
      .then(function(response) {
         console.log('SUCCESS!', response.status, response.text);
         afficherAlerte(`${nomExpediteur}, votre message a été envoyé avec succès !`, 'success');
         reinitialiserFormulaire();
      }, function(error) {
         console.log('FAILED...', error);
         afficherAlerte('Une erreur est survenue lors de l\'envoi du message : ' + JSON.stringify(error), 'danger');
      });
});

// Fonction pour réinitialiser les champs du formulaire
function reinitialiserFormulaire() {
    document.getElementById('contactForm').reset();
}

// Fonction pour afficher une alerte Bootstrap
function afficherAlerte(message, type) {
    const alertContainer = document.getElementById('alertContainer');
    alertContainer.innerHTML = `
        <div class="alert alert-${type} alert-dismissible fade show" role="alert">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `;

    // Faire disparaître l'alerte après 7 secondes
    setTimeout(() => {
        const alertElement = alertContainer.querySelector('.alert');
        if (alertElement) {
            alertElement.classList.remove('show');
            alertElement.classList.add('fade');
            setTimeout(() => {
                alertElement.remove();
            }, 500); // Attendre la fin de l'animation de disparition
        }
    }, 7000);
}
