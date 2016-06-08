var mqtt = require('mqtt');
var ipc = require('electron').ipcRenderer;
var options = {
    host: '139.59.161.37',
    port: 1883,
    keepalive: 10000,
    qos: 0
};

function generateID() {
    var id = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < 10; i++) {
        id += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return id;
}

var id = generateID();
var user_list = {};

var client = mqtt.connect(options);
client.on('connect', function() {
    document.getElementById("status-icon").classList.remove('label-danger');
    document.getElementById("status-icon").classList.add('label-success');
    client.subscribe('/game');
    client.subscribe('/user/login');
    client.subscribe('/user/' + id);
    client.subscribe('/user/list');
});


function sendName() {
    nickName = document.getElementById('nickname').value;
    var info = '{ "user_name" : "' + nickName + '", "login": false, "token": "' + id + '" }';
    console.log(info)
    client.publish('/user/connect', info);
}



client.on('message', function(topic, message) {
    if (topic == "/game") {
        console.log(message.toString());
    } else if (topic == '/user/' + id) {
        obj = JSON.parse(message);
        console.log(obj);
        if (obj.login) {
            ipc.send('lobby-page');
        } else {
            document.getElementById('nickname').value = '';
            alert('Enter another username');
        }
    } else if (topic == '/user/list') {
        user_list = JSON.parse(message);
        if (user_list.users_number >= 2) {
            if (document.body.contains(document.getElementById('btn-lobby'))) {
              document.getElementById('lobby-info').innerHTML = 'You can start the game';
              document.getElementById('btn-lobby').disabled = false;
            }
        }
    }
    // console.log(message.toString());
    // client.end();
});
