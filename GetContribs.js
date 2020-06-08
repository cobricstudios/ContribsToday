const user = 'fabpot';
const day = "2016-12-25";

fetch('https://urlreq.appspot.com/req?method=GET&url=https%3A%2F%2Fgithub.com%2Fusers%2F' + user + '%2Fcontributions%3Fto%3D' + day)
    .then(function(response) {
        return response.text();
    })
    .then(function(text) {
        xmlDoc = new DOMParser().parseFromString(text, 'text/xml');
        var nodes = xmlDoc.getElementsByTagName('rect');
        var dayContributions = nodes[nodes.length-1].getAttribute('data-count');
        console.log('contributions count for ' + day + ' : ' + dayContributions);
    })
    .catch(function(error) {
        console.log('Request failed', error)
    });
