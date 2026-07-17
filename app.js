
const dateInput=document.getElementById('date');
const amountInput=document.getElementById('amount');
const total=document.getElementById('total');
const last=document.getElementById('lastDeposit');
const history=document.getElementById('history');

dateInput.value=new Date().toISOString().split('T')[0];

document.querySelectorAll('.quick-buttons button').forEach(btn=>{
  btn.addEventListener('click',()=>amountInput.value=btn.dataset.amt);
});

async function loadData(){
  try{
    const s=await fetch(API_URL+'?action=summary').then(r=>r.json());
    total.textContent='₹'+(s.total||0);
    if(s.lastDeposit){
      last.innerHTML=`<strong>₹${s.lastDeposit.amount}</strong><br>${s.lastDeposit.date}`;
    }else{
      last.textContent='No deposits yet';
    }

    const h=await fetch(API_URL+'?action=history').then(r=>r.json());
    history.innerHTML='';
    h.forEach(item=>{
      const row=document.createElement('div');
      row.style.padding='10px 0';
      row.style.borderBottom='1px solid #eee';
      row.innerHTML=`<strong>₹${item.amount}</strong><br><small>${item.date}</small>`;
      history.appendChild(row);
    });
  }catch(e){
    alert('Unable to connect to Google Sheet.');
    console.error(e);
  }
}

document.getElementById('saveBtn').addEventListener('click',async()=>{
  if(!amountInput.value){
    alert('Enter an amount');
    return;
  }

  const btn=document.getElementById('saveBtn');
  btn.disabled=true;
  btn.textContent='Saving...';

  try{
    await fetch(API_URL,{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({
        date:dateInput.value,
        amount:Number(amountInput.value)
      })
    });

    amountInput.value='';
    await loadData();
    alert('Deposit saved successfully.');
  }catch(e){
    alert('Failed to save deposit.');
  }

  btn.disabled=false;
  btn.textContent='Save Deposit';
});

loadData();
