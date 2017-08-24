/**
 * Дуэли
 * @constructor
 */
var MobitvaBotDuelTask = function (battleLimit) {


	MobitvaBotDuelTask.superclass.constructor.call(this);

	this.name = 'Дуэль';
	this.description = 'Проводит дуель с равным противником';

	this.params = {
		battleLimit: battleLimit
	};

	this.getState = function () {
		return '[' + this.name + '] [' + this.battleCounter + '/' + this.params.battleLimit + ']';
	};

	/********************* ЭКРАНЫ *********************/

	this.screenEvents['локация'] = function (params) {


		//console.log(params);

		// если в настройках выставлено вмешиваться в грабежи - добавляем задачу вмешательства в грабежи
		if (this.bot.settings.robberyAttack && params.is_red) {
			this.bot.addPriorityTask(new MobitvaBotRobberyAttackTask());
			return [];
		}

		// если провели достаточное количество боев - переходим к следующему заданию
		if (this.battleCounter >= this.params.battleLimit) {
			return this.bot.NextTask();
		}

		//return AutoitCommand.BotCheckImageAndClick('кнопка_дуэли');
		return AutoitCommand.BotCheckImageAndClickDouble('кнопка_дуэли','кнопка_красная_Дуэли');

		//return AutoitCommand.BotSend('8',2);
	};

	this.screenEvents['дуэли'] = function (params) {
		return AutoitCommand.BotCheckImageAndClick('кнопка_оранжевая_Начать поединок');
	};

	this.screenEvents['дуэли_ожидание_противника'] = function (params) {
		return AutoitCommand.BotSleep(1);
	};


};
extend(MobitvaBotDuelTask, MobitvaBotDefaultTask);
