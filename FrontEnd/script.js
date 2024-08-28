fetch("http://localhost:5678/api/works")
  .then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  })
  .then((data) => {
    const worksGallery = document.getElementsByClassName("gallery")[0]; // Sélectionne le premier élément avec la classe "gallery"

    data.forEach((work) => {
      const workElement = document.createElement("figure");

      workElement.innerHTML = `
        <img src="${work.imageUrl}" alt="${work.title}" />
        <figcaption>${work.title}</figcaption>
      `;

      worksGallery.appendChild(workElement);
    });
  })
  .catch((error) => {
    console.error("Erreur:", error);
  });
