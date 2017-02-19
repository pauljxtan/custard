function getSummary() {
  doTaskRequest('getSummary', loadSummaryTable);
}

function getAllTasks() {
  doTaskRequest('getAllTasks', loadTasksTable);
}

function doTaskRequest(action, loadFunc) {
  $(document).ready(function() {
    data = $(this).serialize() + '&' + $.param({'action': action});
    $.ajax({
      type: 'POST',
      dataType: 'json',
      url: 'php/tasks.php',
      data: data,
      success: function(data, status) {
        loadFunc(data);
      }
    });
  });
}

function loadSummaryTable(data) {
  var total = data['total'];
  var dueToday = data['dueToday'];
  var html = '';
  html =  '<tbody>';
  html += '  <tr>';
  html += '    <th>Total</th>';
  html += '    <td id="summary-total">' + total + '</td>';
  html += '  </tr>';
  html += '  <tr>';
  html += '    <th>Due today</th>';
  html += '    <td id="summary-due-today">' + dueToday + '</td>';
  html += '  </tr>';
  html += '</tbody>';
  document.getElementById('summary').innerHTML = html;
}

function loadTasksTable(data) {
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
  document.getElementById('tasks').innerHTML = html;
}
