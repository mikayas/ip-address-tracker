const urlGetIpAddress = 'https://api.ipify.org?format=json';
const apiKey = 'at_see9AJ76MVjc8nmCo0xH49XsfgDZr';
var map;

const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');

const getContentIp = document.getElementById('get-content-ip');
const getContentLocal = document.getElementById('get-content-local');
const getContentTimezone = document.getElementById('get-content-timezone');
const getContentIsp = document.getElementById('get-content-isp');
const contentInBlockPanel = document.querySelectorAll('.container-panel > * > span');

async function getDataUrl(url) {
    try {
        const data = await fetch(url);
        return await data.json();
    } catch (err) {
        return console.log(`${err}: response fail`);
    }
}

async function getIpAddress() {
    var getYourIP = window.confirm('allow to add your IP address to the search?');
    if (getYourIP) {
        const ipValue = await getDataUrl(urlGetIpAddress);
        searchInput.value = ipValue.ip;
    }
}

async function getIpData() {
    try {
        const ipData = await getDataUrl(`https://geo.ipify.org/api/v2/country,city?apiKey=${apiKey}&ipAddress=${searchInput.value}`);
        getContentIp.innerHTML = ipData.ip;
        getContentLocal.innerHTML = `${ipData.location.city}, ${ipData.location.region} ${ipData.location.postalCode}`;
        getContentTimezone.innerHTML = `UTC ${ipData.location.timezone}`;
        getContentIsp.innerHTML = ipData.isp;
        
        if (map === undefined) {
            map = L.map('renderMap').setView([ipData.location.lat, ipData.location.lng], 13);
        }else {
            map.remove()
            map = L.map('renderMap').setView([ipData.location.lat, ipData.location.lng], 13);
        }
        
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
             attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
        L.marker([ipData.location.lat, ipData.location.lng]).addTo(map)
            .bindPopup('IP position')
            .openPopup();

    }catch {
        contentInBlockPanel.forEach((el) => {el.innerHTML = ''})
        window.alert('ERROR\nIP address invalid')
    }
}

getIpAddress();

searchButton.addEventListener('click', () => {
    getIpData()
})