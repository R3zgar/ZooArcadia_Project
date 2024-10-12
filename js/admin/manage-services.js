// Exemple d'ajout d'un service
document.getElementById('serviceForm').addEventListener('submit', function (event) {
    event.preventDefault();

    // Récupération des valeurs du formulaire
    const serviceName = document.getElementById('serviceNameInput').value;
    const serviceDescription = document.getElementById('serviceDescriptionInput').value;

    // Afficher les valeurs (c'est ici que tu pourras ajouter la logique pour envoyer les données à l'API backend ou les stocker localement)
    console.log('Service Name:', serviceName);
    console.log('Service Description:', serviceDescription);

    // Exemple de mise à jour du tableau (à remplacer par une vraie logique)
    const tableBody = document.querySelector('tbody');
    const newRow = `
        <tr>
            <td>${serviceName}</td>
            <td>${serviceDescription}</td>
            <td>
                <button class="btn btn-warning btn-sm">Modifier</button>
                <button class="btn btn-danger btn-sm">Supprimer</button>
            </td>
        </tr>
    `;
    tableBody.innerHTML += newRow;

    // Réinitialiser le formulaire après enregistrement
    document.getElementById('serviceForm').reset();
});
