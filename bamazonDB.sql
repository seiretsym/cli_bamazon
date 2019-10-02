DROP DATABASE IF EXISTS bamazonDB;

CREATE DATABASE bamazonDB;

USE bamazonDB;

CREATE TABLE products (
    id INT NOT NULL AUTO_INCREMENT,
    item_name VARCHAR(25) NULL,
    category VARCHAR(25) NULL,
    price DECIMAL(10,2) NULL,
    quantity INTEGER(10) NULL,
    items_sold INTEGER(10) DEFAULT 0,
    PRIMARY KEY (id)
);

INSERT INTO products (item_name, category, price, quantity)
VALUES ("Potion", "consumable", 10.00, 100);

INSERT INTO products (item_name, category, price, quantity)
VALUES ("Ether", "consumable", 10.00, 100);

INSERT INTO products (item_name, category, price, quantity)
VALUES ("Pokéball", "pokéball", 200.00, 50);

INSERT INTO products (item_name, category, price, quantity)
VALUES ("Great Ball", "pokéball", 800.00, 20);

INSERT INTO products (item_name, category, price, quantity)
VALUES ("Old Fishing Rod", "fishing rod", 1000, 1);

INSERT INTO products (item_name, category, price, quantity)
VALUES ("TM22", "tm", 5000, 5);

INSERT INTO products (item_name, category, price, quantity)
VALUES ("Nail Polish", "beauty supplies", 200, 10);

INSERT INTO products (item_name, category, price, quantity)
VALUES ("Lipstick", "beauty supplies", 200, 10);

INSERT INTO products (item_name, category, price, quantity)
VALUES ("Baseball Cap", "apparel", 500, 25);