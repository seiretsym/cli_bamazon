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

// gets inventory data and prints it
function showInventory() {
    // get products
    connection.query("SELECT * FROM products", function(err, res) {
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
                // item counter
                var items = 0;
                // print products
                res.forEach(function(item) {
                    // create formatted string
                    var string = String(item.id).padEnd(6, " ")
                               + String(item.item_name).padEnd(27, " ") 
                               + String(item.category).padEnd(27, " ") 
                               + String(parseFloat(item.price).toFixed(2)).padEnd(17, " ") 
                               + String(item.quantity).padEnd(10, " ");
                    console.log(string);
                    items++
                })
            }
            // print divider
            printDivider();
            // prompt for purchase
            beginPurchase(items);
        }
    })
    
}


// print header
function printHeader() {
    // create header string
    var id = "ID";
    var item = "Item";
    var cat = "Category";
    var price = "Price";
    var amount = "Available";
    var divider = String(" ").padStart(6, "-") +
                  String(" ").padStart(27, "-") +
                  String(" ").padStart(27, "-") +
                  String(" ").padStart(17, "-") +
                  String(" ").padStart(11, "-");
    var header = id.padEnd(5, " ") + " " 
               + item.padEnd(26, " ") + " " 
               + cat.padEnd(26, " ") + " " 
               + price.padEnd(16, " ") + " " 
               + amount.padEnd(10, " ");
    // print header
    console.log(header);
    // print divider
    console.log(divider);
}

// print divider
function printDivider() {
    var divider = "\n";
    var dividerLength = 88;
    console.log(divider.padStart(dividerLength, "-"));
}

// function to prompt user for item id
function beginPurchase(itemCount) {
    // ask user for item id
    inquirer.prompt(
        {
            type: "input",
            message: "Enter Item ID to purchase [Q to QUIT]:",
            name: "id",
            validate: function(input) {
                if (input.toLowerCase() === "q") {
                    return true;
                } else if (isNaN(input)) {
                    return "Please enter a correct Item ID";
                } else if (parseInt(input) > itemCount || parseInt(input) < 1) {
                    return "An item with that ID cannot be found";
                } else {
                    return true;
                }
            }
        }
    ).then(function(item, err) {
        if (err) {
            console.log(err);
            quit();
        } else if (item.id.toLowerCase() === "q") {
            quit();
        } else {
            // asks for amount
            closePurchase(item.id)
        }
    })
}

// function to prompt user for amount
function closePurchase(itemid) {
    inquirer.prompt(
        {
            type: "input",
            message: "How many would you like to purchase? [Q TO QUIT]:",
            name: "num",
            validate: function(input) {
                if (input.toLowerCase() === "q") {
                    return true;
                } else if (input.toLowerCase() !== "q" && isNaN(input)) {
                    return "Please enter a correct Item ID";
                } else {
                    return true;
                }
            }
        }
    ).then(function(amount, err) {
        if (err) {
            console.log(err);
            quit();
        } else if (amount.num.toLowerCase() === "q") {
            quit();
        } else {
            // check if amount is available
            connection.query("SELECT * FROM products WHERE ?", {id: itemid}, function(err, res) {
                if (err) {
                    console.log(err);
                    quit()
                } else {
                    if (parseInt(amount.num) <= parseInt(res[0].quantity)) {
                        var newAmount = parseInt(res[0].quantity) - parseInt(amount.num);
                        var newSold = parseInt(res[0].items_sold) + parseInt(amount.num);
                        // sell items and update database
                        connection.query("UPDATE products SET ? WHERE ?",
                        [
                            {
                                quantity: newAmount,
                                items_sold: newSold
                            },
                            {
                                id: itemid
                            }
                        ])
                        // re-init
                        showInventory();
                    } else {
                        // not enough available
                        console.log("\nThere isn't enough of that product in stock!\n");
                        // re-init
                        showInventory();
                    }
                }
            })
        }
    })
}

// quit program
function quit() {
    console.log("\nThanks for purchasing products!");
    // close connection
    connection.end();
    return;
}

showInventory();