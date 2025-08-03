const balance = document.getElementById("balance");
const money_plus = document.getElementById("money-plus");
const money_minus = document.getElementById("money-minus");
const list = document.getElementById("list");
const form = document.getElementById("form");
const text = document.getElementById("text");
const amount = document.getElementById("amount");

let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

const type = document.getElementById("type");

function addTransaction(e) {
  e.preventDefault();

  if (text.value.trim() === "" || amount.value.trim() === "") return;

  const sign = type.value === "expense" ? -1 : 1;

  const transaction = {
    id: Date.now(),
    text: text.value,
    amount: sign * +amount.value,
    date: new Date().toLocaleString(), // Add date and time
  };

  transactions.push(transaction);
  addToDOM(transaction);
  updateValues();
  updateLocalStorage();

  text.value = "";
  amount.value = "";
}


function addToDOM(transaction) {
  const sign = transaction.amount < 0 ? "-" : "+";
  const item = document.createElement("li");

  item.classList.add(transaction.amount < 0 ? "minus" : "plus");
  item.innerHTML = `
    ${transaction.text} 
    <span>${sign}Rs.${Math.abs(transaction.amount)}</span> 
    <button onclick="removeTransaction(${transaction.id})">x</button>
  `;
  list.appendChild(item);
  item.innerHTML = `${transaction.text} <span>${sign}Rs.${Math.abs(transaction.amount)} <small>${transaction.date}</small></span><button style="width:40px;,height:40px" class="btn btn-warning" onclick="removeTransaction(${transaction.id})">x</button>
`;

}

function updateValues() {
  const amounts = transactions.map(t => t.amount);
  const total = amounts.reduce((acc, val) => acc + val, 0).toFixed(2);
  const income = amounts
    .filter(val => val > 0)
    .reduce((acc, val) => acc + val, 0)
    .toFixed(2);
  const expense = (
    amounts.filter(val => val < 0).reduce((acc, val) => acc + val, 0) * -1
  ).toFixed(2);

  balance.innerText = `Rs.${total}`;
  money_plus.innerText = `+Rs.${income}`;
  money_minus.innerText = `-Rs.${expense}`;
}

function removeTransaction(id) {
  transactions = transactions.filter(t => t.id !== id);
  updateLocalStorage();
  init();
}

function updateLocalStorage() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

function init() {
  list.innerHTML = "";
  transactions.forEach(addToDOM);
  updateValues();
}

form.addEventListener("submit", addTransaction);
init();
