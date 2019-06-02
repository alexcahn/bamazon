var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Flyers1*",
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) throw err;
    afterConnection()
});

function afterConnection() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        console.log('Welcome to Bamazon!')
        console.log('----------------------------------------------------------------------------------------------------')

        for (var i = 0; i < res.length; i++) {
            console.log("ID: " + res[i].item_id + " | " + "Product: " + res[i].product_name + " | " + "Department: " + res[i].department_name + " | " + "Price: $" + res[i].price + " | " + "QTY: " + res[i].stock_quantity);
            console.log('--------------------------------------------------------------------------------------------------')
        }
        start()
        connection.end();
    });
}

function start(err, res) {

    if (err) throw err;
    inquirer
        .prompt([
            {
                name: "ID",
                type: "input",
                message: "What is the ID of the product you would like to buy?",
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            },
            {
                name: "Quantity",
                type: "input",
                message: "How many units would you like buy?",
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            }
        ]).then(function (answer) {
        })
}




// console.log('_.~"~._.~"~._.~Welcome to BAMazon~._.~"~._.~"~._')
// console.log('----------------------------------------------------------------------------------------------------')

// for (var i = 0; i < res.length; i++) {
//     console.log("ID: " + res[i].item_id + " | " + "Product: " + res[i].product_name + " | " + "Department: " + res[i].department_name + " | " + "Price: " + res[i].price + " | " + "QTY: " + res[i].stock_quantity);
//     console.log('--------------------------------------------------------------------------------------------------')
// }