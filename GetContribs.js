const user = 'krissemicolon';
const date = new Date();
const daydate = date.getDate();
const monthdate = date.getMonth()+1;
const yeardate = date.getFullYear();
const day = yeardate+"-"+monthdate+"-"+daydate;

fetch('https://urlreq.appspot.com/req?method=GET&url=https%3A%2F%2Fgithub.com%2Fusers%2F' + user + '%2Fcontributions%3Fto%3D' + day)
    .then(function(response) {
        return response.text();
    })
    .then(function(text) {
        xmlDoc = new DOMParser().parseFromString(text, 'text/xml');
        const nodes = xmlDoc.getElementsByTagName('rect');
        const dayContributions = nodes[nodes.length - 1].getAttribute('data-count');
        console.log("User: "+user+" Date: "+day+" Contribs: "+dayContributions);
    })
    .catch(function(error) {
        console.log('Request failed', error)
    });
