CREATE DATABASE ims;
USE ims;
CREATE TABLE admin(
id INT AUTO_INCREMENT PRIMARY KEY,
name VARCHAR(50) NOT NULL,
password VARCHAR(100) NOT NULL
);

CREATE TABLE client(
id INT AUTO_INCREMENT PRIMARY KEY,
name VARCHAR(50) NOT NULL,
phone INT NOT NULL
);

CREATE TABLE task (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2),
  date_assigned DATE,
  date_submitted DATE,
  is_paid BOOLEAN,
  client_id INT NOT NULL,
  FOREIGN KEY (client_id) REFERENCES client(id)
);
