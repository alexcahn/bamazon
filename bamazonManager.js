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

            switch (answer.menu) {
                case "View Products for Sale":
                    printProductsFunction()
                    break;

                case "View Low Inventory":
                    lowInventory()
                    break;

                case "Add to Inventory":
                    addInventory()
                    break;

                case "Add New Product":
                    addNewProduct()
                    break;
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
        restart()
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
        restart()
    })
}

// Function to add new product
function addNewProduct() {
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
        .then(function (answer) {
            // when finished prompting, insert a new item into the db with that info
            connection.query(
                "INSERT INTO products SET ?",
                {
                    product_name: answer.Name,
                    department_name: answer.Department,
                    price: answer.Price,
                    stock_quantity: answer.Quantity
                },
                function (err) {
                    if (err) throw err;
                    console.log("Your Product was created successfully!");
                    addAnotherNewProduct();
                }
            );
        });
}

// Function to add another new product
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

// Function to return to main menu
function restart() {
    inquirer
        .prompt([
            {
                name: 'Restart',
                type: 'confirm',
                message: 'Would you like to return to the main menu?',
            }
        ])
        .then(function (answer) {
            var restart = answer.Restart;
            if (restart == true) {
                menuOptions();
            } else {
                connection.end();
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
            .then(function (answer) {
                var id = answer.ID;
                var quantity = answer.Quantity;
                processingAdd(id, quantity);
            })
    })
}

// Function to update db
function updateDb(newQuantity, id) {
    connection.query('UPDATE products SET stock_quantity=? WHERE item_id=?', [newQuantity, id], function (err, res) { }
    );
}

//Function to process adding inventory
function processingAdd(id, quantity) {
    connection.query('SELECT * FROM products WHERE item_id=?', [id], function (err, res) {
        if (err) {
            throw err;
        }
        var quantityNumber = parseInt(quantity);
        var newQuantity = res[0].stock_quantity + quantityNumber;
        updateDb(newQuantity, id);
        console.log("You successfully added " + quantityNumber + " to " + res[0].product_name + "!")
        getNewInput();
    });
}

// Function to ask to add another product
function getNewInput() {
    inquirer
        .prompt([
            {
                name: 'NewInput',
                type: 'confirm',
                message: 'Would you like to add another product?',
            }
        ])
        .then(function (answer) {
            var addAgain = answer.NewInput;
            if (addAgain == true) {
                addInventory();
            } else {
                connection.end();
            }
        })
}