/**
 * Atom Bot. Ядро бота.
 * Принцип работы:
 * Подпрограмма, занимающаяся непосредственно взаимодействием с интерфейсом,
 * отправляет боту назвние экрана, который был определен (см. AtomBotTask).
 * В ответ получает список комманд, которые нужно выполнить, чтобы
 * приблизиться к выполнению текущей задачи (см. AtomBotTask)
 * @constructor
 */
var AtomBot = function () {

	/**
	 * Список экранов
	 * @type {AtomBotScreen[]}
	 */
	this.screenList = [];
	/**
	 * Список задач
	 * @type {AtomBotTask[]}
	 */
	this.taskList = [];
	/**
	 * Настройки
	 * @type {*}
	 */
	this.settings = null;
	/**
	 * Номер текущей задачи
	 * @type {number}
	 */
	this.currentTaskIndex = 0;

	/**
	 * Название предыдушего экрана
	 * @type {string}
	 */
	this.lastScreenName = '';

	/**
	 * Название текущего экрана
	 * @type {string}
	 */
	this.currentScreenName = '';

	/**
	 * Инициализация
	 * @param screenList список настроек
	 */
	this.init = function (screenList) {
		this.screenList = screenList;
	};


	/**
	 * Загрузить натройки
	 * @param settings
	 */
	this.loadSettings = function (settings) {
		this.settings = settings;
	};

	/**
	 * Загрузить список задач
	 * @param taskList
	 */
	this.loadTasks = function (taskList) {

	};


	///**
	// *
	// * @param name
	// * @param params
	// * @returns {*}
	// */
	//this.createNewTask = function (name, params) {
	//
	//	switch (name.toLowerCase()) {
	//		case 'default'  :
	//			return (new DefaultTask());
	//		case 'duel'     :
	//			return (new DuelTask(params));
	//	}
	//};

	/**
	 * Перейти к выполнению следующей задаче
	 * @constructor
	 */
	this.NextTask = function () {
		this.currentTaskIndex++;
	};

	/**
	 * Добавляет более приоритетную задачу (выполнение текущей задачи приостанавливается)
	 * @param {AtomBotTask} task
	 */
	this.addPriorityTask = function (task) {
		task.setBot(this);
		this.taskList.splice(this.getCurrentTaskIndex(), 0, task);
		return this;
	};

	/**
	 * Получить текущую задачу
	 * @returns {AtomBotTask|*}
	 */
	this.getCurrentTask = function () {

		return (this.currentTaskIndex in this.taskList) ? this.taskList[this.currentTaskIndex] : false;
	};

	/**
	 * Получить экран по названию
	 * @param name
	 * @param {AtomBotScreen[]} botScreenList
	 * @returns {*}
	 */
	this.getScreenByName = function (name, botScreenList) {

		if (typeof botScreenList == 'undefined') {
			botScreenList = this.screenList;
		}

		for (var i in botScreenList) {

			if (botScreenList[i].name == name) {
				return botScreenList[i];
			}
			var childScreen = this.getScreenByName(name, botScreenList[i].subScreens);
			if (childScreen) {
				return childScreen;
			}
		}

		return false;
	};


	/**
	 *
	 * @param name
	 * @returns {{screen: boolean, params: Array}}
	 */
	this.getMainScreenWithParams = function (name) {

		var currentScreen = this.getScreenByName(name);
		var screen = false;
		var params = currentScreen.params;

		while (screen = currentScreen.getParent()) {
			currentScreen = screen
		}

		return {
			screen: currentScreen,
			params: params
		};
	};


	/**
	 * Параметры для всех экранов текущей задачи
	 * @param botScreenListArray
	 * @returns {strings[]}
	 */
	this.getScreenParamsStringList = function (botScreenListArray) {

		if (typeof botScreenListArray == 'undefined') {
			botScreenListArray = this.screenList;
		}

		var currentTaskScreens = this.getCurrentTask().getScreenEventNames();
		var result = [];

		for (var i in botScreenListArray) {
			// todo: тут добавить проверку вложенных экранов

			var data = this.getMainScreenWithParams(botScreenListArray[i].name)

			//if (currentTaskScreens.join().search(data.screen.name) != -1) {
				result[result.length] = botScreenListArray[i].getScreenParams();
			//}

			result = result.concat(this.getScreenParamsStringList(botScreenListArray[i].subScreens));
		}

		//for (var i = 0; i < botScreenListArray.length; i++) {
		//	if (currentTaskScreens.join().search(botScreenListArray[i].name) != -1) {
		//		result[result.length] = botScreenListArray[i].getScreenParams();
		//	}
		//	result = result.concat(that.getScreenParamsStringList(botScreenListArray[i].subScreens));
		//}
		return result;
	};

	/**
	 * Получить номер текущей задачи
	 * @returns {number}
	 */
	this.getCurrentTaskIndex = function () {

		return (this.currentTaskIndex <= this.taskList.length - 1) ? this.currentTaskIndex : -1;
	};


	/**
	 * Получить команды для экрана
	 * @param screenName название экрана
	 * @returns {string}
	 */
	this.getCommandsForScreen = function (screenName) {

		if (!screenName) {
			return [];
		}

		this.lastScreenName = this.currentScreenName;
		this.currentScreenName = screenName;

		var commandsList;
		var currentTask =  this.getCurrentTask();

		if (currentTask){
			commandsList = currentTask.getCommandsForScreen(screenName);
		}else{
			return AutoitCommand.BotExit('Бот закончил выполнение задач');
		}

		return (commandsList instanceof Array) ? commandsList.join('|') : commandsList;
	};

	this.isDuplicateScreen = function () {

		return (this.lastScreenName === this.currentScreenName);
	};

	this.getState = function(){
		return '[' + (this.getCurrentTaskIndex() + 1) +'/' + this.taskList.length + '] ' + this.getCurrentTask().getState();
	}

};