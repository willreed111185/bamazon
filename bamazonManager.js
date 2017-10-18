const mysql = require("mysql");
const inquirer = require("inquirer");
const lowStockTrigger = 5;
let departmentArray=["grocery","dining","automotive","lawn","pharmacy"];

const connection = mysql.createConnection({
  host: "localhost",
  port: "8889",
  // Your username
  user: "root",
  // Your password
  password: "root",
  database: "bamazon"
});
connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
  console.log("++++++++++++++++++++++++++++++++++++++++++++++");
  console.log("+++++++++++++ Welcome to Bamazon +++++++++++++");
  console.log("++++++++++++++++++++++++++++++++++++++++++++++");
  console.log("++++++++ You're In The Manager Portal ++++++++");
  console.log("++++++++++++++++++++++++++++++++++++++++++++++");
  mgmtNavigation();
});


function mgmtNavigation(){
  inquirer.prompt([
      {
        type: "list",
        message: "What would you like me to manage?",
        choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory","Add New Product"],
        name: "trans"
      }
  ])
  .then(function(inquirerResponse) {
    switch(inquirerResponse.trans){
      case "View Products for Sale":
        queryAllProductsMGMT();
        break;
      case "View Low Inventory":
        queryLowInvintoryMGMT();
        break;
      case "Add to Inventory":
        updateInventoryMGMT();
        break;
      case "Add New Product":
        insertProductMGMT();
        break;
    }
  })
}

function queryAllProductsMGMT(){
  connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;
    console.log("++++++++++++++++++++++++++++++++++++++++++++++");
    console.log("++++++++++++++ Current Stock +++++++++++++++++");
    console.log("++++++++++++++++++++++++++++++++++++++++++++++");
    for (var i = 0; i < res.length; i++) {
      console.log("ID: "+res[i].id + " | Product Name: " + res[i].product_name + " | Department: " + res[i].department_name + " | Price: $" + res[i].price+ " | Qty: " + res[i].stock_quantity);
    }
    console.log("-----------------------------------"); 
    console.log("++++++++++++++++++++++++++++++++++++++++++++++");
    console.log("++++++++++++++++++++++++++++++++++++++++++++++");
    mgmtNavigation()
    return;
  });
}

function queryLowInvintoryMGMT() {
  console.log("LowTrigger: ",lowStockTrigger);
  connection.query("SELECT * FROM products where stock_quantity <= ?",[lowStockTrigger], function(err, res,field) {
    if (err) throw err;
    console.log("++++++++++++++++++++++++++++++++++++++++++++++");
    console.log("++++++++++++ Current Low Stock +++++++++++++++");
    console.log("++++++++++++++++++++++++++++++++++++++++++++++");
    for (var i = 0; i < res.length; i++) {
      console.log("ID: "+res[i].id + " | Product Name: " + res[i].product_name + " | Department: " + res[i].department_name + " | Price: $" + res[i].price+ " | Qty: " + res[i].stock_quantity);
    }
    console.log("-----------------------------------"); 
    console.log("++++++++++++++++++++++++++++++++++++++++++++++");
    console.log("++++++++++++++++++++++++++++++++++++++++++++++");
    mgmtNavigation();
    return;
  });
}

function updateInventoryMGMT(){
  connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;
    console.log("++++++++++++++++++++++++++++++++++++++++++++++");
    console.log("++++++++++++++ Current Stock +++++++++++++++++");
    console.log("++++++++++++++++++++++++++++++++++++++++++++++");
    for (var i = 0; i < res.length; i++) {
      console.log("ID: "+res[i].id + " | Product Name: " + res[i].product_name + " | Department: " + res[i].department_name + " | Price: $" + res[i].price+ " | Qty: " + res[i].stock_quantity);
    }
    console.log("-----------------------------------"); 
    console.log("++++++++++++++++++++++++++++++++++++++++++++++");
    console.log("++++++++++++++++++++++++++++++++++++++++++++++");
    console.log("This will add to the current invintory for a product (enter negative to subtract quantity).")
    inquirer.prompt([
    {
      name: "item",
      message: "ID?"
    }, {
      name: "qty",
      message: "Quantity?"
    }
    ]).then(function(answers) {
      let item = parseInt(answers.item);
      connection.query("SELECT * FROM products where id =?",[item], function(err1, res1) {
        if (err) throw err;
        let invintoryQty = parseInt(answers.qty)-parseInt(res1[0].stock_quantity);
        if(invintoryQty<=0){
        console.log("You dont have that much to give away!");
          mgmtNavigation();
          return;
        }else{
          let newQty = parseInt(res1[0].stock_quantity) + parseInt(answers.qty);
          console.log("Updating Bamazon_DB");
          connection.query("UPDATE products SET stock_quantity = ? WHERE id =?",[newQty,item], function(err, res) {
        console.log("Update Complete");
            mgmtNavigation();
            return;
          });
        }
      });
    });
  });
}

function insertProductMGMT(){
  inquirer.prompt([
      {
        type: "list",
        message: "Which department?",
        choices: departmentArray,
        name: "dept"
      },
      {
        type: "input",
        message: "Product Name?",
        name: "prod_name"
      },
      {
        type: "input",
        message: "Price?",
        name: "price"
      },
      {
        type: "input",
        message: "Quantity?",
        name: "quantity"
      }
  ]).then(function(res) {
      connection.query("INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES (?,?,?,?)",[res.prod_name,res.dept,res.price,res.quantity], function(err, res) {
        if (err) throw err;
        console.log("Your Item Has Been Added");
        mgmtNavigation();
        return;
      });
  });
}