/**
 * AutoitCommand
 * Класс-транслятор с js на autoit
 * @constructor
 */
var AtomBotAutoitCommand = function () {

	/**
	 * Клик по координатам
	 * @param x (number) координата X
	 * @param y (number) координата Y
	 * @returns {string}
	 * @constructor
	 */
	this.BotClick = function (x, y) {
		return 'BotClick(' + x + ',' + y + ')';
	};

	/**
	 * Пауза
	 * @param {number} delay задержка в миллисекундах
	 * @returns {string}
	 * @constructor
	 */
	this.BotSleep = function (delay) {
		return 'BotSleep(' + delay + ')';
	};

	/**
	 * Проверить наличие картинки на экране и кликнуто по ней
	 * @param {string} imageName название картики
	 * @returns {string}
	 * @constructor
	 */
	this.BotCheckImageAndClick = function (imageName) {
		return "BotCheckImageAndClick('" + imageName + "')";
	};

	/**
	 * Отправка сообщений окну эмулятора
	 * @param str
	 * @param count
	 * @returns {string}
	 * @constructor
	 */
	this.BotSend = function (str, count) {
		if (typeof count === 'undefined'){
			count = 1;
		}
		return "BotControlSend('" + str + "'," + count + ")";
	};

	/**
	 * Нажать клавишу вниз
	 * @param {number} count
	 * @returns {string}
	 * @constructor
	 */
	this.BotSendDown = function (count) {
		if (typeof count === 'undefined') {
			return "BotControlSend('{down}')";
		}
		return "BotControlSend('{down}'," + count + ")";
	};

	/**
	 * Нажать клавишу вверх
	 * @param {number} count
	 * @returns {string}
	 * @constructor
	 */
	this.BotSendUp = function (count) {
		if (typeof count === 'undefined') {
			return "BotControlSend('{up}')";
		}
		return "BotControlSend('{up}'," + count + ")";
	};

	/**
	 * Нажать клавишу лево
	 * @param {number} count
	 * @returns {string}
	 * @constructor
	 */
	this.BotSendLeft = function (count) {
		if (typeof count === 'undefined') {
			return "BotControlSend('{left}')";
		}
		return "BotControlSend('{left}'," + count + ")";
	};

	/**
	 * Нажать клавишу право
	 * @param {number} count
	 * @returns {string}
	 * @constructor
	 */
	this.BotSendRight = function (count) {
		if (typeof count === 'undefined') {
			return "BotControlSend('{right}')";
		}
		return "BotControlSend('{right}'," + count + ")";
	};

	/**
	 * Нажать клавишу enter
	 * @param {number} count
	 * @returns {string}
	 * @constructor
	 */
	this.BotSendEnter = function (count) {
		if (typeof count === 'undefined') {
			return "BotControlSend('{enter}')";
		}
		return "BotControlSend('{enter}'," + count + ")";
	};


	/**
	 * Вывод в консоль. Используется для дебага
	 * @param {string} str строка
	 * @returns {string}
	 * @constructor
	 */
	this.ConsoleWrite = function (str) {
		return 'BotLog("' + str + '" & @CRLF )';
		//return 'ConsoleWrite("' + str + '" & @CRLF )';
	};

};