
var CLIENT_ID = '982171739723-vof5hncvimgcg6rh00g1q26kltipis6d.apps.googleusercontent.com';
var SCOPES = 'https://www.googleapis.com/auth/drive';


function handleClientLoad() {
  window.setTimeout(checkAuth, 1);
}


function checkAuth() {
  gapi.auth.authorize(
      {'client_id': CLIENT_ID, 'scope': SCOPES, 'immediate': true},
      handleAuthResult);
}


function handleAuthResult(authResult) {
  var authButton = document.getElementById('authorizeButton');
  var filePicker = document.getElementById('filePicker');
  authButton.style.display = 'none';
  filePicker.style.display = 'none';
  if (authResult && !authResult.error) {
    filePicker.style.display = 'block';
    authButton.style.display = 'none';
    filePicker.onchange = uploadFile;
  } else {
    authButton.style.display = 'block';
    authButton.onclick = function() {
        gapi.auth.authorize(
            {'client_id': CLIENT_ID, 'scope': SCOPES, 'immediate': false},
            handleAuthResult);
    };
  }
}

function uploadFile(evt) {
  gapi.client.load('drive', 'v2', function() {
    var file = evt.target.files[0];
    insertFile(file);
  });
}

function insertFile(fileData, callback) {
  const boundary = '-------314159265358979323846';
  const delimiter = "\r\n--" + boundary + "\r\n";
  const close_delim = "\r\n--" + boundary + "--";

  var reader = new FileReader();
  reader.readAsBinaryString(fileData);
  reader.onload = function(e) {
    var contentType = fileData.type || 'application/octet-stream';
    var metadata = {
      'title': fileData.name,
      'mimeType': contentType
    };

    var base64Data = btoa(reader.result);
    var multipartRequestBody =
        delimiter +
        'Content-Type: application/json\r\n\r\n' +
        JSON.stringify(metadata) +
        delimiter +
        'Content-Type: ' + contentType + '\r\n' +
        'Content-Transfer-Encoding: base64\r\n' +
        '\r\n' +
        base64Data +
        close_delim;

    var request = gapi.client.request({
        'path': '/upload/drive/v2/files',
        'method': 'POST',
        'params': {'uploadType': 'multipart'},
        'headers': {
          'Content-Type': 'multipart/mixed; boundary="' + boundary + '"'
        },
        'body': multipartRequestBody});
    if (!callback) {
      callback = function(file) {
        //console.log(file);
        insertarInBd(file);
      };
    }
    request.execute(callback);
  }
}

function uploadFile(evt) {
    var file = evt.target.files[0];
    insertFile(file);
}

function insertFile(fileData, callback) {
  const boundary = '-------314159265358979323846';
  const delimiter = "\r\n--" + boundary + "\r\n";
  const close_delim = "\r\n--" + boundary + "--";

  var reader = new FileReader();
  reader.readAsBinaryString(fileData);
  reader.onload = function(e) {
    var contentType = fileData.type || 'application/octet-stream';
    var metadata = {
      'title': fileData.name,
      'mimeType': contentType
    };

    var base64Data = btoa(reader.result);
    var multipartRequestBody =
        delimiter +
        'Content-Type: application/json\r\n\r\n' +
        JSON.stringify(metadata) +
        delimiter +
        'Content-Type: ' + contentType + '\r\n' +
        'Content-Transfer-Encoding: base64\r\n' +
        '\r\n' +
        base64Data +
        close_delim;

    var request = googleapi.authorize.request({
        'path': '/upload/drive/v2/files',
        'method': 'POST',
        'params': {'uploadType': 'multipart'},
        'headers': {
          'Content-Type': 'multipart/mixed; boundary="' + boundary + '"'
        },
        'body': multipartRequestBody});
    if (!callback) {
      callback = function(file) {
        console.log(file);
        insertarInBd(file);
      };
    }
    request.execute(callback);
  }
}

function insertarInBd(file){
  console.log(file);
  var title = file.title;
  var thumb = file.thumbnailLink;
  var thumfinal = file.thumbnailLink == undefined? 'http://poesiagrafica.com/ServicioProjecManajer/default.jpg': file.thumbnailLink;
  var link = file.webContentLink;
  var idproject = insertProjectCurrent.id_project;
  console.log(title+''+thumfinal+''+link+''+idproject);
  $.ajax({
      url: 'http://poesiagrafica.com/ServicioProjecManajer/driveIn.php',
      type: 'GET',
      dataType: 'json',
      data: {grabar: 'si', title: title, thumb:thumfinal, link:link, defaultim:'', idproject: idproject}
    })
    .done(function(result) {
              
    })
    .fail(function(result) {
      
    })
    .always(function(result) {
      if(!result){
        console.log('No se recuperaron los datos');         
      }else{
        getDrivesItems();
      }
  });
}

function getDrivesItems(){
  console.log('Se recuperaron archivos de Drive');
  var idproject = insertProjectCurrent.id_project;
  $.ajax({
      url: 'http://poesiagrafica.com/ServicioProjecManajer/getDrives.php',
      type: 'GET',
      dataType: 'json',
      data: {grabar: 'si', idproyecto: idproject}
    })
    .done(function(result) {
              
    })
    .fail(function(result) {
      
    })
    .always(function(result) {
      if(!result){
        console.log('No se recuperaron los datos');         
      }else{
        console.log(result);
        drawDrive(result);
      }
  });
}


function drawDrive(result){
  console.log(result);
  var source   = $("#templateDrive").html();
  var template = Handlebars.compile(source);
  
  var navdrive = {
    navdrive:result
  };

  console.log('nav '+navdrive);

  Handlebars.registerHelper('list', function(context, options) {
    console.log(context);
    var ret = "<ul data-role='listview' class='list-drive ui-listview ui-listview-inset ui-corner-all ui-shadow' data-filter='true' data-input='#filterBasic-input' data-inset='true'>";

    for(var i=0, j=context.length; i<j; i++) {
      ret = ret + "<li class='ui-li-has-thumb ui-first-child ui-last-child'>" + options.fn(context[i]) + "</li>";
    }

    return ret + "</ul>";
  });




  var html = template(navdrive);

  console.log(html);

  $("#drive .content-drive").html(html);


  //var sectleft = $('.content-drive .list-drive');
  //sectleft.listview('refresh');
}

