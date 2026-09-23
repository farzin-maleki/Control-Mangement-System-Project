//* Cms -> Content Management System

let data = {
  users: [],

  products: [],
};

//default JS CODES

const paginationContainer = document.querySelector(".pagination");

const modalScreen = document.querySelector(".modal-screen");

const modalContainer = document.querySelector(".modal-screen .modal");

const toast = document.querySelector(".toast");

const processToast = document.querySelector(".process");

const toastContent = document.querySelector(".toast-content");

function savaLocalToData() {
  data = JSON.parse(localStorage.getItem("website-Data")) || data;
  const themeFromLocal = localStorage.getItem("theme");
  if (themeFromLocal === "dark") {
    document.documentElement.classList.add("dark");
    setThemeToDark();
  } else {
    document.documentElement.classList.remove("dark");
    setThemeToWhite();
  }
}

function saveDataToLocalStrg() {
  localStorage.setItem("website-Data", JSON.stringify(data));
}

function saveThemeToLocalStrg(key, value) {
  localStorage.setItem(key, value);
}

function openModal() {
  modalScreen.classList.remove("hidden");
  modalContainer.textContent = "";
}

function closeModal() {
  modalScreen.classList.add("hidden");
}

function openToast() {
  toast.classList.remove("hidden");
  toastContent.textContent = "";
  loadingToast();
}

function closeToast() {
  toast.classList.add("hidden");
}

function closeModalAndCancelation() {
  const closeModalBtn = document.querySelector(".close-modal");

  const cancelBtn = document.querySelector(".cancel");

  closeModalBtn.addEventListener("click", closeModal);

  cancelBtn.addEventListener("click", closeModal);
}

function loadingToast() {
  processToast.style.animation = "loading 4s linear";
  processToast.addEventListener("animationend", () => {
    closeToast();
    processToast.style.animation = "";
  });
}

// menu-toggling

const toggleMenu = document.querySelector(".toggle-sidebar");

toggleMenu.addEventListener("click", function () {
  document.querySelector(".sidebar").classList.toggle("open");
});

// changin the -Theme-

const themeBtn = document.querySelector(".theme-button");

function setThemeToDark() {
  themeBtn.firstElementChild.className = "fa fa-moon";
  saveThemeToLocalStrg("theme", "dark");
}

function setThemeToWhite() {
  themeBtn.firstElementChild.className = "fa fa-sun";
  saveThemeToLocalStrg("theme", "white");
}

themeBtn.addEventListener("click", () => {
  document.documentElement.classList.toggle("dark");
  if (themeBtn.firstElementChild.classList.contains("fa-sun")) {
    setThemeToDark();
  } else {
    setThemeToWhite();
  }
});

savaLocalToData();
