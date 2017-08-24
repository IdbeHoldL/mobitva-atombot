/**
 * Класс для описания экранов. Используется для определения интерфейса, который может увидеть бот.
 * @param {string} name название экрана
 * @param {string[]} imageNamesList список названий изображений, которые должны находиться на этом экране
 * @constructor
 */
var AtomBotScreen = function (name, imageNamesList) {

	this.parent = false;

	/**
	 * Название экрана
	 * @type {string}
	 */
	this.name = name;

	/**
	 * Список названий изображений, соответствующие данному экрану
	 * @type {string[]}
	 */
	this.imageNamesList = imageNamesList;

	/**
	 * Список вложенных экранов. Проверка этих экранов будет выполнена, если для текущего экрана было выявлено соответствие
	 * @type {AtomBotScreen[]}
	 */
	this.subScreens = [];

	/**
	 *
	 * @type {{}}
	 */
	this.params = {};

	/**
	 *
	 * @param paramName
	 * @param paramValue
	 */
	this.addParam = function(paramName, paramValue){
		this.params[paramName] = paramValue;
		return this;
	};

	/**
	 * Добавить вложенный экран
	 * @param {AtomBotScreen} botScreen вложенный экран
	 * @returns {AtomBotScreen}
	 */
	this.addSubScreen = function (botScreen) {
		botScreen.setParent(this);
		this.subScreens.push(botScreen);
		return this;
	};

	/**
	 * Установить родительский экран
	 * @param {AtomBotScreen} parentScreen родительский экран
	 */
	this.setParent = function (parentScreen) {
		this.parent = parentScreen;
	};

	/**
	 * Получит родительский экран
	 * @returns {AtomBotScreen}
	 */
	this.getParent = function () {
		return this.parent;
	};

	/**
	 * Получить параметры экрана в виже строки (для дальнейшей обработке в autoit)
	 * @returns {string}
	 */
	this.getScreenParams = function () {
		// пример 'локация_ствгород:локация:иконка_уровень,иконка_хп,кнопка_выход'
		return this.name + ':' + ((this.parent) ? this.getParent().name : '') + ':' + this.imageNamesList.toString();
	};
};