import './styles.scss';

var urlParams = new URLSearchParams(window.location.search);
var location = urlParams.get('location');

fetch('https://as-sweater-weather.herokuapp.com/api/v1/forecast?location=' + location)
  .then(res => res.json())
  .then(obj => forecast(obj));

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

  debugger;

  $('.top-left').append('<p class="city-state-location">' + city + ', ' + state + '</p>')
  $('.top-left').append('<p class="country-location">' + country + '</p>')
  $('.top-left').append('<p class="current-temps">' + today.current_temperature + '&deg;</p>')
  $('.top-left').append('<p class="high-low-temps"> <strong>High: </strong>' + today.temperature_high + '&deg; <strong>Low: </strong>' + today.temperature_low + '&deg;</p>')
}

function setupFuture(obj) {

}

function forecast(obj) {
  setupToday(obj);
  setupFuture(obj);
  setupBackground(obj);
}
