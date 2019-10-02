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

// print inventory
function printInventory() {
    // query db for info
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) {
            console.log(err);
            quit();
        } else {
            // create header
            var header = String("ID").padEnd(6, " ") +
                          String("Item").padEnd(27, " ") +
                          String("Category").padEnd(27, " ") +
                          String("Price").padEnd(17, " ") +
                          String("Available").padEnd(17, " ") +
                          String("Total Sold").padEnd(11, " ");
            // create divider
            var divider = String(" ").padStart(6, "-") +
                          String(" ").padStart(27, "-") +
                          String(" ").padStart(27, "-") +
                          String(" ").padStart(17, "-") +
                          String(" ").padStart(17, "-") +
                          String(" ").padStart(11, "-");
            // print them
            console.log(header);
            console.log(divider);
            // iterate through results
            res.forEach(function(item) {
                // create string
                var string = String(item.item_id).padEnd(6, " ") +
                             String(item.item_name).padEnd(27, " ") +
                             String(item.category).padEnd(27, " ") +
                             String(parseFloat(item.price).toFixed(2)).padEnd(17, " ") +
                             String(item.quantity).padEnd(17, " ") +
                             String(item.items_sold).padEnd(11, " ");
                // print string
                console.log(string);
            })
            // print bottom divider
            printDivider(105)
        }
    })
    init();
}

// prompt user for input
function init() {
    inquirer.prompt(
        {
            type: "list",
            message: "What would you like to do?"
            choices: ["View Department Overhead", "Add New Department", "Quit"],
            name: "choice"
        }
    ).then(function(res, err) {
        if (err) {
            console.log(err);
            quit()
        } else {
            // create switch for choices
            switch (res.choice) {
                case "View Department Overhead":
                    // print the department overhead
                    printOverhead()
                    break;
                case "Add New Department":
                    // add a new department
                    addDepartment();
                    break;
                case "Quit":
                    // byebye!
                    quit();
                    break;
            }
        }
    })
}

// print the overhead stats
function printOverhead() {
    // query db for info
    connection.query("SELECT * FROM departments", function(err, res) {
        if (err) {
            console.log(err);
            quit();
        } else {
            // create header

            // create divider

            // print them

            // iterate through departments
            res.forEach(function(object) {
                var profit = returnProfitByDep(object.department.name);
                // create string
            })
        }
    })
    // re-init
    init();
}

// get the department sales and returns profits
function returnProfitByDep(department) {

}

// add a new department
function addDepartment() {

}

// quit program
function quit() {
    console.log("\nThanks for supervising the store!")
    connection.end();
}

// print divider
function printDivider(length) {
    var divider = "\n";
    var dividerLength = length;
    console.log(divider.padStart(dividerLength, "-"));
}

init();