

(function() {
    emailjs.init("JCQqRbPV8QhBAFAAW");  
  })();
  
  document.getElementById('contactForm').addEventListener('submit', function(event) {
    event.preventDefault(); 
    emailjs.sendForm('service_2bkx9a8', 'template_9pni0j4', this)
      .then(function(response) {
         console.log('SUCCESS!', response.status, response.text);
         alert('Message envoyé avec succès!');
      }, function(error) {
         console.log('FAILED...', error);
         alert('Une erreur est survenue lors de l\'envoi du message: ' + JSON.stringify(error));
      });
  });
  