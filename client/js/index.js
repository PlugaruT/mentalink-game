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
    client.subscribe('/user/game/' + id);
    client.subscribe('/game/start');
    client.subscribe('/game/image');
});


function sendName() {
    var nickName = document.getElementById('nickname').value;
    var info = '{ "user_name" : "' + nickName + '", "login": false, "token": "' + id + '" }';
    console.log(info)
    client.publish('/user/connect', info);
}

function startGame() {
    var info = '{"token": "' + id + '"  }';
    client.publish('/user/start', info);
}

function sendAnswer() {
    if (document.body.contains(document.getElementById('answer'))) {
        if (document.getElementById('img-link').src !== '') {
            // document.getElementById('answer').disable = false;
            // document.getElementById('submit-ans').disable = false;
            var answer = document.getElementById('answer').value
            var info = '{"token": "' + id + '", "guess": "' + answer + '" }';
            console.log(info);
        }
    }
}

client.on('message', function(topic, message) {
    obj = JSON.parse(message);
    if (topic == "/game/start") {
        ipc.send('game-page');
        console.log(message.toString());
        if (document.body.contains(document.getElementById('game-status'))) {
            document.getElementById('game-status').innerHTML = obj.info;
        }
    } else if (topic == '/user/' + id) {
        console.log(obj);
        if (obj.login) {
            ipc.send('lobby-page');
        } else {
            document.getElementById('nickname').value = '';
            alert('Enter another username');
        }
    } else if (topic == '/user/list') {
        if (obj.users_number >= 2) {
            if (document.body.contains(document.getElementById('btn-lobby'))) {
                document.getElementById('lobby-info').innerHTML = 'You can start the game';
                document.getElementById('btn-lobby').disabled = false;
            }
        }
    } else if (topic == '/game/image') {
        document.getElementById('img-link').src = obj.image;
        console.log(obj);
    }
    // console.log(message.toString());
    // client.end();
});
