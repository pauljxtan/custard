DROP TABLE IF EXISTS tasks;

CREATE TABLE tasks (
  title VARCHAR(255),
  description TEXT(65535),
  dueDate DATE
);