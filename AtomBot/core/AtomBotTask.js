/**
 * Задача.
 * Тут определяются события, для разных экранов.
 * Бот будет обрашаться
 * @constructor
 */
var AtomBotTask = function () {

	this.test = {};
	this.test['тест'] = function () {
		return 'AtomBotTask';
	};
	this.test['atomBot'] = function () {
		//console.log(this);
		return 'AtomBotTask default';
	};

	this['тест'] = function () {
		return 1;
	};


	/**
	 * События для экранов (назания события соответствуют навзанию экрана)
	 * @type {{}}
	 */
	this.screenEvents = {};

	/**
	 *
	 * @type {AtomBot}
	 */
	this.bot = false;

	/**
	 *
	 * @param {AtomBot} bot
	 * @returns {*}
	 */
	this.setBot = function (bot) {
		this.bot = bot;
		return this;
	};

	/**
	 * Получить команды для экрана
	 * @param screenName название экрана
	 * @returns {*}
	 */
	this.getCommandsForScreen = function (screenName) {

		/** @type {AtomBotScreen} **/
		var currentScreen = this.bot.getScreenByName(screenName);
		/** @type {AtomBotScreen} **/
		var parentScreen;

		var currentScreenParams = currentScreen.params;

		// если для данного экрана есть событие - вызываем его
		if (typeof this.screenEvents[screenName] === 'function') {
			return this.screenEvents[screenName].call(this, currentScreenParams)
		}

		// если для данного экрана нет события - вызываем событие родительского экрана (перебираем родителькие экраны и ищем событие, которое определено)
		while (parentScreen = currentScreen.parent) {

			if (typeof this.screenEvents[parentScreen.name] === 'function') {
				return this.screenEvents[parentScreen.name].call(this, currentScreenParams)
			}
			currentScreen = parentScreen;
		}

		return [];
	};

	/**
	 * Получить названий экранов, для которых определены события
	 * @returns {Array}
	 */
	this.getScreenEventNames = function () {

		var result = [];
		for (var i in this.screenEvents) {
			if (this.screenEvents.hasOwnProperty(i)) {
				result.push(i);
			}
		}
		return result;
	};

	/**
	 *
	 * @returns {string}
	 */
	this.getState = function () {
		return '';
	};

};

//AtomBotTask.prototype.test = {};
//AtomBotTask.prototype.test['тест'] = function () {
//	return 1;
//};