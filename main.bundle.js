/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	__webpack_require__(1);

	var API_URL = 'https://as-sweater-weather.herokuapp.com/api/v1/';

	$('#location-submit').click(changeLocation);

	var current_user = '3bd8897bacc01b8c5883945384d93f4847f1e13b6333b3c35f45cf8c04895364';

	reloadForecast();
	getFavorites();

	function getFavorites() {
	  fetch(API_URL + '/favorites?api_key=' + current_user).then(function (res) {
	    return res.json();
	  }).then(function (obj) {
	    return addFavorites(obj);
	  });
	}

	function addFavorites(obj) {
	  for (var i = 0; i < obj.data.length; i++) {
	    getFavorite(obj.data[i].id);
	  }
	}

	function addFavorite(fav) {
	  var city = fav.name.split(',')[0];
	  var state = fav.name.split(',')[1];
	  $('.favorites-list').append('<li class="favorite"><a href="/?location=' + fav.name + '">' + (city.charAt(0).toUpperCase() + city.slice(1)) + ', ' + state.toUpperCase() + '</a></li>');
	}

	function getFavorite(id) {
	  fetch(API_URL + 'locations?location=' + id + '&api_key=' + current_user).then(function (res) {
	    return res.json();
	  }).then(function (fav) {
	    return addFavorite(fav.data.attributes);
	  });
	}

	function reloadForecast() {
	  $('.tl-right').empty();
	  $('.tl-left').empty();
	  var urlParams = new URLSearchParams(window.location.search);
	  var location = urlParams.get('location');

	  if (location === null) {
	    location = 'denver,co';
	    window.location = '/self_directed_sweater_weather/?location=' + location;
	  }

	  fetch(API_URL + 'forecast?location=' + location).then(function (res) {
	    return res.json();
	  }).then(function (obj) {
	    return forecast(obj);
	  }).catch(function (error) {
	    return console.error('API Call failed: ' + error);
	  });
	}

	function changeBackground(url) {
	  console.log('setting bg image: ' + url);
	  $('body').css('background-image', 'url(' + url + ')');
	}

	function setupBackground(obj) {
	  fetch(obj.data.info.background_href).then(function (res) {
	    return res.json();
	  }).then(function (jsonObject) {
	    return changeBackground(jsonObject.data.url);
	  });
	}

	function setupToday(obj) {
	  var city = obj.data.info.city;
	  var state = obj.data.info.state;
	  var country = obj.data.info.country;
	  var today = obj.data.weather.today;

	  $('.tl-right').append('<p class="city-state-location">' + city + ', ' + state + '</p>');
	  $('.tl-right').append('<p class="country-location">' + country + '</p>');
	  $('.tl-right').append('<p class="time">' + formatDate() + '</p>');
	  $('.tl-left').append('<p class="current-weather">' + today.weather_type + '</p>');
	  $('.tl-left').append('<p class="current-temp">' + Math.ceil(today.current_temperature) + '&deg;</p>');
	  $('.tl-left').append('<p class="high-low-temps"> <strong>High: </strong>' + Math.ceil(today.temperature_high) + '&deg; <strong>Low: </strong>' + Math.ceil(today.temperature_low) + '&deg;</p>');
	}

	function setupFuture(obj) {
	  var hourly = obj.data.weather.today.hourly;
	  var future = obj.data.weather.future;
	  for (var i = 0; i < 7; i++) {
	    var html = ['<div class="hourly-temperature"><p>T + ' + (i + 1) + ' hr(s)</p>', '<p>' + Math.ceil(hourly[i]) + '&deg;</p></div>'].join('');
	    $('#hourly-forecast').append(html);
	  }
	  for (var j = 1; j < 6; j++) {
	    $('#forecast-day-' + j).append('<div class="future-data">' + future.data[j].day + '</div>');
	    $('#forecast-day-' + j).append('<div class="future-data">' + future.data[j].weather_type + '</div>');
	    $('#forecast-day-' + j).append('<div class="future-data">' + future.data[j].precipitation_chance * 100 + '%</div>');
	    $('#forecast-day-' + j).append('<div class="future-data"><strong>High:</strong> ' + Math.ceil(future.data[j].temperature_low) + '&deg;</div>');
	    $('#forecast-day-' + j).append('<div class="future-data"><strong>Low:</strong> ' + Math.ceil(future.data[j].temperature_high) + '&deg;</div>');
	  }
	}

	function forecast(obj) {
	  setupToday(obj);
	  setupFuture(obj);
	  setupBackground(obj);
	}

	function changeLocation() {
	  var newLocation = $('#location-input').val();
	  window.history.pushState("newlocation", "Title", '?location=' + newLocation);
	  reloadForecast();
	}

	function formatDate() {
	  var d = new Date();
	  var hours = d.getHours();
	  var pm = false;

	  if (hours > 12) {
	    hours -= 12;
	    pm = true;
	  }

	  var time = hours + ':' + d.getMinutes();

	  if (pm) {
	    time += ' PM';
	  }

	  var date = parseInt(d.getMonth()) + 1 + '/' + d.getDate();
	  var datetime = time + ' – ' + date;

	  return datetime;
	}

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(2);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(4)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!../node_modules/css-loader/index.js!../node_modules/sass-loader/index.js!./styles.scss", function() {
				var newContent = require("!!../node_modules/css-loader/index.js!../node_modules/sass-loader/index.js!./styles.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(3)();
	// imports


	// module
	exports.push([module.id, "p {\n  margin: 0; }\n\nbody {\n  background-color: grey;\n  background-repeat: no-repeat;\n  background-size: 100%; }\n\n#grid-container {\n  display: grid;\n  grid-template-columns: repeat(2, 1fr);\n  grid-template-rows: repeat(4, 1fr);\n  grid-template-areas: \"top-left top-right\" \"bottom bottom\" \"bottom bottom\" \"favorites favorites\";\n  width: 950px;\n  margin: 0 auto; }\n\n.location-box {\n  text-align: center;\n  width: 200px;\n  margin: 0 auto;\n  padding: 5px;\n  border: 3px black solid;\n  background-color: grey; }\n\n.favorites {\n  grid-area: favorites; }\n\n.top-left {\n  grid-area: top-left;\n  padding: 10px;\n  display: grid;\n  grid-template-rows: 1fr;\n  grid-template-columns: 3fr; }\n\n.tl-right {\n  grid-column: 2;\n  margin: auto; }\n\n.tl-left {\n  grid-column: 1;\n  margin: auto; }\n\n.top-right {\n  grid-area: top-right;\n  padding: 10px; }\n\n.bottom {\n  grid-area: bottom;\n  padding: 10px;\n  position: relative; }\n\n#hourly-forecast {\n  display: grid;\n  grid-template-rows: 1fr;\n  grid-template-columns: repeat(8, 1fr);\n  height: 75px; }\n\n.login-register-box {\n  text-align: right; }\n\n#hourly-forecast,\n.forecast-day {\n  width: 100%;\n  display: flex;\n  justify-content: space-between;\n  border-spacing: 10px;\n  border-collapse: separate; }\n\n.bottom,\n.favorites,\n.top-left,\n.top-right {\n  border: 3px black solid;\n  margin: 5px;\n  padding: 5px;\n  background-color: grey; }\n\n.city-state-location,\n.country-location,\n.time {\n  text-align: right; }\n\n.current-temp {\n  font-size: 35pt; }\n", ""]);

	// exports


/***/ }),
/* 3 */
/***/ (function(module, exports) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function() {
		var list = [];

		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for(var i = 0; i < this.length; i++) {
				var item = this[i];
				if(item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};

		// import a list of modules into the list
		list.i = function(modules, mediaQuery) {
			if(typeof modules === "string")
				modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for(var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if(typeof id === "number")
					alreadyImportedModules[id] = true;
			}
			for(i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if(mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if(mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(self.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0,
		styleElementsInsertedAtTop = [];

	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}

		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();

		// By default, add <style> tags to the bottom of <head>.
		if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

		var styles = listToStyles(list);
		addStylesToDom(styles, options);

		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}

	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}

	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}

	function insertStyleElement(options, styleElement) {
		var head = getHeadElement();
		var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
		if (options.insertAt === "top") {
			if(!lastStyleElementInsertedAtTop) {
				head.insertBefore(styleElement, head.firstChild);
			} else if(lastStyleElementInsertedAtTop.nextSibling) {
				head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
			} else {
				head.appendChild(styleElement);
			}
			styleElementsInsertedAtTop.push(styleElement);
		} else if (options.insertAt === "bottom") {
			head.appendChild(styleElement);
		} else {
			throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
		}
	}

	function removeStyleElement(styleElement) {
		styleElement.parentNode.removeChild(styleElement);
		var idx = styleElementsInsertedAtTop.indexOf(styleElement);
		if(idx >= 0) {
			styleElementsInsertedAtTop.splice(idx, 1);
		}
	}

	function createStyleElement(options) {
		var styleElement = document.createElement("style");
		styleElement.type = "text/css";
		insertStyleElement(options, styleElement);
		return styleElement;
	}

	function createLinkElement(options) {
		var linkElement = document.createElement("link");
		linkElement.rel = "stylesheet";
		insertStyleElement(options, linkElement);
		return linkElement;
	}

	function addStyle(obj, options) {
		var styleElement, update, remove;

		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement(options));
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement(options);
			update = updateLink.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement(options);
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
			};
		}

		update(obj);

		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}

	var replaceText = (function () {
		var textStore = [];

		return function (index, replacement) {
			textStore[index] = replacement;
			return textStore.filter(Boolean).join('\n');
		};
	})();

	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;

		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}

	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;

		if(media) {
			styleElement.setAttribute("media", media)
		}

		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}

	function updateLink(linkElement, obj) {
		var css = obj.css;
		var sourceMap = obj.sourceMap;

		if(sourceMap) {
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}

		var blob = new Blob([css], { type: "text/css" });

		var oldSrc = linkElement.href;

		linkElement.href = URL.createObjectURL(blob);

		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ })
/******/ ]);