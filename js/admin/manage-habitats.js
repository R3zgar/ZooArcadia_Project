const myHeaders = new Headers();
myHeaders.append("X-AUTH-TOKEN", "••••••");  // Postman'de kullandığınız token buraya eklenmeli

const requestOptions = {
  method: "GET",
  headers: myHeaders,
  redirect: "follow"
};

// Envoyer la requête fetch pour récupérer les habitats
fetch("https://127.0.0.1:8000/api/habitat", requestOptions)
  .then(response => {
    if (!response.ok) {  // Contrôle des erreurs HTTP
      throw new Error("Erreur HTTP: " + response.status);
    }
    return response.json();  // Conversion de la réponse en JSON
  })
  .then(result => {
    console.log(result);  // Affichage des résultats dans la console

    // Traiter les données reçues et les afficher
    const tableBody = document.querySelector("#manage-habitats tbody");

    if (result && result.length > 0) {
      result.forEach(function(habitat) {
        const row = `
          <tr>
            <td>${habitat.nom_habitat}</td>
            <td>${habitat.description_habitat}</td>
            <td><a href="veterinaire-rapport.html?habitat_id=${habitat.id}" class="btn btn-info btn-sm">Voir le rapport</a></td>
            <td>
              <button class="btn btn-warning btn-sm">Modifier</button>
              <button class="btn btn-danger btn-sm">Supprimer</button>
            </td>
          </tr>
        `;
        tableBody.innerHTML += row;
      });
    } else {
      tableBody.innerHTML = "<tr><td colspan='4' class='text-center'>Aucun habitat trouvé.</td></tr>";
    }
  })
  .catch(error => {
    console.error('Erreur de fetch:', error);  // Gestion des erreurs dans la console
    alert("Erreur lors de la récupération des habitats.");
  });
