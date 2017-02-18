<?php

function getTotalTasks($db) {
  $totalTasks = $db->getRowCount('tasks');
  return $totalTasks;
}

?>
