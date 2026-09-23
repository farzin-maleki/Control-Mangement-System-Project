const usersContainer = document.querySelector(".table-body");

const usersNum = document.querySelector(".users-data");

let usersCurrentIndex = 1;

let usersPerPage = 6;

function getUsersDataAndLoading() {
  const dataFromLocal = JSON.parse(localStorage.getItem("website-Data"));

  if (dataFromLocal) {
    data = dataFromLocal;
  }

  paginationOnScreen();

  usersDataPagination(usersCurrentIndex, usersPerPage);

  updateUserNum();
}

function usersDataPagination(usersCurrentIndex, usersPerPage) {
  usersContainer.innerHTML = "";

  const startIndex = (usersCurrentIndex - 1) * usersPerPage;

  const endIndex = Math.min(startIndex + usersPerPage, data.users.length);

  for (let i = startIndex; i < endIndex; i++) {
    usersContainer.insertAdjacentHTML(
      "beforeend",
      `
            <div class="tableRow" data-id="${data.users[i].id}">
                  <p class="user-fullName">${data.users[i].name}</p>
                  <p class="user-username">${data.users[i].username}</p>
                  <p class="user-email">${data.users[i].email}</p>
                  <p class="user-password">${data.users[i].password}</p>
                  <div class="product-manage">
                    <button class="edit-btn" onclick="editUser(event)">
                      <i class="fas fa-edit"></i>
                    </button>
                    <button class="remove-btn" onclick="deleteUser(event)">
                      <i class="fas fa-ban"></i>
                    </button>
                  </div>
            </div>
          `,
    );
  }
}

function paginationOnScreen() {
  paginationContainer.innerHTML = "";
  for (let i = 1; i <= Math.ceil(data.users.length / usersPerPage); i++) {
    paginationContainer.insertAdjacentHTML(
      "beforeend",
      `
        <span data-page="${i}" class="page ${i === usersCurrentIndex ? "active" : ""}" onclick="goToPage(event)">${i}</span>
      `,
    );
  }
}

function goToPage(event) {
  const allPages = document.querySelectorAll(".page");

  const chosenElem = event.currentTarget;

  allPages.forEach((page) => {
    page.classList.remove("active");
  });

  chosenElem.classList.add("active");

  usersCurrentIndex = +chosenElem.dataset.page;

  usersDataPagination(usersCurrentIndex, usersPerPage);
}

const updateUserNum = () => {
  usersNum.textContent = data.users.length;
};

window.editUser = (event) => {
  openModal();
  const theChosenUserElem = event.target.closest(".tableRow");
  const mainProduct = data.users.find(
    (user) => user.id === +theChosenUserElem.dataset.id,
  );
  modalContainer.insertAdjacentHTML(
    "beforeend",
    `
        <header class="modal-header">
          <h3>Edit user</h3>
          <button class="close-modal">
            <i class="fas fa-times"></i>
          </button>
        </header>
        <main class="modal-content">
          <input
            type="text"
            class="modal-input"
            placeholder="Enter a full name"
            id="user-fullName"
            value ="${mainProduct.name}"
          />
          <input
            type="text"
            class="modal-input"
            id="user-username"
            placeholder="Enter a username"
            value ="${mainProduct.username}"
          />
          <input
            type="email"
            class="modal-input"
            id="user-email"
            placeholder="Enter an email address"
            value ="${mainProduct.email}"
          />
          <input
          type="password"
          class="modal-input"
          id="user-password"
          placeholder="Enter a password"
          value ="${mainProduct.password}"
        />
        </main>
        <footer class="modal-footer">
          <button class="cancel">Cancel</button>
          <button class="submit">Confirm</button>
        </footer>
      `,
  );
  const submitBtn = modalContainer.querySelector(".submit");
  const fullName = modalContainer.querySelector("#user-fullName");
  const userName = modalContainer.querySelector("#user-username");
  const email = modalContainer.querySelector("#user-email");
  const password = modalContainer.querySelector("#user-password");
  submitBtn.addEventListener("click", () => {
    if (
      fullName.value.trim() &&
      userName.value.trim() &&
      email.value.trim() &&
      password.value
    ) {
      const isInUsers = data.users.some(
        (user) =>
          user.id !== +theChosenUserElem.dataset.id &&
          (user.username === userName.value.trim() ||
            user.email === email.value.trim()),
      );
      if (isInUsers) {
        openToast();
        toast.classList.replace("success", "failed");
        toastContent.textContent =
          "That username or email already exists. Please try again.";
      } else {
        const mainUser = data.users.find(
          (user) => user.id === +theChosenUserElem.dataset.id,
        );
        mainUser.name = fullName.value.trim().toLowerCase();
        mainUser.username = userName.value.trim();
        mainUser.email = email.value.trim();
        mainUser.password = password.value;
        usersDataPagination(usersCurrentIndex, usersPerPage);

        openToast();
        toast.classList.replace("failed", "success");
        toastContent.textContent = "Changes saved successfully.";
        saveDataToLocalStrg();
        closeModal();
      }
    } else {
      openToast();
      toast.classList.replace("success", "failed");
      toastContent.textContent = "Please complete all fields.";
    }
  });

  closeModalAndCancelation();
};

window.deleteUser = (event) => {
  const theChosenUserElem = event.target.closest(".tableRow");

  openModal();

  modalContainer.insertAdjacentHTML(
    "beforeend",
    `
      <i class="ui-border top red"></i>
      <i class="ui-border bottom red"></i>

      <header class="modal-header">
        <h3>Delete user</h3>

        <button class="close-modal">
          <i class="fas fa-times"></i>
        </button>
      </header>

      <main class="modal-content">
        <p class="remove-text">
          Are you sure you want to delete this user?
        </p>
      </main>

      <footer class="modal-footer">
        <button class="cancel">Cancel</button>
        <button class="submit">Confirm</button>
      </footer>
    `,
  );

  const confirmBtn = modalContainer.querySelector(".submit");

  confirmBtn.addEventListener("click", () => {
    const userIndex = data.users.findIndex(
      (user) => user.id === +theChosenUserElem.dataset.id,
    );

    data.users.splice(userIndex, 1);

    paginationOnScreen();

    usersDataPagination(usersCurrentIndex, usersPerPage);

    updateUserNum();

    saveDataToLocalStrg();

    closeModal();

    openToast();

    toast.classList.replace("failed", "success");

    toastContent.textContent = "Changes saved successfully.";
  });

  closeModalAndCancelation();
};

const addUserToDataAndScreen = (fullname, username, email, password) => {
  const isInUsers = data.users.some((user) => {
    if (user.username === username || user.email === email) {
      return true;
    }
  });
  if (isInUsers) {
    openToast();
    toast.classList.replace("success", "failed");
    toastContent.textContent =
      "That username or email already exists. Please try again.";
  } else {
    const newId =
      data.users.length === 0
        ? 1
        : Math.max(...data.users.map((user) => user.id)) + 1;
    const mainUser = {
      id: newId,
      name: fullname,
      username: username,
      email: email,
      password: password,
    };
    data.users.push(mainUser);

    paginationOnScreen();

    usersDataPagination(usersCurrentIndex, usersPerPage);
  }
};

const createUser = () => {
  const submitBtn = modalContainer.querySelector(".submit");
  const fullName = modalContainer.querySelector("#user-fullName");
  const userName = modalContainer.querySelector("#user-username");
  const email = modalContainer.querySelector("#user-email");
  const password = modalContainer.querySelector("#user-password");

  submitBtn.addEventListener("click", () => {
    closeModal();
    if (
      fullName.value.trim() &&
      userName.value.trim() &&
      email.value.trim() &&
      password.value
    ) {
      openToast();
      toast.classList.replace("failed", "success");
      toastContent.textContent = "Changes saved successfully.";
      addUserToDataAndScreen(
        fullName.value,
        userName.value,
        email.value,
        password.value,
      );
      saveDataToLocalStrg();
      updateUserNum();
    } else {
      openToast();
      toast.classList.replace("success", "failed");
      toastContent.textContent = "Please complete all fields.";
    }
  });
};

const createNewUserBtn = document.querySelector("#create-user");

createNewUserBtn.addEventListener("click", () => {
  openModal();
  modalContainer.insertAdjacentHTML(
    "beforeend",
    `
        <header class="modal-header">
              <h3>Create user</h3>
              <button class="close-modal">
                <i class="fas fa-times"></i>
              </button>
            </header>
            <main class="modal-content">
              <input
                type="text"
                class="modal-input"
                placeholder="Enter a full name"
                id="user-fullName"
              />
              <input
                type="text"
                class="modal-input"
                id="user-username"
                placeholder="Enter a username"
              />
              <input
                type="email"
                class="modal-input"
                id="user-email"
                placeholder="Enter an email address"
              />
              <input
              type="password"
              class="modal-input"
              id="user-password"
              placeholder="Enter a password"
            />
            </main>
            <footer class="modal-footer">
              <button class="cancel">Cancel</button>
              <button class="submit">Confirm</button>
            </footer>
    `,
  );

  createUser();

  closeModalAndCancelation();
});
