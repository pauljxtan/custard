<?php

class MySQL
{
  private $dbHandle;

  function __construct($hostname, $dbName, $username, $password)
  {
    $this->dbHandle = new PDO("mysql:host=$hostname;dbname=$dbName;", $username, $password);
    if (!$this->dbHandle)
      die('Could not obtain PDO');
    $this->dbHandle->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
  }

  // WARNING: Executes unprepared statement, use only if no user input
  public function exec($sql)
  {
    $numRowsAffected = $this->dbHandle->exec($sql);
    return $numRowsAffected;
  }

  // WARNING: Executes unprepared statement, use only if no user input
  public function query($sql) {
    $statement = $this->dbHandle->query($sql);
    $rows = $statement->fetchAll();
    return $rows;
  }

  public function getPreparedStatement($sql) {
    return $this->dbHandle->prepare($sql);
  }

  public function deleteAllRows($tableName) {
    $this->exec("TRUNCATE $tableName;");
  }

  public function insertRows($tableName, $fields, $inputRows)  {
    $sql = "INSERT INTO $tableName (".implode(", ", $fields).") VALUES (".str_repeat('?, ', sizeof($fields) - 1)."?);";
    $statement = $this->dbHandle->prepare($sql);

    foreach ($inputRows as $inputRow)
      $statement->execute($inputRow);
  }

  public function getAllRows($tableName)
  {
    $sql = "SELECT * FROM $tableName;";
    $rows = $this->query($sql);
    return $rows;
  }

  public function getRowCount($tableName)
  {
    $sql = "SELECT COUNT(*) AS count FROM $tableName;";
    $rows = $this->query($sql);
    return $rows[0]['count'];
  }
}
