const productsNum = document.querySelectorAll(".products-data");

const usersNum = document.querySelector(".users-data");

const latestUsersContainer = document.querySelector(".latest-users");

const latestproductsContainer = document.querySelector(".table-body");

function updateUserNum() {
  usersNum.textContent = data.users.length;
}

function updateProductsNum() {
  productsNum.forEach((item) => {
    item.textContent = data.products.length;
  });
}

const editProduct = (event) => {
  const theChosenProductElem = event.target.closest(".tableRow");

  const productId = +theChosenProductElem.dataset.id;

  const mainProduct = data.products.find((product) => product.id === productId);

  openModal();

  modalContainer.insertAdjacentHTML(
    "beforeend",
    `
      <header class="modal-header">
        <h3>Edit product</h3>

        <button class="close-modal">
          <i class="fas fa-times"></i>
        </button>
      </header>

      <main class="modal-content">
        <input
          type="text"
          class="modal-input"
          placeholder="Enter a product title"
          id="product-title"
          value="${mainProduct.title}"
        />

        <input
          type="number"
          class="modal-input"
          placeholder="Enter a product price"
          id="product-price"
          value="${mainProduct.price}"
        />

        <input
          type="text"
          class="modal-input"
          placeholder="Enter a product slug"
          id="product-shortName"
          value="${mainProduct.slug}"
        />
      </main>

      <footer class="modal-footer">
        <button class="cancel">
          Cancel
        </button>

        <button class="submit">
          Confirm
        </button>
      </footer>
    `,
  );

  const submitBtn = modalContainer.querySelector(".submit");

  const productTitle = modalContainer.querySelector("#product-title");

  const productPrice = modalContainer.querySelector("#product-price");

  const productShortName = modalContainer.querySelector("#product-shortName");

  submitBtn.addEventListener("click", () => {
    if (
      productTitle.value.trim() &&
      productPrice.value &&
      productShortName.value.trim()
    ) {
      const isInProducts = data.products.some((product) => {
        return (
          product.id !== productId &&
          product.slug === productShortName.value.trim()
        );
      });

      if (isInProducts) {
        openToast();

        toast.classList.replace("success", "failed");

        toastContent.textContent = "This product slug already exists.";

        return;
      }

      mainProduct.title = productTitle.value.trim();

      mainProduct.price = +productPrice.value;

      mainProduct.slug = productShortName.value.trim();

      latestproductsContainer.innerHTML = "";

      for (let i = 0; i < 6; i++) {
        if (i > data.products.length - 1) {
          break;
        }
        latestproductsContainer.insertAdjacentHTML(
          "beforeend",
          `
        <div
          class="tableRow"
          data-id="${data.products[i].id}"
        >
          <p class="product-title">
            ${data.products[i].title}
          </p>

          <p class="product-price">
            ${data.products[i].price.toLocaleString()}
          </p>

          <p class="product-shortName">
            ${data.products[i].slug}
          </p>

          <div class="product-manage">
            <button
              class="edit-btn"
              onclick="editProduct(event)"
            >
              <i class="fas fa-edit"></i>
            </button>

            <button
              class="remove-btn"
              onclick="deleteProduct(event)"
            >
              <i class="fas fa-trash-alt"></i>
            </button>
          </div>
        </div>
      `,
        );
      }

      saveDataToLocalStrg();

      closeModal();

      openToast();

      toast.classList.replace("failed", "success");

      toastContent.textContent = "Product updated successfully.";
    } else {
      openToast();

      toast.classList.replace("success", "failed");

      toastContent.textContent = "Please complete all fields.";
    }
  });

  closeModalAndCancelation();
};

const deleteProduct = (event) => {
  const theChosenProductElem = event.target.closest(".tableRow");

  openModal();

  modalContainer.insertAdjacentHTML(
    "beforeend",
    `
      <i class="ui-border top red"></i>
      <i class="ui-border bottom red"></i>

      <header class="modal-header">
        <h3>Delete product</h3>

        <button class="close-modal">
          <i class="fas fa-times"></i>
        </button>
      </header>

      <main class="modal-content">
        <p class="remove-text">
          Are you sure you want to delete this product?
        </p>
      </main>

      <footer class="modal-footer">
        <button class="cancel">
          Cancel
        </button>

        <button class="submit">
          Confirm
        </button>
      </footer>
    `,
  );

  const confirmBtn = modalContainer.querySelector(".submit");

  confirmBtn.addEventListener("click", () => {
    const productIndex = data.products.findIndex(
      (product) => product.id === +theChosenProductElem.dataset.id,
    );

    data.products.splice(productIndex, 1);

    latestproductsContainer.innerHTML = "";

    for (let i = 0; i < 6; i++) {
      if (i > data.products.length - 1) {
        break;
      }
      latestproductsContainer.insertAdjacentHTML(
        "beforeend",
        `
        <div
          class="tableRow"
          data-id="${data.products[i].id}"
        >
          <p class="product-title">
            ${data.products[i].title}
          </p>

          <p class="product-price">
            ${data.products[i].price.toLocaleString()}
          </p>

          <p class="product-shortName">
            ${data.products[i].slug}
          </p>

          <div class="product-manage">
            <button
              class="edit-btn"
              onclick="editProduct(event)"
            >
              <i class="fas fa-edit"></i>
            </button>

            <button
              class="remove-btn"
              onclick="deleteProduct(event)"
            >
              <i class="fas fa-trash-alt"></i>
            </button>
          </div>
        </div>
      `,
      );
    }

    updateProductsNum();

    saveDataToLocalStrg();

    closeModal();

    openToast();

    toast.classList.replace("failed", "success");

    toastContent.textContent = "Product deleted successfully.";
  });

  closeModalAndCancelation();
};

function loadProducts() {
  for (let i = 0; i < 6; i++) {
    if (i > data.products.length - 1) {
      break;
    }
    latestproductsContainer.insertAdjacentHTML(
      "beforeend",
      `
            <div class="tableRow" data-id="${data.products[i].id}">
                <p class="product-title">${data.products[i].title}</p>
                <p class="product-price">${data.products[i].price.toLocaleString()}</p>
                <p class="product-shortName">${data.products[i].slug}</p>
                <div class="product-manage">
                  <button class="edit-btn" onclick="editProduct(event)">
                    <i class="fas fa-edit"></i>
                  </button>
                  <button class="remove-btn" onclick="deleteProduct(event)">
                    <i class="fas fa-trash-alt"></i>
                  </button>
                </div>
              </div>
        `,
    );
  }
}

loadProducts();
updateProductsNum();
updateUserNum();

for (let i = 0; i < 5; i++) {
  if (i > data.users.length - 1) {
    break;
  }
  latestUsersContainer.insertAdjacentHTML(
    "beforeend",
    `
            <article>
              
              <span class="icon-card">
                <i class="fa-solid fa-user"></i>
              </span>
              
              <div>
                <p class="user-name">${data.users[i].name}</p>
                <p class="user-email">${data.users[i].email}</p>
              </div>
            </article>
        `,
  );
}
