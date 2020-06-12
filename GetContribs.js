const user = 'krissemicolon';
const date = new Date();
const daydate = date.getDate();
const monthdate = date.getMonth();
const yeardate = date.getFullYear();
const day = yeardate+"-"+monthdate+"-"+daydate;

fetch('https://urlreq.appspot.com/req?method=GET&url=https%3A%2F%2Fgithub.com%2Fusers%2F' + user + '%2Fcontributions%3Fto%3D' + day)
    .then(function(response) {
        return response.text();
    })
    .then(function(text) {
        xmlDoc = new DOMParser().parseFromString(text, 'text/xml');
        var nodes = xmlDoc.getElementsByTagName('rect');
        var dayContributions = nodes[nodes.length-1].getAttribute('data-count');
        console.log(dayContributions);
    })
    .catch(function(error) {
        console.log('Request failed', error)
        
    });

chrome.browserAction.setBadgeText("5");

//chrome.browserAction.setBadgeText({text: "5"});
