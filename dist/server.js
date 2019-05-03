/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./app/server/server.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./app/server/server.js":
/*!******************************!*\
  !*** ./app/server/server.js ***!
  \******************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! path */ \"path\");\n/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(path__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! express */ \"express\");\n/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(express__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var express_handlebars__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! express-handlebars */ \"express-handlebars\");\n/* harmony import */ var express_handlebars__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(express_handlebars__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var request_promise__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! request-promise */ \"request-promise\");\n/* harmony import */ var request_promise__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(request_promise__WEBPACK_IMPORTED_MODULE_3__);\n// index.js\n\n\n\n\nvar app = express__WEBPACK_IMPORTED_MODULE_1___default()(),\n    DIST_DIR = __dirname,\n    HTML_FILE = path__WEBPACK_IMPORTED_MODULE_0___default.a.join(DIST_DIR, \"index.html\");\napp.use(express__WEBPACK_IMPORTED_MODULE_1___default.a[\"static\"](DIST_DIR));\napp.get(\"*\", function (req, res) {\n  res.sendFile(HTML_FILE);\n});\napp.engine(\".hbs\", express_handlebars__WEBPACK_IMPORTED_MODULE_2___default()({\n  defaultLayout: \"main\",\n  extname: \".hbs\",\n  layoutsDir: path__WEBPACK_IMPORTED_MODULE_0___default.a.join(__dirname, \"views/layouts\")\n})); // app.set(\"view engine\", \".hbs\");\n// app.set(\"views\", path.join(__dirname, \"views\"));\n// app.set(\"scripts\", path.join(__dirname, \"scripts\"));\n// app.set(\"assets\", path.join(__dirname, \"assets\"));\n// app.get(\"/\", (request, response) => {\n//   console.log(HTML_FILE);\n//   console.log(template);\n//   console.log(\":)\");\n// });\n// app.get(\"/phaser.js\", function(req, res, next) {\n//   console.log(\"phaser.js delivered\");\n//   res.sendFile(path.resolve(__dirname, \"./scripts/phaser.js\"));\n// });\n// app.get(\"/Scene1.js\", function(req, res, next) {\n//   console.log(\"scene1.js delivered\");\n//   res.sendFile(path.resolve(__dirname, \"./scripts/Scene1.js\"));\n// });\n// app.get(\"/Game.js\", function(req, res, next) {\n//   console.log(\"game.js delivered\");\n//   res.sendFile(path.resolve(__dirname, \"./scripts/Game.js\"));\n// });\n// app.get(\"/runningMan.png\", function(req, res, next) {\n//   console.log(\"runningMan.png delivered\");\n//   res.sendFile(path.resolve(__dirname, \"./assets/runningMan.png\"));\n// });\n// app.get(\"/runningMan2.png\", function(req, res, next) {\n//   console.log(\"runningMan2.png delivered\");\n//   res.sendFile(path.resolve(__dirname, \"./assets/runningMan2.png\"));\n// });\n// app.get(\"/runningMan.json\", function(req, res, next) {\n//   console.log(\"runningMan.json delivered\");\n//   res.sendFile(path.resolve(__dirname, \"./assets/runningMan.json\"));\n// });\n// app.get(\"/flexingMan.png\", function(req, res, next) {\n//   console.log(\"flexingMan.png delivered\");\n//   res.sendFile(path.resolve(__dirname, \"./assets/flexingMan.png\"));\n// });\n// app.get(\"/jumpingMan.png\", function(req, res, next) {\n//   console.log(\"jumpingMan.png delivered\");\n//   res.sendFile(path.resolve(__dirname, \"./assets/jumpingMan.png\"));\n// });\n// app.get(\"/background.png\", function(req, res, next) {\n//   console.log(\"background.png delivered\");\n//   res.sendFile(path.resolve(__dirname, \"./assets/background.png\"));\n// });\n// app.get(\"/floor.png\", function(req, res, next) {\n//   console.log(\"floor.png delivered\");\n//   res.sendFile(path.resolve(__dirname, \"./assets/floor.png\"));\n// });\n// app.get(\"/Ball.js\", function(req, res, next) {\n//   console.log(\"Ball.js delivered\");\n//   res.sendFile(path.resolve(__dirname, \"./scripts/Ball.js\"));\n// });\n// ///spikeball.png\n// app.get(\"/spikeball.png\", function(req, res, next) {\n//   console.log(\"Ball.js delivered\");\n//   res.sendFile(path.resolve(__dirname, \"./assets/spikeball.png\"));\n// });\n// ///replay.png\n// app.get(\"/replay.png\", function(req, res, next) {\n//   console.log(\"ReplayButton delivered\");\n//   res.sendFile(path.resolve(__dirname, \"./assets/replayBtn.png\"));\n// });\n// app.get(\"/backgroundMusic.mp3\", function(req, res, next) {\n//   console.log(\"backgroundMusic delivered\");\n//   res.sendFile(path.resolve(__dirname, \"./assets/backMusic(2).mp3\"));\n// });\n// app.get(\"/ooGnome.mp3\", function(req, res, next) {\n//   console.log(\"ooGnome delivered\");\n//   res.sendFile(path.resolve(__dirname, \"./assets/oo.mp3\"));\n// });\n// app.get(\"/gameOver.mp3\", function(req, res, next) {\n//   console.log(\"GameOver sound delivered\");\n//   res.sendFile(path.resolve(__dirname, \"./assets/gameOver.mp3\"));\n// });\n// app.get(\"/croutching-flex.png\", function(req, res, next) {\n//   console.log(\"croutching-flex delivered\");\n//   res.sendFile(path.resolve(__dirname, \"./assets/croutching-flex.png\"));\n// });\n// app.get(\"/croutching-walk-left.png\", function(req, res, next) {\n//   console.log(\"croutching-walk-left delivered\");\n//   res.sendFile(path.resolve(__dirname, \"./assets/croutching-walk-left.png\"));\n// });\n// app.get(\"/croutching-walk-right.png\", function(req, res, next) {\n//   console.log(\"croutching-walk-left delivered\");\n//   res.sendFile(path.resolve(__dirname, \"./assets/croutching-walk-right.png\"));\n// });\n// app.get(\"/powerUp.png\", function(req, res, next) {\n//   console.log(\"croutching-walk-left delivered\");\n//   res.sendFile(path.resolve(__dirname, \"./assets/powerUp.png\"));\n// });\n\napp.listen(80);\nconsole.log(\"Listening to PORT: 80\");\n\n//# sourceURL=webpack:///./app/server/server.js?");

/***/ }),

/***/ "express":
/*!**************************!*\
  !*** external "express" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"express\");\n\n//# sourceURL=webpack:///external_%22express%22?");

/***/ }),

/***/ "express-handlebars":
/*!*************************************!*\
  !*** external "express-handlebars" ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"express-handlebars\");\n\n//# sourceURL=webpack:///external_%22express-handlebars%22?");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"path\");\n\n//# sourceURL=webpack:///external_%22path%22?");

/***/ }),

/***/ "request-promise":
/*!**********************************!*\
  !*** external "request-promise" ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"request-promise\");\n\n//# sourceURL=webpack:///external_%22request-promise%22?");

/***/ })

/******/ });