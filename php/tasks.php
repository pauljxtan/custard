<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

include 'MySQL.php';

// TODO: configure this somewhere more centralized
$db = new MySQL('localhost', 'custard', 'mysqladmin', 'dolGbma7');

$action = $_POST['action'];
switch ($action) {
  case 'getSummary':
    getSummary($db);
    break;
  case 'getAllTasks':
    getAllTasks($db);
    break;
}

function getSummary($db) {
  $totalTasks = $db->getRowCount('tasks');
  echo json_encode(array(
    'total' => $totalTasks,
    'dueToday' => 'TEST123'
  ));
}

function getAllTasks($db)
{
  $rows = $db->getAllRows('tasks');
  $allTasks = array();
  foreach ($rows as $row) {
    $task = array(
      'title' => $row['title'],
      'description' => $row['description'],
      'dueDate' => $row['dueDate']
    );
    array_push($allTasks, $task);
  }
  echo json_encode($allTasks);
}

?>