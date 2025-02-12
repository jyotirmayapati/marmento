document.addEventListener("DOMContentLoaded", () => {
  const cartBody = document.getElementById("cart-body");
  const subtotalEl = document.getElementById("subtotal");
  const totalEl = document.getElementById("total");
  const checkoutBtn = document.getElementById("checkout");

  let cartItems = JSON.parse(localStorage.getItem("cart")) || [];

  fetch(
    "https://cdn.shopify.com/s/files/1/0883/2188/4479/files/apiCartData.json?v=1728384889"
  )
    .then((response) => response.json())
    .then((data) => {
      if (!cartItems.length) {
        cartItems = data.items;
      }
      renderCart();
    });

  function renderCart() {
    cartBody.innerHTML = "";
    let totalPrice = 0;

    cartItems.forEach((item, index) => {
      let itemSubtotal = (item.price / 100) * item.quantity;
      totalPrice += itemSubtotal;

      let row = document.createElement("tr");
      row.innerHTML = `
        <td class="item-details">
        <img src="${item.image}" width="50" class="item-image">
        <span class="item-title">${item.title}</span>
        </td>
        <td class="item-price">Rs. ${(item.price / 100).toFixed(2)}</td>
        <td>
        <input type="number" value="${item.quantity}" min="1" class="quantity" data-index="${index}">
        </td>
        <td class="item-subtotal">Rs. ${itemSubtotal.toFixed(2)}</td>
        <td><span class="remove" data-index="${index}" style="cursor:pointer; color: red;">🗑</span></td>
`;

      cartBody.appendChild(row);
    });

    subtotalEl.textContent = `Rs. ${totalPrice.toFixed(2)}`;
    totalEl.textContent = `Rs. ${totalPrice.toFixed(2)}`;

    document.querySelectorAll(".quantity").forEach((input) => {
      input.addEventListener("change", updateQuantity);
    });

    document.querySelectorAll(".remove").forEach((button) => {
      button.addEventListener("click", removeItem);
    });

    localStorage.setItem("cart", JSON.stringify(cartItems));
  }

  function updateQuantity(event) {
    let index = event.target.dataset.index;
    let newQuantity = parseInt(event.target.value);

    if (newQuantity < 1) {
      event.target.value = 1;
      newQuantity = 1;
    }

    cartItems[index].quantity = newQuantity;
    renderCart();
  }

  function removeItem(event) {
    let index = event.target.dataset.index;

    let modal = document.createElement("div");
    modal.classList.add("modal");
    modal.innerHTML = `
      <div class="modal-content">
        <p>Are you sure you want to remove this item?</p>
        <button id="confirm-remove">Yes</button>
        <button id="cancel-remove">No</button>
      </div>
    `;
    document.body.appendChild(modal);

    document.getElementById("confirm-remove").addEventListener("click", () => {
      cartItems.splice(index, 1);
      renderCart();
      modal.remove();
    });

    document.getElementById("cancel-remove").addEventListener("click", () => {
      modal.remove();
    });
  }

  checkoutBtn.addEventListener("click", () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    let successMessage = document.createElement("div");
    successMessage.classList.add("success-message");
    successMessage.innerHTML = "🎉 Your order has been placed successfully!";
    document.body.appendChild(successMessage);

    setTimeout(() => {
      successMessage.classList.add("fade-out");
      setTimeout(() => successMessage.remove(), 500);
    }, 2000);

    localStorage.removeItem("cart");
    cartItems = [];
    renderCart();
  });
});
