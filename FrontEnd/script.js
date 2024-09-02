let allWorks = [];
let allCategories = [];
let ismodalOpened = false;

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
    displayWorksOnModal(allWorks);
    displayWorks(allWorks);
  })
  .catch((error) => {
    console.error("Erreur:", error);
  });

// Function to display all works
function displayWorks(works) {
  const worksGallery = document.getElementById("gallery");
  worksGallery.innerHTML = "";

  works.forEach((work) => {
    const workElement = document.createElement("figure");

    workElement.innerHTML = `
      <img src="${work.imageUrl}" alt="${work.title}" />
      <figcaption>${work.title}</figcaption>
    `;

    worksGallery.appendChild(workElement);
  });
}

// Get All Categories
fetch("http://localhost:5678/api/categories")
  .then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  })
  .then((data) => {
    allCategories = data;
    displayFilter(allCategories);
  })
  .catch((error) => {
    console.error("Erreur:", error);
  });

// Function to display all categories
function displayFilter(categories) {
  if (!localStorage.getItem("token")) {
    const filters = document.getElementById("filters");

    // Generate the all button
    const allButton = document.createElement("button");
    allButton.textContent = "Tous";
    allButton.addEventListener("click", () => filterWorks("all"));
    filters.appendChild(allButton);

    // Generate others buttons
    categories.forEach((category) => {
      const categoryElement = document.createElement("button");
      categoryElement.textContent = category.name;
      categoryElement.setAttribute("data-category-id", category.id);
      categoryElement.addEventListener("click", () => filterWorks(category.id));

      filters.appendChild(categoryElement);
    });
  }
}

// Function to display works according to their categories
function filterWorks(category) {
  if (category === "all") {
    displayWorks(allWorks);
  } else {
    const filteredWorks = allWorks.filter((work) => work.category.id === category);
    displayWorks(filteredWorks);
  }
}

// Function to display items only when user is logged in
isLoggedDisplay();

function isLoggedDisplay() {
  if (localStorage.getItem("token")) {
    // Display login or logout
    const loginNavBtn = document.getElementById("login-nav-btn");
    loginNavBtn.classList.add("hide-nav-btn");
    const logoutNavBtn = document.getElementById("logout-nav-btn");
    logoutNavBtn.addEventListener("click", () => logout());

    const editBtn = document.getElementById("editWorks");
    const editIcon = document.createElement("i");
    editIcon.className = "fa-regular fa-pen-to-square";
    const editSpan = document.createElement("span");
    editSpan.textContent = "Modifier";

    editSpan.addEventListener("click", () => openModal());

    editBtn.appendChild(editIcon);
    editBtn.appendChild(editSpan);
  } else {
    const logoutNavBtn = document.getElementById("logout-nav-btn");
    logoutNavBtn.classList.add("hide-nav-btn");
  }
}

function logout() {
  localStorage.clear();
}

function openModal() {
  ismodalOpened = true;
}

// Display all works on modal
function displayWorksOnModal(works) {
  const modalWorks = document.getElementById("modal-works");
  modalWorks.innerHTML = "";

  works.forEach((work) => {
    const workElement = document.createElement("figure");

    workElement.innerHTML = `
      <img src="${work.imageUrl}" alt="${work.title}" />
      <i id="delete" class="fa-solid fa-trash-can"></i>
    `;

    modalWorks.appendChild(workElement);
  });
}
