<?php

if (requestIsAjax()) {
  if (isset($_POST['action']) && !empty($_POST['action'])) {
    $action = $_POST['action'];
    switch ($action) {
      case 'test':
        testFunc();
        break;
    }
  }

}

function requestIsAjax() {
  return isset($_SERVER['HTTP_X_REQUESTED_WITH'])
    && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest';
}

function testFunc() {
  $return = $_POST;
  $return['usami'] = 'mizuki';
  $return['json'] = json_encode($return);
  echo json_encode($return);
}

?>