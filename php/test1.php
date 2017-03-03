<?php

include 'MySQL.php';

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$db = new MySQL('localhost', 'custard', 'mysqladmin', 'minadsqlmy');

$rows = array(
  array('Do thing', 'Do something', '2017-01-01'),
  array('Do other thing', 'Do another something', '2017-01-02')
);

//$db->insertRows('tasks', 3, $rows);

$rows = $db->getAllRows('tasks');
foreach ($rows as $row) {
  echo $row['title'] . ' ' . $row['description'] . ' ' . $row['dueDate'] . '<br>';
}

?>
