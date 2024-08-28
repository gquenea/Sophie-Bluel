let allWorks = [];

// Get All Works
fetch("http://localhost:5678/api/works")
  .then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  })
  .then((data) => {
    allWorks = data;
    displayWorks(allWorks);
  })
  .catch((error) => {
    console.error("Erreur:", error);
  });

// Function to display all works
function displayWorks(works) {
  const worksGallery = document.getElementById("gallery");
  worksGallery.innerHTML = ""; // Efface le contenu existant de la galerie

  works.forEach((work) => {
    const workElement = document.createElement("figure");

    workElement.innerHTML = `
      <img src="${work.imageUrl}" alt="${work.title}" />
      <figcaption>${work.title}</figcaption>
    `;

    worksGallery.appendChild(workElement);
  });
}

// Filter works by category
document.getElementById("filter-all").addEventListener("click", () => filterWorks("all"));
document.getElementById("filter-objects").addEventListener("click", () => filterWorks(1));
document.getElementById("filter-appartments").addEventListener("click", () => filterWorks(2));
document.getElementById("filter-hotels").addEventListener("click", () => filterWorks(3));

function filterWorks(category) {
  if (category === "all") {
    displayWorks(allWorks);
  } else {
    const filteredWorks = allWorks.filter((work) => work.category.id === category);
    displayWorks(filteredWorks);
  }
}
