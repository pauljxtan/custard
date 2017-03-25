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
  loadEditTaskDialogs(data);
  console.log("Loaded edit task dialogs")
}

function addedTask(data, textStatus, jqXHR)
{
  message = "<b>Added task:</b> " + getFormattedTaskDisplay(data['addedTitle'], data['addedDescription'], data['addedDueDate']);
  console.log(message);
  loadMessageSpan(message, MessageLevel.SUCCESS);
  reloadAllTables();
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

// TODO: Some refactoring to do here?

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
  html += '    <th></th>';
  html += '  </tr>';
  html += '</thead>';
  html += '<tbody>';
  for (var i = 0; i < pendingTasks.length; i++) {
    html += '  <tr>';
    html += '    <td>' + pendingTasks[i]['title'] + '</td>';
    html += '    <td>' + pendingTasks[i]['description'] + '</td>';
    html += '    <td>' + pendingTasks[i]['dueDate'] + '</td>';
    html += '    <td><button class="button button-success" onclick="completeTask(' + pendingTasks[i]['id'] + ')">Complete</button></td>';
    html += '    <td><button class="button button-info" id="button-edit-task-' + pendingTasks[i]['id'] + '">Edit</buttonclass></td>';
    html += '    <td><button class="button button-warning" onclick="deleteTask(' + pendingTasks[i]['id'] + ')">Cancel</button></td>';
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
    html += '    <td><button class="button button-error" onclick="deleteTask(' + completedTasks[i]['id'] + ')">Delete</button></td>';
    html += '  </tr>';
  }
  html += '</tbody>';
  document.getElementById('table-completed').innerHTML = html;
}

function loadEditTaskDialogs(data)
{
  var pendingTasks = data;
  var html = '';
  for (var i = 0; i < pendingTasks.length; i++) {
    html += '<div class="dialog-edit-task-background" id="dialog-edit-task-background-' + pendingTasks[i]['id'] + '">';
    html += '  <div class="dialog-edit-task" id="dialog-edit-task-' + pendingTasks[i]['id'] + '">';
    html += '    <form>';
    html += '      <table>';
    html += '        <tbody>';
    html += '          <tr>';
    html += '            <th><label for="input-title-' + pendingTasks[i]['id'] +'">Title</label></th>';
    html += '            <td><input id="input-title-' + pendingTasks[i]['id'] + '" type="text" value="' + pendingTasks[i]['title'] + '" /></td>';
    html += '          </tr>';
    html += '          <tr>';
    html += '            <th><label for="textarea-description-' + pendingTasks[i]['id'] +'">Description</label></th>';
    html += '            <td><input id="textarea-description-' + pendingTasks[i]['id'] + '" type="text" value="' + pendingTasks[i]['description'] + '" /></td>';
    html += '          </tr>';
    html += '          <tr>';
    html += '            <th><label for="input-dueDate-' + pendingTasks[i]['id'] +'">Due date</label></th>';
    html += '            <td><input id="input-dueDate-' + pendingTasks[i]['id'] + '" type="text" value="' + pendingTasks[i]['dueDate'] + '" /></td>';
    html += '          </tr>';
    html += '        </tbody>';
    html += '      </table>';
    html += '    </form>';
    html += '  </div>';
    html += '</div>';

    // Due date widget
    // $("#input-dueDate-" + pendingTasks[i]['id']).datepicker({
    //   dateFormat: 'yy-mm-dd'
    // });

    // Edit dialog
    // $("#dialog-edit-task-" + pendingTasks[i]['id']).dialog({
    //   width: 640,
    //   autoOpen: false,
    //   modal: true,
    //   buttons: [
    //     {
    //       text: "Close",
    //       click: function() {
    //         $(this).dialog("close");
    //       }
    //     }
    //   ]
    // });
    // $("#button-edit-task-" + pendingTasks[i]['id']).click(function () {
    //   $("#dialog-edit-task-" + pendingTasks[i]['id']).dialog("open");
    // });
  }
  document.getElementById('container-dialogs').innerHTML = html;
  enableEditTaskDialogs(pendingTasks);
}

/* Widget setup */

function loadDueDateWidget()
{
  $("#input-dueDate").datepicker({
    dateFormat: 'yy-mm-dd'
  });
}

function loadCompletedTasksAccordion()
{
  $("#accordion-completed").accordion({
    collapsible: true,
    active: false,
    heightStyle: 'content'
  });
}

function enableSubmitTaskOnEnter()
{
  $("#table-addtask input, textarea").keyup(function (event)
  {
    if (event.keyCode == 13) {
      $("#button-submit").click();
    }
  });
}

// TODO: Buttons all bind to the last task...
function enableEditTaskDialogs(pendingTasks)
{
  for (var i = 0; i < pendingTasks.length; i++) {
    var modal = document.getElementById('dialog-edit-task-background-' + pendingTasks[i]['id']);
    document.getElementById('button-edit-task-' + pendingTasks[i]['id']).onclick = function ()
    {
      modal.style.display = "block";
    };
    window.onclick = function(event)
    {
      if (event.target == modal) {
        modal.style.display = "none";
      }
    };
  }
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
