<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

include 'mysql.php';

$db = new MySQL('localhost', 'custard', 'mysqladmin', 'minadsqlmy');

$action = urldecode($_POST['action']);
switch ($action)
{
  case 'getSummary':
    getSummary($db);
    break;
  case 'getAllTasks':
    getAllTasks($db);
    break;
  case 'addTask':
    // TODO: Validate parameters
    addTask($db, urldecode($_POST['title']), urldecode($_POST['description']), urldecode($_POST['dueDate']));
    break;
  case 'archiveTask':
    archiveTask($db, urldecode($_POST['taskId']));
    break;
  case 'clearAllTasks':
    clearAllTasks($db);
    break;
}

function getSummary($db)
{
  $totalTasks = $db->getRowCount('tasks');
  $overdue = sizeof(getTasksOverdue($db));
  $dueToday = sizeof(getTasksDueToday($db));
  echo json_encode(array(
    'total' => $totalTasks,
    'overdue' => $overdue,
    'dueToday' => $dueToday
  ));
}

function getTasksOverdue($db)
{
  return $db->query("SELECT * FROM tasks WHERE dueDate < DATE(NOW());");
}

function getTasksDueToday($db)
{
  return $db->query("SELECT * FROM tasks WHERE dueDate = DATE(NOW());");
}

function getAllTasks($db)
{
  $rows = $db->getAllRows('tasks');
  $allTasks = array();
  foreach ($rows as $row) {
    $task = array(
      'id' => $row['id'],
      'title' => $row['title'],
      'description' => $row['description'],
      'dueDate' => $row['dueDate']
    );
    array_push($allTasks, $task);
  }
  echo json_encode($allTasks);
}

function addTask($db, $title, $description, $dueDate)
{
  $fields = array("title", "description", "dueDate");
  $row = array($title, $description, $dueDate);
  $rows = array($row);
  $db->insertRows('tasks', $fields, $rows);
  echo json_encode(array(
    'addedTitle' => $title,
    'addedDescription' => $description,
    'addedDueDate' => $dueDate
  ));
}

function archiveTask($db, $taskId)
{
  // TODO
}

function clearAllTasks($db)
{
  $db->deleteAllRows('tasks');
  echo json_encode(array(
    'result' => 'success'
  ));
}

?>
