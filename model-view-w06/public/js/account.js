

// Get a list of items in inventory based on the classification_id 
let accountList = document.querySelector("#accountList")
console.log("REACHED");
accountList.addEventListener("change", function () { 
 let account_id = accountList.value 
 console.log("account_id is: "+account_id) 
 let classIdURL = "/account/getAccount/"+account_id 
 console.log(classIdURL);

 fetch(classIdURL) 
 .then(function (response) { 
  if (response.ok) { 
   return response.json(); 
  } 
  throw Error("Network response was not OK"); 
 }) 
 .then(function (data) { 
  console.log(data); 
  buildAccountList(data); 
 }) 
 .catch(function (error) { 
  console.log('There was a problem: ', error.message) 
 }) 
})

// Build inventory items into HTML table components and inject into DOM 
function buildAccountList(data) { 
    let inventoryDisplay = document.getElementById("accountsTable"); 
    // Set up the table labels 
    let dataTable = '<thead>'; 
    dataTable += '<tr><td><strong>Account Name</strong></td><td>&nbsp;</td><td>&nbsp;</td></tr>'; 
    dataTable += '</thead>'; 
    // Set up the table body 
    dataTable += '<tbody>'; 
    console.log("Data before loop "+data.account_firstname);
    // Iterate over all vehicles in the array and put each in a row 
   

    
     
     console.log(data.account_firstname + ", " + data.account_lastname); 
     dataTable += `<tr><td>${data.account_firstname} ${data.account_lastname}</td>`; 
     dataTable += `<td><a href='/account/update/${data.account_id}' title='Click to update'>Modify</a></td>`; 
     dataTable += `<td><a href='/account/delete/${data.account_id}' title='Click to delete'>Delete</a></td></tr>`; 
    
    dataTable += '</tbody>'; 
    // Display the contents in the Inventory Management view 
    inventoryDisplay.innerHTML = dataTable; 
   }