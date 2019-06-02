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
    printProductsFunction();

});

//Function that displays product inventory
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
                'Department: ' +
                res[i].department_name +
                ' | ' +
                'Price: $' +
                res[i].price +
                ' | ' +
                'QTY: ' +
                res[i].stock_quantity +
                '\n' +
                '--------------------------------------------------------------------------------------------------'
            );
        }
        selectProducts();
    });
}

//Function for users to select products they'd like to purchase
function selectProducts() {
    inquirer
        .prompt([
            {
                name: 'ID',
                type: 'input',
                message: 'What is the ID of the product you would like to buy?',
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
                message: 'How many units would you like buy?',
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
            if ((id, quantity)) {
                processingPurchase(id, quantity);
            }
        });
}

//Function to process the purcharse
function processingPurchase(id, quantity) {
    connection.query('SELECT * FROM products WHERE item_id=?', [id], function (
        err,
        res
    ) {
        if (err) {
            throw err;
        }
        var currentStock;
        var price;
        var total;
        if (quantity <= res[0].stock_quantity) {
            currentStock = res[0].stock_quantity - quantity;
            updateDb(currentStock, id);
            price = res[0].price;
            total = price * quantity;

            console.log('Your total is: ' + total);

            getNewInput();

        } else {
            console.log('Insufficient Quantity, please try again.');
            selectProducts()
        }
    });
}

//Function to update database
function updateDb(currentStock, id) {
    connection.query(
        'UPDATE products SET stock_quantity=? WHERE item_id=?',
        [currentStock, id],
        function (err, res) { }
    );
}

// Ask user if they would like to make another purchase
function getNewInput() {
    inquirer
        .prompt([
            {
                name: 'NewInput',
                type: 'confirm',
                message: 'Would you like to make another purchase?',
            }
        ])
        .then(function (answer) {
            var buyAgain = answer.NewInput;
            if (buyAgain == true) {
                selectProducts();
            } else {
                connection.end();
            }
        })
}