/* Globals */

var taskIdBeingEdited = -1;
var dialogBackground = $('#dialog-edit-task-background');
var dialog = $('#dialog-edit-task');

/* Main functions */

function reloadEverything()
{
  reloadAllTables();
  reloadAllWidgets();
}

function reloadAllTables()
{
  getSummary();
  getPendingTasks();
  getCompletedTasks();
}

function reloadAllWidgets()
{
  loadDueDateWidget();
  loadCompletedTasksAccordion();
  enableSubmitTaskOnEnter();
}

function setClickHandlers()
{
  $('#button-add-task').click(addTask);
  $('#button-edit-task').click(editTask);
}

/* AJAX calls */

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

function editTask()
{
  doTaskRequest
  (
    {
      'action': 'editTask',
      'id': taskIdBeingEdited,
      'title': encodeURIComponent($('#input-edit-title').val()),
      'description': encodeURIComponent($('#textarea-edit-description').val()),
      'dueDate': encodeURIComponent($('#input-edit-dueDate').val())
    },
    editedTask,
    requestFailed
  );
}

function clearAllTasks()
{
  doTaskRequest({'action': 'clearAllTasks'}, clearedAllTasks, requestFailed);
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
  message = "<b>Request failed:</b> " + textStatus + " (" + errorThrown  + ")";
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
  message = "<b>Added task:</b> " + getFormattedTaskDisplay(data['addedTitle'], data['addedDescription'], data['addedDueDate']);
  console.log(message);
  loadMessageSpan(message, MessageLevel.SUCCESS);
  reloadAllTables();
}

function editedTask(data, textStatus, jqXHR)
{
  console.log("editedTask");
  if (data['result'] !== "nochange") {
    message = "<b>Edited task:</b> " + getFormattedTaskDisplay(data['editedTitle'], data['editedDescription'], data['editedDueDate']);
    console.log(message);
    loadMessageSpan(message, MessageLevel.SUCCESS);
  }
  reloadAllTables();
  dialogBackground.hide();
}

function clearedAllTasks(data, textStatus, jqXHR)
{
  message = "<b>Cleared all tasks</b>";
  console.log(message);
  loadMessageSpan(message, MessageLevel.WARNING);
  reloadAllTables();
}

function addedSampleTasks(data, textStatus, jqXHR)
{
  message = "<b>Added sample tasks</b>";
  console.log(message);
  loadMessageSpan(message, MessageLevel.INFO);
  reloadAllTables();
}

function completedTask(data, textStatus, jqXHR)
{
  message = "<b>Completed task:</b> " + getFormattedTaskDisplay(data['completedTitle'], data['completedDescription'], data['completedDueDate']);
  console.log(message);
  loadMessageSpan(message, MessageLevel.SUCCESS);
  reloadAllTables();
}

function deletedTask(data, textStatus, jqXHR)
{
  message = "<b>Deleted task:</b> " + getFormattedTaskDisplay(data['deletedTitle'], data['deletedDescription'], data['deletedDueDate']);
  console.log(message);
  loadMessageSpan(message, MessageLevel.WARNING);
  reloadAllTables();
}

/* Loading functions */

function loadMessageSpan(message, messageLevel)
{
  var cls = "message info";
  switch (messageLevel) {
    case MessageLevel.SUCCESS:
      cls = "message success";
      break;
    case MessageLevel.WARNING:
      cls = "message warning";
      break;
    case MessageLevel.ERROR:
      cls = "message error";
      break;
  }
  $('#span-message').toggle('slide', function() {
    $('#span-message').attr('class', cls).html(message).toggle('slide');
  });
}

function loadSummaryTable(data)
{
  $('#td-summary-total').fadeOut(function ()
  {
    $('#td-summary-total').html(data['total']).fadeIn();
  });
  $('#td-summary-overdue').fadeOut(function ()
  {
    $('#td-summary-overdue').html(data['overdue']).fadeIn();
  });
  $('#td-summary-duetoday').fadeOut(function ()
  {
    $('#td-summary-duetoday').html(data['dueToday']).fadeIn();
  });
}

// TODO: Some refactoring to do here?

function loadPendingTasksTable(data)
{
  var pendingTasks = data;
  var html = '';
  for (var i = 0; i < pendingTasks.length; i++) {
    html += '<tr>';
    html += '  <td>' + pendingTasks[i]['title'] + '</td>';
    html += '  <td>' + pendingTasks[i]['description'] + '</td>';
    html += '  <td>' + pendingTasks[i]['dueDate'] + '</td>';
    html += '  <td><button class="button success" onclick="completeTask(' + pendingTasks[i]['id'] + ')">Complete</button></td>';
    html += '  <td><button class="button info" id="button-edit-task-' + pendingTasks[i]['id'] + '">Edit</buttonclass></td>';
    html += '  <td><button class="button warning" onclick="deleteTask(' + pendingTasks[i]['id'] + ')">Cancel</button></td>';
    html += '</tr>';
  }

  $('#table-pending-tbody').fadeOut(function() {
    $('#table-pending-tbody').html(html).fadeIn();

    // Clicking each edit button loads the corresponding task info and shows the dialog
    for (i = 0; i < pendingTasks.length; i++) {
      $('#button-edit-task-' + pendingTasks[i]['id']).click(pendingTasks[i], function(event)
      {
        loadEditTaskDialog(event);
        dialogBackground.slideDown();
        event.stopPropagation();
      });
    }

    // Clicking anywhere outside the dialog hides it
    $(document).click(function (event)
    {
      if (dialogBackground.is(':visible') && $(event.target).closest(dialog).length === 0) {
        dialogBackground.slideUp();
      }
    });
  });

  $('#input-edit-dueDate').datepicker({
    dateFormat: 'yy-mm-dd'
  });

}

function loadCompletedTasksTable(data)
{
  var completedTasks = data;
  var html = '';
  for (var i = 0; i < completedTasks.length; i++) {
    html += '<tr>';
    html += '  <td>' + completedTasks[i]['title'] + '</td>';
    html += '  <td>' + completedTasks[i]['description'] + '</td>';
    html += '  <td>' + completedTasks[i]['dueDate'] + '</td>';
    html += '  <td><button class="button error" onclick="deleteTask(' + completedTasks[i]['id'] + ')">Delete</button></td>';
    html += '</tr>';
  }
  $('#table-completed-tbody').fadeOut(function() {
    $('#table-completed-tbody').html(html).fadeIn();
  });
}

function loadEditTaskDialog(event)
{
  var html = '';
  task = event.data;
  title = task['title'];
  description = task['description'];
  dueDate = task['dueDate'];
  html += '<table class="table table-form">';
  html += '  <tbody>';
  html += '    <tr>';
  html += '      <th><label for="input-edit-title">Title</label></th>';
  html += '      <td><input id="input-edit-title" type="text" value="' + title + '" /></td>';
  html += '    </tr>';
  html += '    <tr>';
  html += '      <th><label for="textarea-edit-description">Description</label></th>';
  html += '      <td><input id="textarea-edit-description" type="text" value="' + description + '" /></td>';
  html += '    </tr>';
  html += '    <tr>';
  html += '      <th><label for="input-edit-dueDate">Due date</label></th>';
  html += '      <td><input id="input-edit-dueDate" type="text" value="' + dueDate + '" /></td>';
  html += '    </tr>';
  html += '  </tbody>';
  html += '</table>';
  $('#dialog-edit-task-form').html(html);
  taskIdBeingEdited = task['id'];
  console.log("Loaded edit dialog");
}

/* Widget setup */

function loadDueDateWidget()
{
  $('#input-dueDate').datepicker({
    dateFormat: 'yy-mm-dd'
  });
}

function loadCompletedTasksAccordion()
{
  $('#accordion-completed').accordion({
    collapsible: true,
    active: false,
    heightStyle: 'content'
  });
}

function enableSubmitTaskOnEnter()
{
  $('#table-addtask input, textarea').keyup(function (event)
  {
    if (event.keyCode === 13) {
      $('#button-submit').click();
    }
  });
}

/* Helpers */

function getFormattedTaskDisplay(title, description, dueDate)
{
  return title + " (" + description.substring(0, 20) + "...) [" + dueDate + "]";
}

/* Constants */

MessageLevel =
{
  SUCCESS: 0,
  INFO: 1,
  WARNING: 2,
  ERROR: 3
};
