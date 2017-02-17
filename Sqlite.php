<?php

class Sqlite
{
  private $dbHandle;

  function __construct($path)
  {
    $this->dbHandle = new PDO("sqlite:$path");
    if (!$this->dbHandle) die('Could not obtain PDO');
    $this->dbHandle->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
  }

  public function execSql($sql)
  {
    $this->dbHandle->exec($sql);
  }

  public function insertRows($tableName, $nCols, $rows)
  {
    $sql = "INSERT INTO $tableName VALUES (" . str_repeat('?, ', $nCols - 1) . "?);";
    $preparedSql = $this->dbHandle->prepare($sql);

    foreach ($rows as $row)
      $preparedSql->execute($row);
  }

  public function getAllRows($tableName)
  {
    return $this->dbHandle->query("SELECT * FROM $tableName");
  }
}
