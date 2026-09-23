const productsContainer = document.querySelector(".table-body");
const productsNum = document.querySelector(".products-data");

let productsCurrentIndex = 1;
let productsPerPage = 6;

// ============================
// LOAD PRODUCTS
// ============================

function getProductsDataAndLoading() {
  const dataFromLocal = JSON.parse(localStorage.getItem("website-Data"));

  if (dataFromLocal) {
    data = dataFromLocal;
  }

  productsPaginationOnScreen();

  productsDataPagination(productsCurrentIndex, productsPerPage);

  updateProductsNum();
}

// ============================
// SHOW PRODUCTS
// ============================

function productsDataPagination(productsCurrentIndex, productsPerPage) {
  productsContainer.innerHTML = "";

  const startIndex = (productsCurrentIndex - 1) * productsPerPage;

  const endIndex = Math.min(startIndex + productsPerPage, data.products.length);

  for (let i = startIndex; i < endIndex; i++) {
    productsContainer.insertAdjacentHTML(
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
}

// ============================
// PAGINATION
// ============================

function productsPaginationOnScreen() {
  paginationContainer.innerHTML = "";

  for (let i = 1; i <= Math.ceil(data.products.length / productsPerPage); i++) {
    paginationContainer.insertAdjacentHTML(
      "beforeend",
      `
        <span
          data-page="${i}"
          class="page ${i === productsCurrentIndex ? "active" : ""}"
          onclick="goToProductPage(event)"
        >
          ${i}
        </span>
      `,
    );
  }
}

function goToProductPage(event) {
  productsCurrentIndex = +event.currentTarget.dataset.page;

  productsPaginationOnScreen();

  productsDataPagination(productsCurrentIndex, productsPerPage);
}

// ============================
// PRODUCTS COUNT
// ============================

function updateProductsNum() {
  productsNum.textContent = data.products.length;
}

// ============================
// EDIT PRODUCT
// ============================

window.editProduct = (event) => {
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

      productsDataPagination(productsCurrentIndex, productsPerPage);

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

// ============================
// DELETE PRODUCT
// ============================

window.deleteProduct = (event) => {
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

    const totalPages = Math.ceil(data.products.length / productsPerPage);

    if (productsCurrentIndex > totalPages) {
      productsCurrentIndex = Math.max(totalPages, 1);
    }

    productsPaginationOnScreen();

    productsDataPagination(productsCurrentIndex, productsPerPage);

    updateProductsNum();

    saveDataToLocalStrg();

    closeModal();

    openToast();

    toast.classList.replace("failed", "success");

    toastContent.textContent = "Product deleted successfully.";
  });

  closeModalAndCancelation();
};

// ============================
// ADD PRODUCT TO DATA
// ============================

function addProductToDataAndScreen(title, price, shortName) {
  const isInProducts = data.products.some((product) => {
    return product.slug === shortName;
  });

  if (isInProducts) {
    openToast();

    toast.classList.replace("success", "failed");

    toastContent.textContent = "This product slug already exists.";

    return false;
  }

  const newId =
    data.products.length === 0
      ? 1
      : Math.max(...data.products.map((product) => product.id)) + 1;

  const mainProduct = {
    id: newId,
    title: title,
    price: +price,
    slug: shortName,
  };

  data.products.push(mainProduct);

  productsPaginationOnScreen();

  productsDataPagination(productsCurrentIndex, productsPerPage);

  return true;
}

// ============================
// CREATE PRODUCT
// ============================

function createProduct() {
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
      const productCreated = addProductToDataAndScreen(
        productTitle.value.trim(),
        productPrice.value,
        productShortName.value.trim(),
      );

      if (!productCreated) {
        return;
      }

      saveDataToLocalStrg();

      updateProductsNum();

      closeModal();

      openToast();

      toast.classList.replace("failed", "success");

      toastContent.textContent = "Product created successfully.";
    } else {
      openToast();

      toast.classList.replace("success", "failed");

      toastContent.textContent = "Please complete all fields.";
    }
  });
}

// ============================
// CREATE PRODUCT BUTTON
// ============================

const createNewProductBtn = document.querySelector("#create-product");

createNewProductBtn.addEventListener("click", (event) => {
  event.preventDefault();

  openModal();

  modalContainer.insertAdjacentHTML(
    "beforeend",
    `
        <header class="modal-header">
          <h3>Create product</h3>

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
          />

          <input
            type="number"
            class="modal-input"
            placeholder="Enter a product price"
            id="product-price"
          />

          <input
            type="text"
            class="modal-input"
            placeholder="Enter a product slug"
            id="product-shortName"
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

  createProduct();

  closeModalAndCancelation();
});

// ============================
// INITIAL LOAD
// ============================
