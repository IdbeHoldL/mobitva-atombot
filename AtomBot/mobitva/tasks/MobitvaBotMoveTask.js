/**
 * Стенка на стенку
 * @constructor
 */
var MobitvaBotMoveTask = function (locationName) {


	MobitvaBotMoveTask.superclass.constructor.call(this);

	this.name = 'Переход';
	this.description = 'Переходит в указанную локацию';

	this.isWaitingStart = false; // находится ли персонаж в очереди (нажал ли кнопку зарегистрироваться)

	/**
	 *
	 * @type {{battleLimit: *}}
	 */
	this.params = {
		locationName: locationName
	};

	this.getState = function () {
		return '[' + this.name + '] [' + this.params.locationName + ']';
	};

	/********************* ЭКРАНЫ *********************/


};
extend(MobitvaBotMoveTask, MobitvaBotDefaultTask);
