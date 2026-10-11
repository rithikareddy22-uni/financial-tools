
const search = document.getElementById("search");
const menuCards = document.querySelectorAll(".menu-card");
const noResults = document.getElementById("noResults");
const cartItems = document.getElementById("cartItems");
const totalElement = document.getElementById("total");
const orderForm = document.getElementById("orderForm");
const orderResult = document.getElementById("orderResult");

const cart = {};

search.addEventListener("input", function () {
  const query = search.value.toLowerCase().trim();
  let visibleCount = 0;

  menuCards.forEach(function (card) {
    const matches = card.dataset.name.includes(query);
    card.hidden = !matches;

    if (matches) {
      visibleCount++;
    }
  });

  noResults.hidden = visibleCount !== 0;
});

document.querySelectorAll(".add").forEach(function (button) {
  button.addEventListener("click", function () {
    const name = button.dataset.item;
    const price = Number(button.dataset.price);

    if (cart[name]) {
      cart[name].quantity++;
    } else {
      cart[name] = { price: price, quantity: 1 };
    }

    renderCart();
  });
});

function renderCart() {
  cartItems.innerHTML = "";
  let total = 0;
  let itemCount = 0;

  Object.keys(cart).forEach(function (name) {
    const item = cart[name];
    const subtotal = item.price * item.quantity;

    total += subtotal;
    itemCount += item.quantity;

    const row = document.createElement("div");
    row.className = "cart-row";

    const description = document.createElement("span");
    description.textContent =
      name + " × " + item.quantity + " — ₹" + subtotal;

    const removeButton = document.createElement("button");
    removeButton.className = "remove";
    removeButton.textContent = "Remove";
    removeButton.type = "button";

    removeButton.addEventListener("click", function () {
      delete cart[name];
      renderCart();
    });

    row.append(description, removeButton);
    cartItems.appendChild(row);
  });

  if (itemCount === 0) {
    cartItems.textContent =
      "Your cart is empty. Add something delicious!";
  }

  totalElement.textContent = "₹" + total;
}

orderForm.addEventListener("submit", function (event) {
  event.preventDefault();

  if (Object.keys(cart).length === 0) {
    orderResult.textContent =
      "Please add at least one item to your cart.";
    return;
  }

  const name = document.getElementById("customerName").value.trim();
  const phone = document.getElementById("customerPhone").value.trim();
  const note = document.getElementById("orderNote").value.trim();

  let summary = "MUSAFIR CAFE - ORDER SUMMARY\n\n";
  summary += "Customer: " + name + "\n";
  summary += "Phone: " + phone + "\n\n";
  summary += "Items:\n";

  Object.keys(cart).forEach(function (itemName) {
    const item = cart[itemName];

    summary += itemName + " x " + item.quantity;
    summary += " = ₹" + item.price * item.quantity + "\n";
  });

  summary += "\nTotal: " + totalElement.textContent;

  if (note) {
    summary += "\nSpecial request: " + note;
  }

  orderResult.textContent = summary;

  const copyButton = document.createElement("button");
  copyButton.type = "button";
  copyButton.className = "button full-button";
  copyButton.textContent = "Copy Order Summary";

  copyButton.addEventListener("click", async function () {
    try {
      await navigator.clipboard.writeText(summary);
      copyButton.textContent = "Copied Successfully!";
    } catch (error) {
      orderResult.textContent =
        summary + "\n\nPlease select and copy the order summary.";
    }
  });

  orderResult.appendChild(document.createElement("br"));
  orderResult.appendChild(copyButton);
});