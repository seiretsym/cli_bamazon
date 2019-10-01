// requires
var mysql = require("mysql");
var inquirer = require("inquirer");

// establish connection credentials and database
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "derp",
    database: "bamazonDB"
})

// connect!
connection.connect();

// divider
var divider = "\r\n";

// init program by asking the user to make a choice
function init() {
    inquirer.prompt([
        {
            type: "list",
            message: "What would you like to do?",
            choices: [
                "1: View Products for Sale",
                "2: View Low Inventory",
                "3: Add to Inventory",
                "4: Add a New Product",
                "5: Quit"
            ],
            name: "select"
        }
    ]).then(function(res, err) {
        // throw error if something breaks
        if (err) throw err;

        // get the number of the selected choice
        var option = parseInt(res.select[0]);

        // create a switch
        switch (option) {
            case 1:
                // print inventory
                showInventory();
                break;
            case 2:
                // print low inventory
                showLowInventory();
                break;
            case 3:
                // select product to add inventory
                addInventory();
                break;
            case 4:
                // add a new product
                addProduct();
                break;
            case 5:
                // quit
                quit();
                break;
        }
    });
}

// gets inventory data and prints it
function showInventory() {
    // get products
    var query = connection.query("SELECT * FROM products", function(err, res) {
        // error stuffs!
        if (err) {
            console.log(err)
        } else {
            // create header string
            var id = "ID";
            var item = "Item";
            var cat = "Category";
            var price = "Price";
            var amount = "Amount";
            var header = id.padEnd(5, " ") + item.padEnd(26, " ") + cat.padEnd(26, " ") + price.padEnd(11, " ") + amount.padEnd(10, " ")
            // print header
            console.log(header);
            console.log(divider.padStart(78, "-"));
            // check if there are products
            if (res !== undefined) {
                // print products
                res.forEach(function(item) {
                    // create formatted string
                    var string = item.id.padEnd(5, " ") + item.item_name.padEnd(26, " ") + item.category.padEnd(26, " ") + item.price.padEnd(11, " ") + item.quantity.padEnd(10, " ");
                    console.log(string);
                })
            }
            console.log(divider.padStart(78, "-"));
            init();
        }
    })
}

// gets inventory data and prints products that are low
function showLowInventory() {
    // connect to database

    // get products

    // identify low inventory

    // print low inventory products
}

// add inventory to a product
function addInventory() {
    // show list of products

    // add amount into inventory from input
}

// add a new product
function addProduct() {
    // prompt user for product information
}

// quit program
function quit() {
    console.log("Thanks for managing the products!")
    // close connection
    connection.end();
    return;
}

init();