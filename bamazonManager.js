// requires
var mysql = require("mysql");
var inquirer = require("inquirer");

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
    // connect to database

    // get products

    // print products
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
    return;
}

init();