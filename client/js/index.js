var mqtt = require('mqtt');
var options = {
    host: '139.59.161.37',
    port: 1883,
    keepalive: 10000,
    qos: 0
};

var username_set = false;
var client = mqtt.connect(options);

client.on('connect', function() {
    document.getElementById("status-icon").classList.remove('label-danger');
    document.getElementById("status-icon").classList.add('label-success');
    client.subscribe('/game');
    client.subscribe('/user/login');
});

function sendName() {
    var info = '{ "user_name" : "' + document.getElementById('nickname').value + '", "login": false }';
    client.publish('/user/connect', info);
}


client.on('message', function(topic, message) {
    if (topic == "/game") {
        console.log(message.toString());
    } else if (topic == '/user/login') {
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
