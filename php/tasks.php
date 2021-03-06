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
  case 'getCompletedTasks':
    getCompletedTasks($db);
    break;
  case 'getPendingTasks':
    getPendingTasks($db);
    break;
  case 'addTask':
    // TODO: Validate parameters
    addTask($db, urldecode($_POST['title']), urldecode($_POST['description']), urldecode($_POST['dueDate']));
    break;
  case 'editTask':
    // TODO: Validate parameters
    editTask($db, urldecode($_POST['id']), urldecode($_POST['title']), urldecode($_POST['description']), urldecode($_POST['dueDate']));
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
  case 'deleteTask':
    deleteTask($db, urldecode($_POST['taskId']));
    break;
}

function getSummary($db)
{
  $totalTasks = sizeof(getTasksPending($db));
  $overdue = sizeof(getTasksOverdue($db));
  $dueToday = sizeof(getTasksDueToday($db));
  echo json_encode(array(
    'result' => "success",
    'total' => $totalTasks,
    'overdue' => $overdue,
    'dueToday' => $dueToday
  ));
}

function getTasksCompleted($db)
{
  return $db->query("SELECT * FROM tasks WHERE completed = true;");
}

function getTasksPending($db)
{
  return $db->query("SELECT * FROM tasks WHERE completed = false;");
}

function getTasksOverdue($db)
{
  return $db->query("SELECT * FROM tasks WHERE completed = false AND dueDate < DATE(NOW());");
}

function getTasksDueToday($db)
{
  return $db->query("SELECT * FROM tasks WHERE completed = false AND dueDate = DATE(NOW());");
}

function updateTask($db, $id, $title, $description, $dueDate)
{
  $sql = "UPDATE tasks SET title = ?, description = ?, dueDate = ? WHERE id = ".$id.";";
  $statement = $db->getPreparedStatement($sql);
  $statement->execute(array($title, $description, $dueDate));
}

function getCompletedTasks($db)
{
  $rows = getTasksCompleted($db);
  $completedTasks = array();
  foreach ($rows as $row) {
    $task = array(
      'id' => $row['id'],
      'title' => $row['title'],
      'description' => $row['description'],
      'dueDate' => $row['dueDate']
    );
    array_push($completedTasks, $task);
  }
  echo json_encode($completedTasks);
}

function getPendingTasks($db)
{
  $rows = getTasksPending($db);
  $pendingTasks = array();
  foreach ($rows as $row) {
    $task = array(
      'id' => $row['id'],
      'title' => $row['title'],
      'description' => $row['description'],
      'dueDate' => $row['dueDate']
    );
    array_push($pendingTasks, $task);
  }
  echo json_encode($pendingTasks);
}

function addTask($db, $title, $description, $dueDate, $returnAddedTask = true, $completed = 0)
{
  $fields = array('title', 'description', 'dueDate', 'completed');
  $row = array($title, $description, $dueDate, $completed);
  $rows = array($row);
  $db->insertRows('tasks', $fields, $rows);
  if ($returnAddedTask)
  {
    echo json_encode(array(
      'result' => "success",
      'addedTitle' => $title,
      'addedDescription' => $description,
      'addedDueDate' => $dueDate
    ));
  }
}

function editTask($db, $id, $title, $description, $dueDate, $returnEditedTask = true)
{
  if ($id == -1)
  {
    echo json_encode(array('result' => "nochange"));
    return;
  }
  updateTask($db, $id, $title, $description, $dueDate);
  if ($returnEditedTask)
  {
    echo json_encode(array(
      'result' => "success",
      'editedTitle' => $title,
      'editedDescription' => $description,
      'editedDueDate' => $dueDate
    ));
  }
}

function clearAllTasks($db)
{
  $rowsDeleted = $db->deleteAllRows('tasks');
  echo json_encode(array(
    'result' => "success",
    'rowsDeleted' => $rowsDeleted
  ));
}

function addSampleTasks($db)
{
  addTask($db, "New Year's Party 2015", "We had this!", "2015-01-01", false, 1);
  addTask($db, "New Year's Party 2016", "We forgot to have this...", "2016-01-01", false, 0);
  addTask($db, "New Year's Party 2017", "We had this!", "2017-01-01", false, 1);
  addTask($db, "New Year's Party 2018", "Party time!", "2018-01-01", false, 0);
  addTask($db, "New Year's Party 2019", "Party time again!", "2019-01-01", false, 0);
  addTask($db, "New Year's Party 2020", "Yep... party time!", "2020-01-01", false, 0);
  echo json_encode(array(
    'result' => "success"
  ));
}

function completeTask($db, $taskId)
{
  $row = $db->query("SELECT * FROM tasks WHERE id = ".$taskId.";")[0];
  $db->exec("UPDATE tasks SET completed = true WHERE id = ".$taskId.";");
  echo json_encode(array(
    'result' => "success",
    'completedTaskId' => $taskId,
    'completedTitle' => $row['title'],
    'completedDescription' => $row['description'],
    'completedDueDate' => $row['dueDate']
  ));
}

function deleteTask($db, $taskId)
{
  $row = $db->query("SELECT * FROM tasks WHERE id = ".$taskId.";")[0];
  $db->exec("DELETE FROM tasks WHERE id = ".$taskId.";");
  echo json_encode(array(
    'result' => "success",
    'deletedTaskId' => $taskId,
    'deletedTitle' => $row['title'],
    'deletedDescription' => $row['description'],
    'deletedDueDate' => $row['dueDate']
  ));
}

?>
