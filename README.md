# CLI Bamazon

## Summary
A series of programs written in javascript to run on node. They simulate a store from three perspectives: customer, manager, supervisor. Each program utilizes the same database to read/write/modify information. 

### **Highlights:**
- Node.js
- MySQL
- Promise
- Formatting Strings
- Custom Callback Function

## Dependencies
- inquirer
- mysql

## Goals
- Learn about `async` and `await`

## Learning Experience
- Learned to read/write from/to a database using mysql
- Learned to use Promises to deal with asynchronous issues

## Demo Videos
bamazonCustomer: https://youtu.be/HMUMCm5gi7c
bamazonManager: https://youtu.be/Fv-6ZAFtLU4
bamazonSupervisor: https://youtu.be/CHumTUBYQd8

## Code Snippets
This snippet shows the usage of String.padEnd and String.padStart to format strings for a legibly enhanced output

```
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
```

This function takes user input to add a new row to an existing table
```
// add a new product
function addProduct() {
    // inquirer portion omitted
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
```
Made my own callback function to return specific data
```
// get the department sales and returns profits
function returnProfitByDep(object, callback) {
    // read database for department items
    connection.query("SELECT * FROM departments INNER JOIN products ON department_name = category WHERE ?",
        {
            department_name: object.department_name
        }, function(err, res) {
            if (err) {
                console.log(err);
                quit();
            }
            // account for departments with products
            else if (res.length > 0) {
                var profit = 0 - parseFloat(res[0].overhead_costs).toFixed(2);
                var items = 0;
                res.map(function(item) {
                    profit += parseFloat(item.price).toFixed(2) * parseFloat(item.items_sold).toFixed(2);
                    items += parseInt(item.items_sold);
                })
                callback([items, profit]);
            }
            // account for departments with no products 
            else {
                connection.query("SELECT * FROM departments WHERE ?",
                {
                    department_name: object.department_name
                }, function(err, res) {
                    if (err) {
                        console.log(err);
                        quit()
                    } else {
                        var profit = 0 - parseFloat(res[0].overhead_costs).toFixed(2);
                        callback([0, profit])
                    }
                })
            }
        }
    )
}
```
This snippet is a portion of a function that has asynchronous issues resolved by using Promise
```
// iterate through departments using a promise so it waits to finish
Promise.all(res.map(function(object) {
  var promise = new Promise(function(resolve) {
    // get profit by department name
    returnProfitByDep(object, function(res) {
      // create string
      var string = String(object.dep_id).padEnd(6, " ") +
                   String(object.department_name).padEnd(27, " ") +
                   String(object.overhead_costs.toFixed(2)).padEnd(17, " ") +
                   String(res[0]).padEnd(17, " ") +
                   String(res[1].toFixed(2)).padEnd(17, " ");

      // resolve promise
      resolve(string)
    })
  })
  // return promise resolution then...
  return promise.then(function(string) {
    // print the string
    console.log(string);
  });
})).then(function() {
  // print divider and re-init after Promise.all has resolved
  printDivider(84);
  init();
})
```
## Technologies Used
- Node.js
- Javascript
- MySQL
- Git
- GitHub
- VSCode

## Links
LinkedIn: https://www.linkedin.com/in/kerwinhy/<br>
GitHub: https://github.com/seiretsym<br>
