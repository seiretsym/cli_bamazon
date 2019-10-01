DROP DATABASE IF EXISTS bamazonDB;

CREATE DATABASE bamazonDB;

USE bamazonDB;

CREATE TABLE products (
    id INT NOT NULL AUTO_INCREMENT,
    item_name VARCHAR(25) NULL,
    category VARCHAR(10) NULL,
    price DECIMAL(10,2) NULL,
    quantity INTEGER(5) NULL,
    PRIMARY KEY (id)
);