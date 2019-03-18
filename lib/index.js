import './styles.scss';

$('#location-submit').click(changeLocation)
const API_URL = 'https://as-sweater-weather.herokuapp.com/api/v1/';

$('#location-submit').click(changeLocation);
$('#register-button').click(() => {
  $('#register-box').show();
  $('#login-box').hide();
});
$('#login-button').click(() => {
  $('#login-box').show();
  $('#register-box').hide();
});

reloadForecast();

function reloadForecast() {
  $('.tl-right').empty();
  $('.tl-left').empty();
  var urlParams = new URLSearchParams(window.location.search);
  var location = urlParams.get('location');

  if (location === null) {
    location = 'denver,co'
    window.location = '/?location=' + location
  }

  fetch('https://as-sweater-weather.herokuapp.com/api/v1/forecast?location=' + location)
  .then(res => res.json())
  .then(obj => forecast(obj));
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

}

function forecast(obj) {
  setupToday(obj);
  setupFuture(obj);
  setupBackground(obj);
}

function changeLocation() {
  var newLocation = $('#location-input').val()
  // window.history.pushState("newlocation", "Title", '?location='+newLocation);
  // reloadForecast();
  window.location = '/?location=' + newLocation
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
