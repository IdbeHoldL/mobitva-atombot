/**
 * Стенка на стенку
 * @constructor
 */
var MobitvaBotSleepTask = function (delayInSeconds) {


	MobitvaBotSleepTask.superclass.constructor.call(this);

	this.name = 'Пауза';
	this.description = 'Бот ничего не делает, заданное количество времени';

	this.isWaitingStart = false; // находится ли персонаж в очереди (нажал ли кнопку зарегистрироваться)


	/**
	 *
	 * @type {{delayInSeconds: number}}
	 */
	this.params = {
		delayInSeconds: delayInSeconds
	};

	this.getState = function () {
		return '[' + this.name + '] [' + this.params.delayInSeconds + ']';
	};

	// переопределяем метод. для всех экранов будет возвращаться одна и та же команда
	this.getCommandsForScreen = function (screenName) {
		// сразу же переключаем задачу
		this.bot.NextTask();
		// вызываем команду BotSleep
		return AutoitCommand.BotSleep(this.params.delayInSeconds * 1000);
	};


};
extend(MobitvaBotSleepTask, MobitvaBotDefaultTask);
