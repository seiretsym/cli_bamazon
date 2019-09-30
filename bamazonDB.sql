DROP DATABASE IF EXISTS bamazonDB;

CREATE DATABASE bamazonDB;

USE bamazonDB;

CREATE TABLE products (
    id INT NOT NULL AUTO_INCREMENT,
    category VARCHAR(50) NULL,
    price DECIMAL(10,2) NULL,
    quantity INTEGER(10) NULL,
    PRIMARY KEY (id)
);