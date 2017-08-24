/**
 * Квест восстановления выносливости (вигор)
 * @param mobImageName
 * @param battleLimit
 * @constructor
 */
var MobitvaBotQuestVigorTask = function () {

	//this.test = {};
	MobitvaBotQuestVigorTask.superclass.constructor.call(this);

	this.name = 'Квест вигор';
	this.description = 'Бот отправляется в Стагород, покупает вигор, восстановливает выносливость';
	this.isPurchased = false; // куплен/не куплен вигор

	/********************* ЭКРАНЫ *********************/

	this.screenEvents['локация'] = function (params) {

		// если в настройках выставлено вмешиваться в грабежи - добавляем задачу вмешательства в грабежи
		if (this.bot.settings.robberyAttack && params.is_red) {
			this.bot.addPriorityTask(new MobitvaBotRobberyAttackTask());
			return [];
		}

		if (this.isPurchased == true) {
			this.bot.NextTask();
			return [];
		}

		var locationFromName = (typeof params !== 'undefined') ? params.location : false;
		var locationToName = 'Стагород';

		// перемещение по локациям
		var commands = this.getMoveCommands(locationFromName, locationToName);
		if (commands) {
			return commands;
		}

		return [
			AutoitCommand.BotSend('9',1)// Жмем кнопку 9 (открываем магазин)
		];
	};

	this.screenEvents['магазин'] = function (params) {
		// если уже купили - выходим из магазина
		if (this.isPurchased == true) {
			return AutoitCommand.BotCheckImageAndClick('кнопка_коричневая_Назад')
		}

		return AutoitCommand.BotCheckImageAndClickDouble('кнопка_оранжевая_Разное','кнопка_коричневая_Назад');
	};

	this.screenEvents['магазин_каталог'] = function (params) {
		// если уже купили - выходим из магазина
		if (this.isPurchased == true) {
			return AutoitCommand.BotCheckImageAndClick('кнопка_коричневая_Назад')
		}
		return AutoitCommand.BotCheckImageAndClickDouble('текст_Вигор','кнопка_коричневая_Назад');
	};

	this.screenEvents['магазин_карточка_товара'] = function (params) {

		var itemName = (typeof params !== 'undefined') ? params.item : false;

		if (itemName == 'вигор') {
			return AutoitCommand.BotCheckImageAndClickDouble('текст_купить','кнопка_коричневая_Назад');
		}

		return AutoitCommand.BotCheckImageAndClick('кнопка_коричневая_Назад');
	};

	this.screenEvents['сообщение_белое_куплен'] = function (params) {
		this.isPurchased = true;
		return AutoitCommand.BotCheckImageAndClick('кнопка_оранжевая_Ок');
	};

	// переопределяем событие, чтобы случайно не взять квест 2 раза
	this.screenEvents['сообщение_выносливость'] = function (params) {
		return AutoitCommand.BotCheckImageAndClick('кнопка_далее')
	};

};
extend(MobitvaBotQuestVigorTask, MobitvaBotDefaultTask);