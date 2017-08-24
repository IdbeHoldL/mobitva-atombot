/**
 * Охота
 * @param battleLimit
 * @constructor
 */
var MobitvaBotRobberyTask = function (battleLimit) {

	MobitvaBotRobberyTask.superclass.constructor.call(this);

	this.name = 'Грабежи';
	this.description = 'Нападение в грабежах';

	/**
	 *
	 * @type {{mobName: *, battleLimit: *}}
	 */
	this.params = {
		battleLimit: battleLimit
	};

	/**
	 * Возвращает текущее состояние задачи (прогресс выполнения)
	 * @returns {string}
	 */
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

		// если текущая локация не определена, или персонаж находится не в "красной" локации - переходим в Мавкину Рощу (она красная)
		var currentLocation = this.bot.getLocationByNameNode(params.location);

		if (!currentLocation || !currentLocation.isRed) {

			var locationFromName = (typeof params !== 'undefined') ? params.location : false;
			var locationToName = 'Мавкина Роща';

			// перемещение по локациям
			var commands = this.getMoveCommands(locationFromName, locationToName);
			if (commands) {
				return commands;
			}
		}

		// если провели достаточное количество боев - переходим к следующему заданию
		if (this.battleCounter >= this.params.battleLimit) {
			this.bot.NextTask();
			return [];
		}

		return AutoitCommand.BotCheckImageAndClick('кнопка_оранжевая_Дуэли')
	};

	this.screenEvents['дуэли'] = function (params) {
		return AutoitCommand.BotCheckImageAndClick('кнопка_оранжевая_Грабежи')
	};

	this.screenEvents['грабежи'] = function (params) {
		return AutoitCommand.BotCheckImageAndClick('кнопка_оранжевая_Напасть')
	};

	this.screenEvents['грабежи_ожидание_противника'] = function (params) {
		return AutoitCommand.BotSleep(1000); // просто ждем
	};

};
extend(MobitvaBotRobberyTask, MobitvaBotDefaultTask);