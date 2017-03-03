CREATE DATABASE custard;

CREATE USER 'mysqladmin'@'localhost' IDENTIFIED BY 'minadsqlmy';
GRANT ALL ON custard.* TO 'mysqladmin'@'localhost';
