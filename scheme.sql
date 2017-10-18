CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products(
  id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(45) not null,
  department_name VARCHAR(45) not null,
  price  int(6),
  stock_quantity  int,
  PRIMARY KEY (id)
);

CREATE TABLE departments(
  id INT NOT NULL AUTO_INCREMENT,
  department_name VARCHAR(45) not null,
  over_head_costs  VARCHAR(45) not null,
  PRIMARY KEY (id)
);

INSERT INTO products (product_name,department_name,price,stock_quantity) VALUES ("banana", "grocery", 1, 100);
insert into products (product_name,department_name,price,stock_quantity) values ("apple", "grocery", 2, 100);
insert into products (product_name,department_name,price,stock_quantity) values ("tire", "automotive", 75, 100);
insert into products (product_name,department_name,price,stock_quantity) values ("oil", "automotive", 12, 100);
insert into products (product_name,department_name,price,stock_quantity) values ("knife", "dining", 500, 100);
insert into products (product_name,department_name,price,stock_quantity) values ("plate", "dining", 600, 100);
insert into products (product_name,department_name,price,stock_quantity) values ("spade", "lawn", 26, 100);
insert into products (product_name,department_name,price,stock_quantity) values ("shovel", "lawn", 17, 100);
insert into products (product_name,department_name,price,stock_quantity) values ("agar", "pharmacy", 17, 100);
insert into products (product_name,department_name,price,stock_quantity) values ("tylenol", "pharmacy", 13, 100);
