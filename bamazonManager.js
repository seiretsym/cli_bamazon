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
        if (err) {
            // log error and close connection
            console.log(err);
            quit();
        } else {
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
        }
    });
}

// gets inventory data and prints it
function showInventory() {
    // get products
    var query = connection.query("SELECT * FROM products", function(err, res) {
        // error stuffs!
        if (err) {
            // log error and close connection;
            console.log(err);
            quit();
        } else {
            // print header
            printHeader();
            // check if there are products
            if (res !== undefined) {
                // print products
                res.forEach(function(item) {
                    // create formatted string
                    var string = String(item.id).padEnd(6, " ")
                               + String(item.item_name).padEnd(27, " ") 
                               + String(item.category).padEnd(27, " ") 
                               + String(parseFloat(item.price).toFixed(2)).padEnd(17, " ") 
                               + String(item.quantity).padEnd(10, " ");
                    console.log(string);
                })
            }
            // print divider
            printDivider();
            // re-init
            init();
        }
    })
}

// gets inventory data and prints products that are low
function showLowInventory() {
    // query database
    var query = connection.query("SELECT * FROM products WHERE ?",
    {
        quantity: 0
    },
    function(err, res) {
        if (err) {
            // log error and close connection
            console.log(err);
            quit();
        } else {
            // check if there are any items with quantity 0
            if (res.length < 1) {
                // tell user nothing is low
                console.log("You have no items in inventory that are low.")
                // re-init
                init()
            } else {
                // print header
                printHeader()
                // print low inventory products
                res.forEach(function(item) {
                    // create formatted string
                    var string = String(item.id).padEnd(6, " ")
                               + String(item.item_name).padEnd(27, " ") 
                               + String(item.category).padEnd(27, " ") 
                               + String(parseFloat(item.price).toFixed(2)).padEnd(17, " ") 
                               + String(item.quantity).padEnd(10, " ");
                    console.log(string);
                })
                // print divider
                printDivider()
                // re-init
                init();
            }
        }
    })
}

// add inventory to a product
function addInventory() {
    // show list of products

    // add amount into inventory from input
}

// add a new product
function addProduct() {
    // prompt user for product information
    inquirer.prompt([
        {
            type: "input",
            message: "Please enter the name of the item:",
            name: "item"
        },
        {
            type: "input",
            message: "Please enter the category of the item:",
            name: "cat"
        },
        {
            type: "input",
            message: "How much will this item cost per unit?",
            name: "price",
            validate: function(input) {
                // check if input is a float
                if (isNaN(parseFloat(input).toFixed(2))) {
                    return "Please enter a correct price amount.";
                } else {
                    return true;
                }
            }
        },
        {
            type: "input",
            message: "How many of these are you listing?",
            name: "amount",
            validate: function(input) {
                // check if input is an integer
                if (isNaN(parseInt(input))) {
                    return "Please enter a proper amount to list.";
                } else {
                    return true;
                }
            }
        }
    ]).then(function(res, err) {
        if (err) {
            // log error and close connection
            console.log(err);
            quit();
        } else {
            // add product to database
            var query = connection.query("INSERT INTO products SET ?",
            {
                item_name: res.item,
                category: res.cat,
                price: res.price,
                quantity: res.amount
            },
            function(err, item) {
                if (err) {
                    // log error and close connection
                    console.log(err);
                    quit();
                } else {
                    console.log(item.affectedRows + " new item added to the inventory.");
                    // re-init
                    init();
                }
            })
        }
    })
}

// quit program
function quit() {
    console.log("Thanks for managing the products!");
    // close connection
    connection.end();
    return;
}

// print header
function printHeader() {
    // create header string
    var id = "ID";
    var item = "Item";
    var cat = "Category";
    var price = "Price";
    var amount = "Amount";
    var divider = "";
    divider = divider.padEnd(5, "-") + " " 
            + divider.padEnd(26, "-") + " " 
            + divider.padEnd(26, "-") + " " 
            + divider.padEnd(16, "-") + " " 
            + divider.padEnd(10, "-");
    var header = id.padEnd(5, " ") + " " 
               + item.padEnd(26, " ") + " " 
               + cat.padEnd(26, " ") + " " 
               + price.padEnd(16, " ") + " " 
               + amount.padEnd(10, " ");
    // print header
    console.log(header);
    console.log(divider);
}

// print divider
function printDivider() {
    var divider = "\n";
    var dividerLength = 88;
    console.log(divider.padStart(dividerLength, "-"));
}

init();