/**
 * Охота
 * @param mobName
 * @param battleLimit
 * @constructor
 */
var MobitvaBotHuntTask = function (mobName, battleLimit) {

	MobitvaBotHuntTask.superclass.constructor.call(this);

	this.name = 'Охота';
	this.description = 'Проводит бой с мобом';

	/**
	 *
	 * @type {{mobName: *, battleLimit: *}}
	 */
	this.params = {
		mobName    : mobName,
		battleLimit: battleLimit
	};

	/**
	 * Возвращает текущее состояние задачи (прогресс выполнения)
	 * @returns {string}
	 */
	this.getState = function () {
		return '[' + this.name + '] [' + this.params.mobName + ' ' + this.battleCounter + '/' + this.params.battleLimit + ']';
	};

	/********************* ЭКРАНЫ *********************/

	this.screenEvents['локация'] = function (params) {

		// если в настройках выставлено вмешиваться в грабежи - добавляем задачу вмешательства в грабежи
		if (this.bot.settings.robberyAttack && params.is_red) {
			this.bot.addPriorityTask(new MobitvaBotRobberyAttackTask());
			return [];
		}

		var locationFromName = (typeof params !== 'undefined') ? params.location : false;
		var locationTo = this.bot.getMobLocation(this.params.mobName);
		var locationToName = (locationTo) ? locationTo.nameNode : false;

		// перемещение по локациям
		var commands = this.getMoveCommands(locationFromName, locationToName);
		if (commands) {
			return commands;
		}

		// если провели достаточное количество боев - переходим к следующему заданию
		if (this.battleCounter >= this.params.battleLimit) {
			this.bot.NextTask();
			return [];
		}

		return AutoitCommand.BotCheckImageAndClick('кнопка_охота')
	};

	this.screenEvents['охота'] = function (params) {

		var mob = this.bot.getMobByName(this.params.mobName)
		if (!mob) {
			return AutoitCommand.ConsoleWrite('Неизвестный моб : ' + this.params.mobName);
		}

		
		return AutoitCommand.BotCheckImageAndClickDouble(mob.getImageName(), 'кнопка_назад_f2');
	};

	this.screenEvents['охота_атаковать'] = function (params) {
		return AutoitCommand.BotCheckImageAndClick('кнопка_атаковать');
	};

};
extend(MobitvaBotHuntTask, MobitvaBotDefaultTask);