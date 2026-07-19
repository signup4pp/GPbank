// ===============================
// Gayathri's Piggy Bank
// app.js (GET Version)
// ===============================

const API_URL = "https://script.google.com/macros/s/AKfycbw0kzELWSOMg8MXcuqtqzATQyeiib3oAOOFtEhg2G2xDk06Z22F40z4NLHVfZ0rD/exec";

const balance = document.getElementById("balance");
const depositDate = document.getElementById("depositDate");
const amount = document.getElementById("amount");
const saveBtn = document.getElementById("saveBtn");
const lastAmount = document.getElementById("lastAmount");
const lastDate = document.getElementById("lastDate");

// Set today's date
depositDate.valueAsDate = new Date();

// ------------------------------
// Format Date
// ------------------------------
function formatDate(dateValue) {

    const d = new Date(dateValue);

    const days = [
        "Sun","Mon","Tue",
        "Wed","Thu","Fri","Sat"
    ];

    const months = [
        "January","February","March",
        "April","May","June",
        "July","August","September",
        "October","November","December"
    ];

    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()} (${days[d.getDay()]})`;

}

// ------------------------------
// Load Balance
// ------------------------------
async function loadSummary(){

    try{

        const res = await fetch(API_URL + "?action=summary");

        const data = await res.json();

        balance.textContent = "₹" + (data.total || 0);

        if(data.lastDeposit){

            lastAmount.textContent =
            "₹" + data.lastDeposit.amount;

            lastDate.textContent =
            data.lastDeposit.date;

        }

    }
    catch(err){

        alert("Unable to load data.");

        console.log(err);

    }

}

// ------------------------------
// Save Deposit
// ------------------------------
saveBtn.addEventListener("click", async ()=>{

    if(amount.value==""){

        alert("Enter amount");

        return;

    }

    const date = formatDate(depositDate.value);

    saveBtn.disabled = true;

    saveBtn.innerText = "Saving...";

    try{

        const url =
        API_URL +
        "?action=add" +
        "&date=" +
        encodeURIComponent(date) +
        "&amount=" +
        encodeURIComponent(amount.value);

        const res = await fetch(url);

        const result = await res.json();

        if(result.status=="success"){

            amount.value="";

            await loadSummary();

            alert("Money Added");

        }
        else{

            alert(result.message);

        }

    }
    catch(err){

        alert("Unable to save.");

        console.log(err);

    }

    saveBtn.disabled=false;

    saveBtn.innerText="Add Money";

});

// ------------------------------
// Start App
// ------------------------------
loadSummary();