<?php

class Task
{
  private $title;
  private $description;
  private $dueDate;

  function __construct($title, $description, $dueDate)
  {
    $this->title = $title;
    $this->description = $description;
    $this->dueDate = $dueDate;
  }

  public static function constructFromTableRow($row)
  {
    return new Task($row['title'], $row['description'], $row['dueDate']);
  }


}

?>
