let allWorks = [];
let allCategories = [];

//////////////////////////////////////////////////////////////////////// Works ////////////////////////////////////////////////////////////////////////

// Initial function calls to populate the gallery and modal with works
async function initializeWorks() {
  allWorks = await getAllWorks();
  displayWorks();
  displayWorksOnModal();
}

initializeWorks();

// Get All Works
async function getAllWorks() {
  try {
    const response = await fetch("http://localhost:5678/api/works");

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(
      "Une erreur s'est produite lors de la récupération des projets. :",
      error.message
    );
    alert("Une erreur s'est produite lors de la récupération des projets.");
  }
}

// Function to display all works
async function displayWorks(works = allWorks) {
  try {
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
  } catch (error) {
    console.error(
      "Une erreur s'est produite lors de l'affichage des projets. :",
      error.message
    );
    alert("Une erreur s'est produite lors de l'affichage des projets.");
  }
}

//////////////////////////////////////////////////////////////////////// Filters ////////////////////////////////////////////////////////////////////////

displayFilter();

async function getAllCategories() {
  try {
    const response = await fetch("http://localhost:5678/api/categories");

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(
      "Une erreur s'est produite lors de la récupération des catégories. :",
      error.message
    );
    alert("Une erreur s'est produite lors de la récupération des catégories.");
  }
}

// Function to display all categories
async function displayFilter() {
  try {
    const categories = await getAllCategories();

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
        categoryElement.addEventListener("click", () =>
          filterWorks(category.id)
        );

        filters.appendChild(categoryElement);
      });
    }
  } catch (error) {
    console.error(
      "Une erreur s'est produite lors de l'affichage des catégories. :",
      error.message
    );
    alert("Une erreur s'est produite lors de l'affichage des catégories.");
  }
}

// Function to display works according to their categories
function filterWorks(category) {
  if (category === "all") {
    displayWorks();
  } else {
    const filteredWorks = allWorks.filter(
      (work) => work.category.id === category
    );
    displayWorks(filteredWorks);
  }
}

//////////////////////////////////////////////////////////////////////// Login / Logout ////////////////////////////////////////////////////////////////////////

isLoggedDisplay();

// Function to display items only when user is logged in
function isLoggedDisplay() {
  if (localStorage.getItem("token")) {
    // Display edition banner
    const body = document.getElementsByTagName("body")[0];
    body.insertAdjacentHTML(
      "afterbegin",
      `<div id="edition-banner">
      <i class="fa-regular fa-pen-to-square"></i>
      <p>Mode édition</p>
    </div>`
    );
    body.style.paddingTop = "50px";

    // Display login or logout
    const loginNavBtn = document.getElementById("login-nav-btn");
    loginNavBtn.classList.add("hide-nav-btn");
    const logoutNavBtn = document.getElementById("logout-nav-btn");
    logoutNavBtn.addEventListener("click", () => logout());

    // Display edit button and his icon
    const editBtn = document.getElementById("editWorks");
    const editIcon = document.createElement("i");
    editIcon.className = "fa-regular fa-pen-to-square";
    const editSpan = document.createElement("span");
    editSpan.textContent = "Modifier";

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

//////////////////////////////////////////////////////////////////////// Modal ////////////////////////////////////////////////////////////////////////

const modal = document.getElementById("modal");
const firstModalContent = document.querySelector(".first-modal");
const openModalBtn = document.getElementById("editWorks");
const closeModalBtn = document.querySelectorAll(".close");
const openEditModal = document.getElementById("add-photo-btn");
const addWorkModal = document.querySelector(".add-work-modal");
const backArrow = document.querySelector(".back-arrow");

displayCategoriesOnSelect();

// Function to display categories on select input
async function displayCategoriesOnSelect() {
  const categorySelect = document.getElementById("category-select");

  const emptyOption = document.createElement("option");
  emptyOption.value = "";
  emptyOption.textContent = "";
  categorySelect.appendChild(emptyOption);
  emptyOption.selected = true;
  emptyOption.disabled = true;

  const categories = await getAllCategories();
  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category.id;
    option.textContent = category.name;

    categorySelect.appendChild(option);
  });
}

// Function to open works modal
openModalBtn.addEventListener("click", () => {
  modal.style.display = "block";
  firstModalContent.style.display = "block";
});

// Function to open edit modal
openEditModal.addEventListener("click", () => {
  addWorkModal.style.display = "block";
  firstModalContent.style.display = "none";
});

// function to back to the first modal
backArrow.addEventListener("click", () => {
  firstModalContent.style.display = "block";
  addWorkModal.style.display = "none";
});

// Function to close modal
closeModalBtn.forEach((button) => {
  button.addEventListener("click", () => {
    modal.style.display = "none";
    addWorkModal.style.display = "none";
  });
});
// Function to close modal if user click outside
window.addEventListener("click", (event) => {
  if (event.target == modal) {
    modal.style.display = "none";
    addWorkModal.style.display = "none";
  }
});

// Function to display all works on modal
async function displayWorksOnModal() {
  try {
    const works = await getAllWorks();
    const modalWorks = document.getElementById("modal-works");
    modalWorks.innerHTML = "";

    works.forEach((work) => {
      const workElement = document.createElement("figure");

      workElement.innerHTML = `
        <img src="${work.imageUrl}" alt="${work.title}" />
        <i class="fa-solid fa-trash-can delete-work"></i>
      `;

      workElement
        .querySelector(".delete-work")
        .addEventListener("click", async (event) => {
          event.preventDefault();
          await deleteWork(work.id);
          workElement.remove();
        });

      modalWorks.appendChild(workElement);
    });
  } catch (error) {
    console.error(
      "Une erreur s'est produite lors de l'affichage des projets. :",
      error.message
    );
    alert("Une erreur s'est produite lors de l'affichage des projets.");
  }
}

// Function to delete a work
async function deleteWork(workId) {
  try {
    const response = await fetch(`http://localhost:5678/api/works/${workId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) {
      throw new Error("Erreur lors de la suppression du work");
    } else if (response) allWorks = await getAllWorks();
    displayWorks();
    displayWorksOnModal();
    alert("Projet supprimé avec succès !");
  } catch (error) {
    console.error(
      "Une erreur s'est produite lors de la suppression d'un projet. :",
      error.message
    );
    alert("Une erreur s'est produite lors de la suppression d'un projet.");
  }
}

// Function to display the image preview
const fileInput = document.getElementById("file-input");
const label = document.querySelector(".file-input");
let imageSelected = false;

fileInput.addEventListener("click", function () {
  imageSelected = false;
});

fileInput.addEventListener("change", function () {
  if (fileInput.files && fileInput.files.length > 0) {
    imageSelected = true;

    let reader = new FileReader();
    reader.onload = function (e) {
      let img = document.createElement("img");
      img.src = e.target.result;
      label.innerHTML = "";
      label.appendChild(img);
    };
    reader.readAsDataURL(fileInput.files[0]);
  } else if (!imageSelected) {
    resetImageInput();
  }
});

// Function to reset image field
function resetImageInput() {
  fileInput.value = "";
  label.innerHTML = `
    <i class="fa-regular fa-image"></i>
    <div class="upload-button">+ Ajouter photo</div>
    <div class="file-info">jpg, png : 4mo max</div>
  `;
}

document
  .getElementById("work-form")
  .addEventListener("submit", async (event) => {
    event.preventDefault();
    await addWork();
  });

const titleInput = document.getElementById("title");
const categorySelect = document.getElementById("category-select");
const submitButton = document.querySelector('input[type="submit"]');

submitButton.disabled = true;
submitButton.classList.add("disabled");

// Function to check the validity of the form
function checkFormValidity() {
  const isTitleFilled = titleInput.value.trim() !== "";
  const isCategorySelected = categorySelect.value !== "";
  const isFileSelected = fileInput.files.length > 0;

  if (isTitleFilled && isCategorySelected && isFileSelected) {
    submitButton.disabled = false;
    submitButton.classList.remove("disabled");
  } else {
    submitButton.disabled = true;
    submitButton.classList.add("disabled");
  }
}

titleInput.addEventListener("input", checkFormValidity);
categorySelect.addEventListener("change", checkFormValidity);
fileInput.addEventListener("change", checkFormValidity);

// Function to create a work
async function addWork() {
  let formData = new FormData();

  if (fileInput.files && fileInput.files.length > 0) {
    formData.append("image", fileInput.files[0]);
  }
  formData.append("title", titleInput.value);
  formData.append("category", categorySelect.value);

  try {
    const response = await fetch("http://localhost:5678/api/works", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: formData,
    });

    allWorks = await getAllWorks();
    displayWorks();
    displayWorksOnModal();
    resetForm();

    if (!response.ok) {
      throw new Error("Échec de l'ajout du projet");
    }

    alert("Projet ajouté avec succès !");
  } catch (error) {
    console.error(
      "Une erreur s'est produite lors de la création d'un projet. :",
      error.message
    );
    alert("Une erreur s'est produite lors de la création d'un projet.");
  }
}

// Function to reset the form
function resetForm() {
  document.getElementById("work-form").reset();
  document.querySelector(".file-input").innerHTML =
    '<i class="fa-regular fa-image"></i><div class="upload-button">+ Ajouter photo</div><div class="file-info">jpg, png : 4mo max</div>';
  const categorySelect = document.getElementById("category-select");
  categorySelect.selectedIndex = 0;
  submitButton.disabled = true;
  submitButton.classList.add("disabled");
}
