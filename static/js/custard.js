function loadSummaryTable() {
    html =  '<tbody>';
    html += '  <tr>';
    html += '    <th>Total</th>';
    html += '    <td id="summary-total"></td>';
    html += '  </tr>';
    html += '  <tr>';
    html += '    <th>Due today</th>';
    html += '    <td id="summary-due-today"></td>';
    html += '  </tr>';
    html += '</tbody>';
    document.getElementById('summary').innerHTML = html;
}

function loadTasksTable() {

    // TODO: get tasks from PHP
    var tasks = [
        ['Do thing', 'Do something', 'Sunday, Jan 1, 2017'],
        ['Do thing', 'Do something', 'Sunday, Jan 1, 2017'],
        ['Do thing', 'Do something', 'Sunday, Jan 1, 2017']
    ];

    var html = '';
    html += '<thead>';
    html += '  <tr>';
    html += '    <th>Title</th>';
    html += '    <th>Description</th>';
    html += '    <th>Due</th>';
    html += '  </tr>';
    html += '</thead>';
    html += '<tbody>';
    for (var i = 0; i < tasks.length; i++) {
        html += '  <tr>';
        html += '    <td>' + tasks[i][0] + '</td>';
        html += '    <td>' + tasks[i][1] + '</td>';
        html += '    <td>' + tasks[i][2] + '</td>';
        html += '  </tr>';
    }
    html += '</tbody>';
    document.getElementById('tasks').innerHTML = html;
}

function ajaxTest()
{
    $ajax({
        url: 'custard.php',
        type: 'GET',
        data: {},
        success: function (response) {
            window.alert(response);
        }
    });
}
