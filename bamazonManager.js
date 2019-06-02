//Dependencies
var mysql = require('mysql');
var inquirer = require('inquirer');


//Start connection to db
var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'Flyers1*',
    database: 'bamazon'
});
connection.connect(function (err) {
    if (err) throw err;
    // printProductsFunction();
    console.log("connected")
    menuOptions();
});

// Function that lists menu options
function menuOptions() {
    inquirer
        .prompt([
            {
                name: "menu",
                type: "list",
                choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]
            },
        ])
        .then(function (answer) {

            if (answer.menu === "View Products for Sale") {
                printProductsFunction();
            } else if (answer.menu === "View Low Inventory") {
                lowInventory();
            } else if (answer.menu === "Add to Inventory") {
                addInventory();
            }else if (answer.menu === "Add New Product"){
                addNewProduct();
            }
        })
}



// Function the lists products for sale
function printProductsFunction() {
    connection.query('SELECT * FROM products', function (err, res) {
        for (var i = 0; i < res.length; i++) {
            console.log(
                'ID: ' +
                res[i].item_id +
                ' | ' +
                'Product: ' +
                res[i].product_name +
                ' | ' +
                'Price: $' +
                res[i].price +
                ' | ' +
                'QTY: ' +
                res[i].stock_quantity +
                '\n' +
                '--------------------------------------------------------------------'
            );
        }
    });
}


// Function to view low inventory
function lowInventory() {
    connection.query('SELECT * FROM products', function (err, res) {

        if (err) {
            throw err;
        }

        for (var i = 0; i < res.length; i++) {
            if (res[i].stock_quantity < 5) {
                console.log(res[i].product_name + " is low on stock with only " + res[i].stock_quantity + " items available.")
            }
        }
    })
}



// Function to add inventory
function addInventory() {
    connection.query('SELECT * FROM products', function (err, res) {
        inquirer
            .prompt([
                {
                    name: 'ID',
                    type: 'input',
                    message: 'What is the ID of the product you would like to add inventory to?',
                    validate: function (value) {
                        if (isNaN(value) === false) {
                            return true;
                        }
                        return false;
                    }
                },
                {
                    name: 'Quantity',
                    type: 'input',
                    message: 'How many units would you like to add?',
                    validate: function (value) {
                        if (isNaN(value) === false) {
                            return true;
                        }
                        return false;
                    }
                }
            ])
            .then(function (answer, id) {
                connection.query('SELECT * FROM products WHERE item_id=?', [id], function (err, res) {
                if (err) {
                    throw err;
                }
                var id = answer.ID;
                var quantity = answer.Quantity
                var currentStock;

                for (var i = 0; i < res.length; i++){
                    if (id == res[i])
                currentStock = res[i].stock_quantity + quantity
                console.log(currentStock)
                    }
                    // updateDb(currentStock, id)
                })
            })
})
}

// Function to update db
function updateDb(currentStock, id) {
    connection.query('UPDATE products SET stock_quantity=? WHERE item_id=?', [currentStock, id], function (err, res) { }
    );
}


// Function to add new product
function addNewProduct(){
    inquirer
    .prompt([
        {
            name: 'Name',
            type: 'input',
            message: 'What is the name of the product you would like to add?',
        },
        {
            name: 'Department',
            type: 'input',
            message: 'Which department does this product belong?',
        },
        {
            name: 'Price',
            type: 'input',
            message: 'How much does this product cost?',
        },
        {
            name: 'Quantity',
            type: 'input',
            message: 'What is the stock quantity you would like to add?',
        }
    ])
    .then(function(answer) {
        // when finished prompting, insert a new item into the db with that info
        connection.query(
          "INSERT INTO products SET ?",
          {
            product_name: answer.Name,
            department_name: answer.Department,
            price: answer.Price,
            stock_quantity: answer.Quantity
          },
          function(err) {
            if (err) throw err;
            console.log("Your Product was created successfully!");
            addAnotherNewProduct();
          }
        );
      });
}

function addAnotherNewProduct() {
    inquirer
        .prompt([
            {
                name: 'NewInput',
                type: 'confirm',
                message: 'Would you like to add another item?',
            }
        ])
        .then(function (answer) {
            var addAnother = answer.NewInput;
            if (addAnother == true) {
                addNewProduct();
            } else {
                connection.end();
            }
        })
}


// Function to return to 



// Function to process adding more items
