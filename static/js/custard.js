function getSummary()
{
  doTaskRequest({'action': 'getSummary'}, gotSummary, requestFailed);
}

function getAllTasks()
{
  doTaskRequest({'action': 'getAllTasks'}, gotAllTasks, requestFailed);
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
  getSummary();
  getAllTasks();
}

function gotSummary(data, textStatus, jqXHR)
{
  console.log("Got summary");
  loadSummaryTable(data);
  console.log("Loaded summary table");
}

function gotAllTasks(data, textStatus, jqXHR)
{
  console.log("Got all tasks");
  loadTasksTable(data);
  console.log("Loaded tasks table");
}

function addedTask(data, textStatus, jqXHR)
{
  console.log("Added task: " + data['addedTitle'] + ", " + data['addedDescription'] + ", " + data['addedDueDate']);
  getSummary();
  getAllTasks();
}

function clearedAllTasks(data, textStatus, jqXHR)
{
  console.log("Cleared all tasks");
  getSummary();
  getAllTasks();
}

function addedSampleTasks(data, textStatus, jqXHR)
{
  console.log("Added sample tasks");
  getSummary();
  getAllTasks();
}

function completedTask(data, textStatus, jqXHR)
{
  console.log("Completed task: " + data['completedTitle'] + ", " + data['completedDescription'] + ", " + data['completedDueDate']);
  getSummary();
  getAllTasks();
}

function deletedTask(data, textStatus, jqXHR)
{
  console.log("Deleted task: " + data['deletedTitle'] + ", " + data['deletedDescription'] + ", " + data['deletedDueDate']);
  getSummary();
  getAllTasks();
}

function loadSummaryTable(data)
{
  var html = '';
  html +=  '<tbody>';
  html += '  <tr>';
  html += '    <th>Total</th>';
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

function loadTasksTable(data)
{
  var allTasks = data;
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
  for (var i = 0; i < allTasks.length; i++) {
    html += '  <tr>';
    html += '    <td>' + allTasks[i]['title'] + '</td>';
    html += '    <td>' + allTasks[i]['description'] + '</td>';
    html += '    <td>' + allTasks[i]['dueDate'] + '</td>';
    html += '    <td><button onclick="completeTask(' + allTasks[i]['id'] + ')">Complete</button></td>';
    html += '    <td><button onclick="deleteTask(' + allTasks[i]['id'] + ')">Cancel</button></td>';
    html += '  </tr>';
  }
  html += '</tbody>';
  document.getElementById('table-tasks').innerHTML = html;
}
