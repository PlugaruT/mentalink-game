var mqtt = require('mqtt');
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
var username_set = false;
var client = mqtt.connect(options);
client.on('connect', function() {
    document.getElementById("status-icon").classList.remove('label-danger');
    document.getElementById("status-icon").classList.add('label-success');
    client.subscribe('/game');
    client.subscribe('/user/login');
    client.subscribe('/user/' + id);
});


function sendName() {
    var info = '{ "user_name" : "' + document.getElementById('nickname').value + '", "login": false, "token": "' + id + '" }';
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
            username_set = true;
            document.getElementById('btn-connect').disabled = false
        } else {
            username_set = false;
            alert('Enter another username');
        }
    }
    // console.log(message.toString());
    // client.end();
});
