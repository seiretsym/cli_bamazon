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
function printInvetory() {
    // query db for info
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) {
            console.log(err);
            quit();
        }
    }
}

// print the overhead stats
function printOverhead() {
    // query db for info
    connection.query("SELECT * FROM departments")
}

// get the department sales and returns profits
function returnProfitByDep(department) {

}

// quit program
function quit() {
    console.log("\nThanks for supervising the store!")
    connection.end();
}