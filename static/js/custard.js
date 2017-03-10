function getSummary() {
  doTaskRequest({'action': 'getSummary'}, loadSummaryTable);
}

function getAllTasks() {
  doTaskRequest({'action': 'getAllTasks'}, loadTasksTable);
}

function addTask() {
  doTaskRequest
  (
    {
      'action': 'addTask',
      'title': $('#input-title').val(),
      'description': $('#textarea-description').val(),
      'dueDate': $('#input-dueDate').val()
    },
    alertAddedTask
  );
}

function clearAllTasks() {
  doTaskRequest({'action': 'clearAllTasks'}, alertClearedAllTasks)
}

function doTaskRequest(params, successFunc) {
  $(document).ready(function() {
    data = $(this).serialize() + '&' + $.param(params);
    $.ajax({
      type: 'POST',
      dataType: 'json',
      url: 'php/tasks.php',
      data: data,
      success: successFunc
    });
  });
}

function alertAddedTask(data, textStatus, jqXHR) {
  alert("Added task: " + data['addedTitle'] + ", " + data['addedDescription'] + ", " + data['addedDueDate']);
  getSummary();
  getAllTasks();
}

function alertClearedAllTasks(data, textStatus, jqXHR) {
  alert("Cleared all tasks");
  getSummary();
  getAllTasks();
}

function loadSummaryTable(data, textStatus, jqXHR) {
  var total = data['total'];
  var dueToday = data['dueToday'];
  var html = '';
  html +=  '<tbody>';
  html += '  <tr>';
  html += '    <th>Total</th>';
  html += '    <td id="summary-total">' + total + '</td>';
  html += '  </tr>';
  html += '  <tr>';
  html += '    <th>Due today</th>';
  html += '    <td id="summary-due-today">' + dueToday + '</td>';
  html += '  </tr>';
  html += '</tbody>';
  document.getElementById('table-summary').innerHTML = html;
}

function loadTasksTable(data, textStatus, jqXHR) {
  var allTasks = data;
  var html = '';
  html += '<thead>';
  html += '  <tr>';
  html += '    <th>Title</th>';
  html += '    <th>Description</th>';
  html += '    <th>Due</th>';
  html += '  </tr>';
  html += '</thead>';
  html += '<tbody>';
  for (var i = 0; i < allTasks.length; i++) {
    html += '  <tr>';
    html += '    <td>' + allTasks[i]['title'] + '</td>';
    html += '    <td>' + allTasks[i]['description'] + '</td>';
    html += '    <td>' + allTasks[i]['dueDate'] + '</td>';
    html += '  </tr>';
  }
  html += '</tbody>';
  document.getElementById('table-tasks').innerHTML = html;
}
