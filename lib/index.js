import './styles.scss'

fetch('https://as-sweater-weather.herokuapp.com/api/v1/backgrounds?location=denver,co')
  .then(res => res.json())
  .then(obj => changeBackground(obj.data.url));

function changeBackground(url) {
  console.log('setting bg image: ' + url);
  $('#container').css('background-image', 'url(' + url + ')');
}
