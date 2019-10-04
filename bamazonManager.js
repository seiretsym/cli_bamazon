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
                // print products
                res.forEach(function(item) {
                    // create formatted string
                    var string = String(item.item_id).padEnd(6, " ")
                               + String(item.item_name).padEnd(27, " ") 
                               + String(item.category).padEnd(27, " ") 
                               + String(parseFloat(item.price).toFixed(2)).padEnd(17, " ") 
                               + String(item.quantity).padEnd(11, " ")
                               + String(item.items_sold).padEnd(10, " ");
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
    connection.query("SELECT * FROM products WHERE ?",
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
                    var string = String(item.item_id).padEnd(6, " ")
                               + String(item.item_name).padEnd(27, " ") 
                               + String(item.category).padEnd(27, " ") 
                               + String(parseFloat(item.price).toFixed(2)).padEnd(17, " ") 
                               + String(item.quantity).padEnd(11, " ")
                               + String(item.items_sold).padEnd(10, " ");
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
    // show list of items
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
                // print products
                res.forEach(function(item) {
                    // create formatted string
                    var string = String(item.item_id).padEnd(6, " ")
                               + String(item.item_name).padEnd(27, " ") 
                               + String(item.category).padEnd(27, " ") 
                               + String(parseFloat(item.price).toFixed(2)).padEnd(17, " ") 
                               + String(item.quantity).padEnd(11, " ")
                               + String(item.items_sold).padEnd(10, " ");
                    console.log(string);
                })
            }
            // print divider
            printDivider();
            // re-init
        }

        // prompt user for item ID
        inquirer.prompt([
            {
                type: "input",
                message: "Enter the ID of the item you want to restock:",
                name: "id",
                validate: function(input) {
                    if (isNaN(input) || input === "") {
                        return "Please enter the ID number.";
                    } else {
                        return true;
                    }
                }
            },
        ]).then(function(res, err) {        
            if (err) {
                // log error and disconnect
                console.log(err);
                quit()
            } else {
                // check if item exists
                connection.query("SELECT * FROM products WHERE ?",
                {
                    item_id: res.id
                },
                function(qErr, qRes) {
                    if (qErr) {
                        // log error and disconnect
                        console.log(qErr);
                        quit()
                    }
                    // item doesn't exist so...
                    else if (qRes.length < 1) {
                        // tell them
                        console.log("\nCannot find an item with the ID: " + res.id + "\n")
                        // re-init
                        init()
                    } else {
                        // prompt user for amount
                        inquirer.prompt([
                            {
                                type: "input",
                                message: "How many would you like to add?",
                                name: "amount",
                                validate: function(input) {
                                    // check if it's a number
                                    if (isNaN(input) || parseInt(input) <= 0 || input == "") {
                                        return "Please enter a valid number";
                                    } else {
                                        return true;
                                    }
                                }
                            }
                        ]).then(function(iRes, iErr) {
                            if (iErr) {
                                // log error and disconnect
                                console.log(iErr);
                                quit();
                            } else {
                                // add new amount to current amount
                                var newAmount = parseInt(qRes[0].quantity) + parseInt(iRes.amount);
                                // push to database
                                connection.query("UPDATE products SET ? WHERE ?",
                                [
                                    {
                                        quantity: newAmount
                                    },
                                    {
                                        item_id: res.id
                                    }
                                ],
                                function(err2, res2) {
                                    if (err2) {
                                        // log error and disconnect
                                        console.log(err2);
                                        quit();
                                    } else {
                                        // let them know
                                        console.log("\n" + res2.affectedRows + " item quantity updated!\n");
                                        // re-init
                                        init();
                                    }
                                })
                            }
                        })
                    }
                })
            }
        })
    });
}

// add a new product
function addProduct() {
    // prompt user for product information
    inquirer.prompt([
        {
            type: "input",
            message: "Please enter the name of the item:",
            name: "item",
            validate: function(input) {
                if (input === "") {
                    return "Item needs a name, so give it one!";
                } else {
                    return true;
                }
            }
        },
        {
            type: "input",
            message: "Please enter the category of the item:",
            name: "cat",
            validate: function(input) {
                if (input === "") {
                    return "Item needs a name, so give it one!";
                } else {
                    return true;
                }
            }
        },
        {
            type: "input",
            message: "How much will this item cost per unit?",
            name: "price",
            validate: function(input) {
                // check if input is a float
                if (isNaN(parseFloat(input)) || parseFloat(input) < 1 || input === "") {
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
                if (isNaN(parseInt(input)) || parseInt(input) < 1 || input === "") {
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
            connection.query("INSERT INTO products SET ?",
            {
                item_name: res.item,
                category: res.cat,
                price: res.price,
                quantity: res.amount,
                items_sold: 0
            },
            function(err, item) {
                if (err) {
                    // log error and close connection
                    console.log(err);
                    quit();
                } else {
                    console.log("\n" + item.affectedRows + " new item added to the inventory.\n");
                    // re-init
                    init();
                }
            })
        }
    })
}

// quit program
function quit() {
    console.log("\nThanks for managing the products!");
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
    var amount = "Available";
    var sold = "Total Sold";
    var divider = String(" ").padStart(6, "-") +
                  String(" ").padStart(27, "-") +
                  String(" ").padStart(27, "-") +
                  String(" ").padStart(17, "-") +
                  String(" ").padStart(11, "-") +
                  String("").padStart(10, "-");
    var header = id.padEnd(5, " ") + " " 
               + item.padEnd(26, " ") + " " 
               + cat.padEnd(26, " ") + " " 
               + price.padEnd(16, " ") + " " 
               + amount.padEnd(10, " ") + " "
               + sold.padEnd(10, " ");
    // print header
    console.log(header);
    // print divider
    console.log(divider);
}

// print divider
function printDivider() {
    var divider = "\n";
    var dividerLength = 99;
    console.log(divider.padStart(dividerLength, "-"));
}

init();