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
    var info = '{ "user_name" : "' + document.getElementById('nickname').value + '" }';
    // console.log(info);
    client.publish('/user/connect', info);
}


client.on('message', function(topic, message) {
    if (topic == "/game") {
        console.log(message.toString());
    } else if (topic == '/user/login') {
        obj = JSON.parse(message);
        console.log(username_set);
        if (!username_set) {
            if (obj.login) {
              username_set = true;
            } else {
              console.log(obj);
              alert('change username');
            }
        }
    }
    // console.log(message.toString());
    // client.end();
});
