DROP DATABASE IF EXISTS bamazon;
CREATE database bamazon;

use bamazon;

CREATE TABLE products (
item_id int not null auto_increment,
product_name varchar(45) not null,
department_name varchar(45) not null,
price numeric(6,2) not null,
stock_quantity integer(5),
primary key (item_id)
);

insert into products (product_name, department_name, price, stock_quantity)
values ('xbox', 'electronics', 299.00, 1000), ('sofa', 'furniture', 599.99, 150), ('chips', 'groceries', 4.99, 2000), ('television', 'electronics', 350.00, 3500), ('knife set', 'home goods', 29.99, 350), ('fender stratocaster', 'instruments', 1100.00, 250), ('iphone', 'cellphone', 899.99, 10000), ('whey protein', 'health', 11.99, 6000), ('desk', 'office products', 89.99, 3225), ('call of duty', 'video games', 59.99, 25000), ('old spice', 'personal care', 3.99, 17000);

