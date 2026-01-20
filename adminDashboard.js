// ================= ADMIN DASHBOARD =================
document.addEventListener('DOMContentLoaded',()=>{

// Elements
const loginDiv = document.getElementById('loginDiv');
const dashboard = document.getElementById('dashboard');
const loginBtn = document.getElementById('loginBtn');
const fMonth = document.getElementById('fMonth');
const fType = document.getElementById('fType');
const fCategory = document.getElementById('fCategory');
const fMin = document.getElementById('fMin');
const fMax = document.getElementById('fMax');
const fNotes = document.getElementById('fNotes');
const txTbody = document.getElementById('txTbody');
const resetFilter = document.getElementById('resetFilter');
const addTxBtn = document.getElementById('addTxBtn');

// LocalStorage key
const KEY_TX = "selelo_tx_local";
let transactions = JSON.parse(localStorage.getItem(KEY_TX)||"[]");

// Sample categories
const incomeCategories = ["Room Rental","Parking Fees","Sales","Other Income"];
const expenseCategories = ["Rent","Electricity","Internet","Salaries","Other expenses"];

[...new Set([...incomeCategories,...expenseCategories])].forEach(c=>{
  const o = document.createElement('option');
  o.value = o.textContent = c;
  fCategory.appendChild(o);
});

// ================== ADMIN LOGIN ==================
loginBtn.addEventListener('click', () => {
  const username = document.getElementById('adminUser').value;
  const password = document.getElementById('adminPass').value;

  if(username === "admin" && password === "admin123"){
    loginDiv.style.display = "none";
    dashboard.style.display = "block";
    renderTransactions();
  } else {
    alert("Invalid admin credentials!");
  }
});

// ================== FILTER & SEARCH ==================
function passesFilters(t){
  if(fMonth.value && !t.date.startsWith(fMonth.value)) return false;
  if(fType.value && t.type!==fType.value) return false;
  if(fCategory.value && t.category!==fCategory.value) return false;
  const min=parseFloat(fMin.value)||-Infinity;
  const max=parseFloat(fMax.value)||Infinity;
  if(t.amount<min||t.amount>max) return false;
  const q=(fNotes.value||"").toLowerCase();
  if(q && !(t.notes||"").toLowerCase().includes(q)) return false;
  return true;
}

function renderTransactions(){
  txTbody.innerHTML = "";
  transactions.filter(passesFilters).forEach((t,i)=>{
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${t.date}</td>
      <td>${t.type}</td>
      <td>${t.category}</td>
      <td>KES ${Number(t.amount).toLocaleString()}</td>
      <td>${t.notes||""}</td>
      <td>
        <button onclick="editTx(${i})">Edit</button>
        <button onclick="deleteTx(${i})">Delete</button>
      </td>
    `;
    txTbody.appendChild(tr);
  });
}

// ================== ADD / EDIT / DELETE ==================
window.addTx = function(){
  const date = prompt("Enter date YYYY-MM-DD");
  const type = prompt("Type (Income/Expense)");
  const category = prompt("Category");
  const amount = parseFloat(prompt("Amount"));
  const notes = prompt("Notes");

  if(date && type && category && !isNaN(amount)){
    transactions.push({date,type,category,amount,notes});
    localStorage.setItem(KEY_TX,JSON.stringify(transactions));
    renderTransactions();
  }
};

window.editTx = function(index){
  const t = transactions[index];
  const date = prompt("Edit date", t.date);
  const type = prompt("Edit type", t.type);
  const category = prompt("Edit category", t.category);
  const amount = parseFloat(prompt("Edit amount", t.amount));
  const notes = prompt("Edit notes", t.notes);

  if(date && type && category && !isNaN(amount)){
    transactions[index] = {date,type,category,amount,notes};
    localStorage.setItem(KEY_TX,JSON.stringify(transactions));
    renderTransactions();
  }
};

window.deleteTx = function(index){
  if(confirm("Delete this transaction?")){
    transactions.splice(index,1);
    localStorage.setItem(KEY_TX,JSON.stringify(transactions));
    renderTransactions();
  }
};

// Add transaction button
addTxBtn.addEventListener('click', addTx);

// ================== LIVE SEARCH ==================
["input","change"].forEach(ev=>{
  fMonth.addEventListener(ev,renderTransactions);
  fType.addEventListener(ev,renderTransactions);
  fCategory.addEventListener(ev,renderTransactions);
  fMin.addEventListener(ev,renderTransactions);
  fMax.addEventListener(ev,renderTransactions);
  fNotes.addEventListener(ev,renderTransactions);
});

// ================== RESET FILTER ==================
resetFilter.addEventListener('click',()=>{
  fMonth.value = "";
  fType.value = "";
  fCategory.value = "";
  fMin.value = "";
  fMax.value = "";
  fNotes.value = "";
  renderTransactions();
});

// ================== SAMPLE DATA ==================
if(!transactions.length){
  transactions=[
    {date:"2025-01-05",type:"Income",category:"Room Rental",amount:30000,notes:"January rent"},
    {date:"2025-01-10",type:"Expense",category:"Electricity",amount:4500,notes:"KPLC bill"},
    {date:"2025-01-15",type:"Expense",category:"Internet",amount:3200,notes:"Safaricom fiber"}
  ];
  localStorage.setItem(KEY_TX,JSON.stringify(transactions));
}
});
