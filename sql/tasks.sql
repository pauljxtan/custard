DROP TABLE IF EXISTS tasks;

CREATE TABLE tasks (
  title VARCHAR(255),
  description TEXT(65535),
  dueDate DATE
);

INSERT INTO tasks VALUES ('Do thing', 'Do a thing', '2018-01-01');
INSERT INTO tasks VALUES ('Do thing', 'Do another thing', '2019-01-01');
INSERT INTO tasks VALUES ('Do thing', 'Do one more thing', '2020-01-01');
