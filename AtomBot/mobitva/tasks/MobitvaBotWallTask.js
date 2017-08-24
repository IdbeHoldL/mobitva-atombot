/**
 * Стенка на стенку
 * @constructor
 */
var MobitvaBotWallTask = function (battleLimit) {


	MobitvaBotWallTask.superclass.constructor.call(this);

	this.name = 'Стенка';
	this.description = 'Участвует в турнире стенка на стенку';

	this.isWaitingStart = false; // находится ли персонаж в очереди (нажал ли кнопку зарегистрироваться)

	/**
	 *
	 * @type {{battleLimit: *}}
	 */
	this.params = {
		battleLimit: battleLimit
	};

	this.getState = function () {
		return '[' + this.name + '] [' + this.battleCounter + '/' + this.params.battleLimit + ']';
	};

	/********************* ЭКРАНЫ *********************/

	this.screenEvents['локация'] = function (params) {

		// если в настройках выставлено вмешиваться в грабежи - добавляем задачу вмешательства в грабежи
		if (this.bot.settings.robberyAttack && params.is_red) {
			this.bot.addPriorityTask(new MobitvaBotRobberyAttackTask());
			return [];
		}

		// если провели достаточное количество боев - переходим к следующему заданию
		if (this.battleCounter >= this.params.battleLimit) {
			return this.bot.NextTask();
		}

		return [
			AutoitCommand.BotCheckImageAndClick('кнопка_дуэли')
		]
	};

	this.screenEvents['дуэли'] = function (params) {
		return AutoitCommand.BotCheckImageAndClick('кнопка_турнир')
	};

	this.screenEvents['турнир'] = function (params) {
		return AutoitCommand.BotCheckImageAndClick('кнопка_стенка')
	};

	this.screenEvents['турнир_стенка_выбор_взноса'] = function (params) {
		return AutoitCommand.BotCheckImageAndClick('кнопка_просмотреть')
	};

	this.screenEvents['турнир_стенка_регистрация'] = function (params) {

		return [
			// промотка вниз и решистрация в турнире
			AutoitCommand.BotSendDown(10),
			AutoitCommand.BotCheckImageAndClickEx('кнопка_зарегистрироваться'),
			// ожидание и нажатие кнопку обновить
			AutoitCommand.BotSleep(20000),
			AutoitCommand.BotCheckImageAndClickEx('кнопка_обновить_f1')
		];
	};


};
extend(MobitvaBotWallTask, MobitvaBotDefaultTask);
