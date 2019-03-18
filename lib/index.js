import './styles.scss';

const API_URL = 'https://as-sweater-weather.herokuapp.com/api/v1/'

$('#location-submit').click(changeLocation)

var current_user = '3bd8897bacc01b8c5883945384d93f4847f1e13b6333b3c35f45cf8c04895364'

reloadForecast();
getFavorites();

function getFavorites() {
  fetch(`${API_URL}/favorites?api_key=${current_user}`)
    .then(res => res.json())
    .then(obj => addFavorites(obj));
}

function addFavorites(obj) {
  for (var i = 0; i < obj.data.length; i++) {
    getFavorite(obj.data[i].id);
  }
}

function addFavorite(fav) {
  var city = fav.name.split(',')[0]
  var state = fav.name.split(',')[1]
  $('.favorites-list').append(`<li class="favorite"><a href="/?location=${fav.name}">${city.charAt(0).toUpperCase() + city.slice(1)}, ${state.toUpperCase()}</a></li>`);
}

function getFavorite(id) {
  fetch(`${API_URL}locations?location=${id}&api_key=${current_user}`)
    .then(res => res.json())
    .then(fav => addFavorite(fav.data.attributes));
}

function reloadForecast() {
  $('.tl-right').empty();
  $('.tl-left').empty();
  var urlParams = new URLSearchParams(window.location.search);
  var location = urlParams.get('location');

  if (location === null) {
    location = 'denver,co'
    window.location = '/?location=' + location
  }

  fetch(`${API_URL}forecast?location=${location}`)
  .then(res => res.json())
  .then(obj => forecast(obj))
  .catch(error => console.error('API Call failed: ' + error))
}

function changeBackground(url) {
  console.log('setting bg image: ' + url);
  $('body').css('background-image', 'url(' + url + ')');
}

function setupBackground(obj) {
  fetch(obj.data.info.background_href)
  .then(res => res.json())
  .then(jsonObject => changeBackground(jsonObject.data.url));
}

function setupToday(obj) {
  var city = obj.data.info.city
  var state = obj.data.info.state
  var country = obj.data.info.country
  var today = obj.data.weather.today

  $('.tl-right').append('<p class="city-state-location">' + city + ', ' + state + '</p>')
  $('.tl-right').append('<p class="country-location">' + country + '</p>')
  $('.tl-right').append('<p class="time">' + formatDate() + '</p>')
  $('.tl-left').append('<p class="current-weather">' + today.weather_type + '</p>')
  $('.tl-left').append('<p class="current-temp">' + Math.ceil(today.current_temperature) + '&deg;</p>')
  $('.tl-left').append('<p class="high-low-temps"> <strong>High: </strong>' + Math.ceil(today.temperature_high) + '&deg; <strong>Low: </strong>' + Math.ceil(today.temperature_low) + '&deg;</p>')
}

function setupFuture(obj) {
  var hourly = obj.data.weather.today.hourly;
  var future = obj.data.weather.future;
  for (var i = 0; i < 7; i++) {
    var html = [
      `<div class="hourly-temperature"><p>T + ${i+1} hr(s)</p>`,
      `<p>${Math.ceil(hourly[i])}&deg;</p></div>`
    ].join('');
    $('#hourly-forecast').append(html);
  }
  for (var j = 1; j < 6; j++) {
    $(`#forecast-day-${j}`).append(`<div class="future-data">${future.data[j].day}</div>`);
    $(`#forecast-day-${j}`).append(`<div class="future-data">${future.data[j].weather_type}</div>`);
    $(`#forecast-day-${j}`).append(`<div class="future-data">${(future.data[j].precipitation_chance * 100)}%</div>`);
    $(`#forecast-day-${j}`).append(`<div class="future-data"><strong>High:</strong> ${Math.ceil(future.data[j].temperature_low)}&deg;</div>`);
    $(`#forecast-day-${j}`).append(`<div class="future-data"><strong>Low:</strong> ${Math.ceil(future.data[j].temperature_high)}&deg;</div>`);
  }
}

function forecast(obj) {
  setupToday(obj);
  setupFuture(obj);
  setupBackground(obj);
}

function changeLocation() {
  var newLocation = $('#location-input').val()
  window.history.pushState("newlocation", "Title", '?location='+newLocation);
  reloadForecast();
}

function formatDate() {
  var d = new Date();
  var hours = d.getHours()
  var pm = false

  if (hours > 12) {
    hours -= 12;
    pm = true;
  }

  var time = hours + ':' + d.getMinutes();

  if (pm) {
    time += ' PM'
  }

  var date = (parseInt(d.getMonth()) + 1) + '/' + d.getDate();
  var datetime = time + ' – ' + date;

  return datetime;
}
