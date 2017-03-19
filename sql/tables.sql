DROP TABLE IF EXISTS tasks;

CREATE TABLE tasks (
  id BIGINT NOT NULL AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  description TEXT(65535) NULL,
  dueDate DATE NULL,
  completed BOOL NOT NULL,
  archived BOOL NOT NULL,
  PRIMARY KEY (id)
);

INSERT INTO tasks (title, description, dueDate, completed, archived) VALUES ('Do thing', 'Do a thing', '2018-01-01', 0, 0);
INSERT INTO tasks (title, description, dueDate, completed, archived) VALUES ('Do thing', 'Do another thing', '2019-01-01', 0, 0);
INSERT INTO tasks (title, description, dueDate, completed, archived) VALUES ('Do thing', 'Do one more thing', '2020-01-01', 0, 0);
