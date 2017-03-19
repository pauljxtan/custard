function getSummary()
{
  doTaskRequest({'action': 'getSummary'}, gotSummary);
}

function getAllTasks()
{
  doTaskRequest({'action': 'getAllTasks'}, gotAllTasks);
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
    addedTask
  );
}

function archiveTask(taskId)
{
  doTaskRequest
  (
    {
      'action': 'archiveTask',
      'taskId': taskId
    },
    archivedTask
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
    deletedTask
  );
}

function clearAllTasks()
{
  doTaskRequest({'action': 'clearAllTasks'}, clearedAllTasks)
}

function doTaskRequest(params, successFunc)
{
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

function archivedTask(data, textStatus, jqXHR)
{
  console.log("Archived task: " + data['archivedTitle'] + ", " + data['archivedDescription'] + ", " + data['archivedDueDate']);
  getSummary();
  getAllTasks();
}

function deletedTask(data, textStatus, jqXHR)
{
  console.log("Deleted task: " + data['deletedTitle'] + ", " + data['deletedDescription'] + ", " + data['deletedDueDate']);
  getSummary();
  getAllTasks();
}

function clearedAllTasks(data, textStatus, jqXHR)
{
  console.log("Cleared all tasks");
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
    html += '    <td><button onclick="archiveTask(' + allTasks[i]['id'] + ')">Complete</button></td>';
    html += '    <td><button onclick="deleteTask(' + allTasks[i]['id'] + ')">Cancel</button></td>';
    html += '  </tr>';
  }
  html += '</tbody>';
  document.getElementById('table-tasks').innerHTML = html;
}
