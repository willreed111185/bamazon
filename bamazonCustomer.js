var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
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
  //console.log("connected as id " + connection.threadId);
  console.log("++++++++++++++++++++++++++++++++++++++++++++++");
  console.log("+++++++++++++ Welcome to Bamazon +++++++++++++");
  console.log("++++++++++++++++++++++++++++++++++++++++++++++");
  console.log("+++++ Would you like to make a purchase? +++++");
  console.log("++++++++++++++++++++++++++++++++++++++++++++++");
  queryAllProducts();
});

function queryAllProducts() {
  connection.query("SELECT * FROM products", function(err, res) {
    console.log("++++++++++++++++++++++++++++++++++++++++++++++");
    console.log("++++++++++++++ Current Stock +++++++++++++++++");
    console.log("++++++++++++++++++++++++++++++++++++++++++++++");
    for (var i = 0; i < res.length; i++) {
      console.log("ID: "+res[i].id + " | Product Name: " + res[i].product_name + " | Department: " + res[i].department_name + " | Price: $" + res[i].price+ " | Qty: " + res[i].stock_quantity);
    }
    console.log("-----------------------------------"); 
      inquirer.prompt([
      {
        name: "item",
        message: "ID?"
      }, {
        name: "qty",
        message: "Quantity?"
      }
      ]).then(function(answers) {
      makePurchase(answers.item,answers.qty);
      });
  });
}

function makePurchase(in_item,in_qty){
  in_item = parseInt(in_item);
  connection.query("SELECT * FROM products where id =?",[in_item], function(err, res) {
    let itemName = res[0].product_name;
    if (in_qty>res[0].stock_quantity){
      console.log("++++++++++++++++++++++++++++++++++++++++++++++");
      console.log("+++++++++ We Have Insufficient Stock +++++++++");
      console.log("++++++++++++++++++++++++++++++++++++++++++++++");
      console.log("+++++++++ Please Place A New Order +++++++++++");
      console.log("++++++++++++++++++++++++++++++++++++++++++++++");
      queryAllProducts()
     return 0; 
    }else{
      let newQty = res[0].stock_quantity - in_qty;
      let total = in_qty*res[0].price;
      connection.query("UPDATE products SET stock_quantity = ? WHERE id =?",[newQty,in_item], function(err, res) {
        console.log("++++++++++++++++++++++++++++++++++++++++++++++");
        console.log("+++++++++ Thank you for your order! ++++++++++");
        console.log("+++++++++++ Your Total Is: $"+total);
        console.log("+++++++++++ You Purchased Item: "+itemName);
        console.log("+++++++++++ Your Quantity Is: "+in_qty);
        console.log("++++++++++++++++++++++++++++++++++++++++++++++");
        queryAllProducts()
        return 1;
      });
    }
  });
}

