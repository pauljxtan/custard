/* AJAX calls */

function reloadAllTables() {
  getSummary();
  getPendingTasks();
  getCompletedTasks();
}

function getSummary()
{
  doTaskRequest({'action': 'getSummary'}, gotSummary, requestFailed);
}

function getCompletedTasks()
{
  doTaskRequest({'action': 'getCompletedTasks'}, gotCompletedTasks, requestFailed);
}

function getPendingTasks()
{
  doTaskRequest({'action': 'getPendingTasks'}, gotPendingTasks, requestFailed);
}

function addTask()
{
  doTaskRequest
  (
    {
      'action': 'addTask',
      'title': encodeURIComponent($('#input-title').val()),
      'description': encodeURIComponent($('#textarea-description').val()),
      'dueDate': encodeURIComponent($('#input-dueDate').val())
    },
    addedTask,
    requestFailed
  );
}

function clearAllTasks()
{
  doTaskRequest({'action': 'clearAllTasks'}, clearedAllTasks, requestFailed)
}

function addSampleTasks()
{
  doTaskRequest({'action': 'addSampleTasks'}, addedSampleTasks, requestFailed)
}

function completeTask(taskId)
{
  doTaskRequest
  (
    {
      'action': 'completeTask',
      'taskId': taskId
    },
    completedTask,
    requestFailed
  );
}

function deleteTask(taskId)
{
  doTaskRequest
  (
    {
      'action': 'deleteTask',
      'taskId': taskId
    },
    deletedTask,
    requestFailed
  );
}

function doTaskRequest(params, successFunc, errorFunc)
{
  $(document).ready(function() {
    data = $(this).serialize() + '&' + $.param(params);
    $.ajax({
      type: 'POST',
      dataType: 'json',
      url: 'php/tasks.php',
      data: data,
      success: successFunc,
      error: errorFunc
    });
  });
}

/* Callbacks */

function requestFailed(jqXHR, textStatus, errorThrown)
{
  message = "Request failed: " + textStatus + " (" + errorThrown  + ")";
  console.log(message);
  loadMessageSpan(message, MessageLevel.ERROR);
  reloadAllTables();
}

function gotSummary(data, textStatus, jqXHR)
{
  loadSummaryTable(data);
  console.log("Loaded summary table");
}

function gotCompletedTasks(data, textStatus, jqXHR)
{
  loadCompletedTasksTable(data);
  console.log("Loaded completed tasks table");
}

function gotPendingTasks(data, textStatus, jqXHR)
{
  loadPendingTasksTable(data);
  console.log("Loaded pending tasks table");
}

function addedTask(data, textStatus, jqXHR)
{
  message = "Added task: " + data['addedTitle'] + " (" + data['addedDescription'].substring(0, 10) + "...) [" + data['addedDueDate'] + "]";
  console.log(message);
  loadMessageSpan(message, MessageLevel.SUCCESS);
  reloadAllTables();
}

function clearedAllTasks(data, textStatus, jqXHR)
{
  message = "Cleared all tasks";
  console.log(message);
  loadMessageSpan(message, MessageLevel.WARNING);
  reloadAllTables();
}

function addedSampleTasks(data, textStatus, jqXHR)
{
  message = "Added sample tasks";
  console.log(message);
  loadMessageSpan(message, MessageLevel.INFO);
  reloadAllTables();
}

function completedTask(data, textStatus, jqXHR)
{
  message = "Completed task: " + data['completedTitle'] + ", " + data['completedDescription'] + ", " + data['completedDueDate'];
  console.log(message);
  loadMessageSpan(message, MessageLevel.SUCCESS);
  reloadAllTables();
}

function deletedTask(data, textStatus, jqXHR)
{
  message = "Deleted task: " + data['deletedTitle'] + ", " + data['deletedDescription'] + ", " + data['deletedDueDate'];
  console.log(message);
  loadMessageSpan(message, MessageLevel.WARNING);
  reloadAllTables();
}

/* Loading functions */

function loadMessageSpan(message, messageLevel)
{
  var cls = "message message-info";
  switch (messageLevel) {
    case MessageLevel.SUCCESS:
      cls = "message message-success";
      break;
    case MessageLevel.WARNING:
      cls = "message message-warning";
      break;
    case MessageLevel.ERROR:
      cls = "message message-error";
      break;
  }
  $("#span-message").attr('class', cls).html(message);
}

function loadSummaryTable(data)
{
  var html = '';
  html +=  '<tbody>';
  html += '  <tr>';
  html += '    <th>Tasks pending</th>';
  html += '    <td id="summary-total">' + data['total'] + '</td>';
  html += '  </tr>';
  html += '  <tr>';
  html += '    <th>Overdue</th>';
  html += '    <td id="summary-overdue">' + data['overdue'] + '</td>';
  html += '  </tr>';
  html += '  <tr>';
  html += '    <th>Due today</th>';
  html += '    <td id="summary-due-today">' + data['dueToday'] + '</td>';
  html += '  </tr>';
  html += '</tbody>';
  document.getElementById('table-summary').innerHTML = html;
}

// TODO: Lots of repeated code to refactor here...

function loadPendingTasksTable(data)
{
  var pendingTasks = data;
  var html = '';
  html += '<thead>';
  html += '  <tr>';
  html += '    <th>Title</th>';
  html += '    <th>Description</th>';
  html += '    <th>Due</th>';
  html += '    <th></th>';
  html += '    <th></th>';
  html += '  </tr>';
  html += '</thead>';
  html += '<tbody>';
  for (var i = 0; i < pendingTasks.length; i++) {
    html += '  <tr>';
    html += '    <td>' + pendingTasks[i]['title'] + '</td>';
    html += '    <td>' + pendingTasks[i]['description'] + '</td>';
    html += '    <td>' + pendingTasks[i]['dueDate'] + '</td>';
    html += '    <td><button onclick="completeTask(' + pendingTasks[i]['id'] + ')">Complete</button></td>';
    html += '    <td><button onclick="deleteTask(' + pendingTasks[i]['id'] + ')">Cancel</button></td>';
    html += '  </tr>';
  }
  html += '</tbody>';
  document.getElementById('table-pending').innerHTML = html;
}

function loadCompletedTasksTable(data)
{
  var completedTasks = data;
  var html = '';
  html += '<thead>';
  html += '  <tr>';
  html += '    <th>Title</th>';
  html += '    <th>Description</th>';
  html += '    <th>Due</th>';
  html += '    <th></th>';
  html += '  </tr>';
  html += '</thead>';
  html += '<tbody>';
  for (var i = 0; i < completedTasks.length; i++) {
    html += '  <tr>';
    html += '    <td>' + completedTasks[i]['title'] + '</td>';
    html += '    <td>' + completedTasks[i]['description'] + '</td>';
    html += '    <td>' + completedTasks[i]['dueDate'] + '</td>';
    html += '    <td><button onclick="deleteTask(' + completedTasks[i]['id'] + ')">Delete</button></td>';
    html += '  </tr>';
  }
  html += '</tbody>';
  document.getElementById('table-completed').innerHTML = html;
}

MessageLevel = {
  SUCCESS: 0,
  INFO: 1,
  WARNING: 2,
  ERROR: 3
};