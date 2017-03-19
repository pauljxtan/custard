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
  case 'clearAllTasks':
    clearAllTasks($db);
    break;
  case 'addSampleTasks':
    addSampleTasks($db);
    break;
  case 'completeTask':
    completeTask($db, urldecode($_POST['taskId']));
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

function getTasksCompleted($db)
{
  // TODO
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

function addTask($db, $title, $description, $dueDate, $returnAddedTask = true)
{
  $fields = array('title', 'description', 'dueDate', 'completed');
  $row = array($title, $description, $dueDate, 0);
  $rows = array($row);
  $db->insertRows('tasks', $fields, $rows);
  if ($returnAddedTask)
  {
    echo json_encode(array(
      'addedTitle' => $title,
      'addedDescription' => $description,
      'addedDueDate' => $dueDate
    ));
  }
}

function clearAllTasks($db)
{
  $db->deleteAllRows('tasks');
  echo json_encode(array(
    'result' => 'success'
  ));
}

function addSampleTasks($db)
{
  addTask($db, "New Year's Party 2018", "Party time!", "2018-01-01", false);
  addTask($db, "New Year's Party 2019", "Party time again!", "2019-01-01", false);
  addTask($db, "New Year's Party 2020", "Yep... party time!", "2020-01-01", false);
  echo json_encode(array(
    'result' => 'success'
  ));
}

function completeTask($db, $taskId)
{
  // TODO
}

function deleteTask($db, $taskId)
{
  // TODO
}

?>
