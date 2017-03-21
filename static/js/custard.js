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

function requestFailed(jqXHR, textStatus, errorThrown)
{
  console.log("Request failed: " + textStatus + " (" + errorThrown  + ")");
  reloadAllTables();
}

function gotSummary(data, textStatus, jqXHR)
{
  console.log("Got summary");
  loadSummaryTable(data);
  console.log("Loaded summary table");
}

function gotCompletedTasks(data, textStatus, jqXHR)
{
  console.log("Got completed tasks");
  loadCompletedTasksTable(data);
  console.log("Loaded completed tasks table");
}

function gotPendingTasks(data, textStatus, jqXHR)
{
  console.log("Got pending tasks");
  loadPendingTasksTable(data);
  console.log("Loaded pending tasks table");
}

function addedTask(data, textStatus, jqXHR)
{
  console.log("Added task: " + data['addedTitle'] + ", " + data['addedDescription'] + ", " + data['addedDueDate']);
  reloadAllTables();
}

function clearedAllTasks(data, textStatus, jqXHR)
{
  console.log("Cleared all tasks");
  reloadAllTables();
}

function addedSampleTasks(data, textStatus, jqXHR)
{
  console.log("Added sample tasks");
  reloadAllTables();
}

function completedTask(data, textStatus, jqXHR)
{
  console.log("Completed task: " + data['completedTitle'] + ", " + data['completedDescription'] + ", " + data['completedDueDate']);
  reloadAllTables();
}

function deletedTask(data, textStatus, jqXHR)
{
  console.log("Deleted task: " + data['deletedTitle'] + ", " + data['deletedDescription'] + ", " + data['deletedDueDate']);
  reloadAllTables();
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
