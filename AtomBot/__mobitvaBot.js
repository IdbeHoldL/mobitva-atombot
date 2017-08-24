/**
 * Проброс команд в автоит
 */
var AutoitCommand = new (function () {


    var that = this;
    /**
     *
     * @param msec
     * @returns {string}
     * @constructor
     */
    this.Sleep = function (msec) {
        return 'Sleep(' + msec + ')';
    };


    this.ConsoleWrite = function (str) {
        return 'ConsoleWrite("' + str + '" & @CRLF )';
    };

    /**
     * Клик по координатам
     * @param x (number) координата X
     * @param y (number) координата Y
     * @returns {string}
     * @constructor
     */
    this.BotClick = function (x, y) {
        return 'BotClick(' + x + ',' + y + ')';
    };

    this.BotSleep = function (delay) {
        return 'BotSleep(' + delay + ')';
    };

    this.BotDoubleClick = function (x, y) {

        return [
            this.BotClick(x, y),
            this.BotSleep(300),
            this.BotClick(x, y)
        ].join('|');
    };

    this.BotFakeClick = function () {
        return 'BotFakeClick()';
    };

    this.BotMakeScreenShot = function () {
        return 'BotMakeScreenShot()';
    };

    /**
     * Ожидание картинки
     * @param imageName
     * @returns {string}
     * @constructor
     */
    this.BotWaitImageAndClick = function (imageName) {
        return "BotWaitImageAndClick('" + imageName + "')";
    };

    /**
     *
     * @param imageName
     * @returns {string}
     * @constructor
     */
    this.BotCheckImageAndClick = function (imageName) {
        return "BotCheckImageAndClick('" + imageName + "')";
    };


    this.BotCheckImageAndClickEx = function (imageName) {
        return "BotCheckImageAndClickEx('" + imageName + "')";
    }

});

/** ------------------------------ START ATOM BOT ENGINE CODE ------------------------------ **/

/**
 * Screen
 * @param {string} name
 * @param {string[]} imageNamesList
 * @constructor
 */
var AtomBotScreen = function (name, imageNamesList) {

    this.parent = false;

    /**
     * Screen name
     * @type {string}
     */
    this.name = name;

    /**
     * Image names list for detect this screen
     * @type {string[]}
     */
    this.imageNamesList = imageNamesList;

    /**
     * Sub-screen list. (will detect only when parent screen is detected)
     * @type {AtomBotScreen[]}
     */
    this.subScreens = [];

    /**
     * Add sub-screen
     * @param {AtomBotScreen} botScreen
     * @returns {AtomBotScreen}
     */
    this.addSubScreen = function (botScreen) {
        botScreen.setParent(this);
        this.subScreens.push(botScreen);
        return this;
    };

    /**
     * Set parent screen
     * @param {AtomBotScreen} parentScreen
     */
    this.setParent = function (parentScreen) {
        this.parent = parentScreen;
    };

    /**
     * Get paren screen
     * @returns {AtomBotScreen}
     */
    this.getParent = function () {
        return this.parent;
    };

    /**
     * Get screen params as string
     * @returns {string}
     */
    this.getScreenParams = function () {
        return this.name + ':' + ((this.parent) ? this.getParent().name : '') + ':' + this.imageNamesList.toString(); // пример 'локация_ствгород:локация:иконка_уровень,иконка_хп,кнопка_выход'
    };
};

/**
 * Bot task
 * @constructor
 */
var AtomBotTask = function () {

    /**
     * Screen events
     * @type {{}}
     */
    this.screenEvents = {};

    /**
     * Get commands for screen
     * @param screenName
     * @returns {*}
     */
    this.getCommandsForScreen = function (screenName) {
        return (typeof this.screenEvents[screenName] === 'function') ? this.screenEvents[screenName]() : [];
    };

    /**
     * Get screen event names list
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

};


var AtomBot = new (function () {

    var that              = this;
    this.screenList       = null;
    this.taskList         = [];
    this.settings         = null;
    this.currentTaskIndex = 0;

    /**
     * Init AtomBot.
     * @param {{screenList:AtomBotScreen[], taskList: AtomBotTask[], settings:{}}} params
     */
    //this.init = function (params) {
    //	/**
    //	 * All screen list
    //	 * @type {AtomBotScreen[]}
    //	 */
    //	this.screenList = params.screenList;
    //	/**
    //	 *
    //	 * @type {AtomBotTask[]}
    //	 */
    //	this.taskList = params.taskList;
    //	this.settings = params.settings;
    //	this.currentTaskIndex = 0;
    //};

    /**
     *
     * @param settings
     * @param taskList
     */
    this.init = function (screenList, settings) {

        this.screenList = screenList;
        this.settings   = settings;
        //
        //for (var i = 0; i < taskList.length; i++) {
        //	// todo : переписать - не безопасный код
        //	this.taskList.push(eval('new ' + taskList.name + '(taskList.params)'))
        //}
    };


    /**
     * Загрузить список задач
     * @param {{name: string, params: {}}[]} taskList
     * @returns {*}
     */
    this.loadTasks = function (taskList) {
        for (var i = 0; i < taskList.length; i++) {
            var newTask = null;
            switch (taskList[i].name.toLowerCase()) {
                case 'default'  :
                    newTask = new DefaultTask();
                    break;
                case 'duel'     :
                    newTask = DuelTask(taskList[i].params);
                    break;
            }
            that.taskList.push(newTask);
        }
        return newTask.name;
    };

    this.createNewTask = function (name, params) {
        switch (name.toLowerCase()) {
            case 'default'  :
                return (new DefaultTask());
            case 'duel'     :
                return (new DuelTask(params));
        }
    };

    this.NextTask = function () {
        this.currentTaskIndex++;
    };

    this.getCurrentTask = function () {
        return (this.currentTaskIndex in this.taskList) ? this.taskList[this.currentTaskIndex] : false;
    };

    this.getScreenByName = function (name, botScreenList) {

        if (typeof botScreenList == 'undefined') {
            botScreenList = that.screenList;
        }

        for (var i = 0; i < botScreenList.length; i++) {
            if (botScreenList[i].name == name) {
                return botScreenList[i];
            }
            var childScreen = that.getScreenByName(name, botScreenList[i].subScreens);
            if (childScreen) {
                return childScreen;
            }
        }
    };

    /**
     *
     * @param {AtomBotScreen[]} botScreenList
     * @param name
     * @returns {AtomBotScreen|boolean}
     */
    //this.getScreenByNameFromScreenList =

    /**
     *
     * @returns {strings[]}
     */
    this.getScreenParamsStringList = function (botScreenListArray) {

        if (typeof botScreenListArray == 'undefined') {
            botScreenListArray = that.screenList;
        }

        //return that.getCurrentTask().name;

        var currentTaskScreens = that.getCurrentTask().getScreenEventNames();
        var result             = [];

        for (var i = 0; i < botScreenListArray.length; i++) {
            if (currentTaskScreens.join().search(botScreenListArray[i].name) != -1) {
                result[result.length] = botScreenListArray[i].getScreenParams();
            }
            result = result.concat(that.getScreenParamsStringList(botScreenListArray[i].subScreens));
        }
        return result;
    };

    /**
     *
     * @returns {number}
     */
    this.getCurrentTaskIndex = function () {
        return (this.currentTaskIndex <= this.taskList.length - 1) ? this.currentTaskIndex : -1;
    };


    /**
     *
     * @param screenName
     * @returns {string}
     */
    this.getCommandsForScreen = function (screenName) {

        //if (!this.getCurrentTask()) {
        //	return AutoitCommand.ConsoleWrite('НЕТ ЗАДАЧИ С ИНДЕКСОМ ' + this.currentTaskIndex);
        //}

        var commandsList = (this.getCurrentTask()).getCommandsForScreen(screenName);

        return (commandsList instanceof Array) ? commandsList.join('|') : commandsList;
    };


});


/** ------------------------------ END ATOM BOT ENGINE CODE ------------------------------ **/


/** ------------------------------ START MOBITVA BOT LOGIC ------------------------------ **/


/**
 * Задача - установить настройки
 * @param settings
 * @constructor
 */
var AtomBotSettings        = function (settings) {

    this.settings = settings;

    this.getCommandsForScreen = function (screenName) {

        for (var k in this.settings) {
            AtomBot.settings[k] = this.settings[k];
        }
        AtomBot.currentTaskIndex = AtomBot.currentTaskIndex + 1;

        return ['', AtomBot.currentTaskIndex, AtomBot.settings.comboArray.toString()];
    };

    this.getScreenEventNames = function () {
        return [];
    };
};
AtomBotSettings.prototype  = new AtomBotTask();
AtomBotSettings.superclass = AtomBotTask.prototype;

/**
 * Задача по умолчанию.
 * Тут описаны стандартные действия для всех экранов
 * @constructor
 */
var DefaultTask        = function () {

    var that         = this;
    this.name        = 'Задача по умолчанию';
    this.description = 'Завершает начатый бой, закрывает сообщения и подсказки';

    this.hitCounter       = 0;
    this.comboCounter     = 0;
    this.battleCounter    = 0;
    this.attackButtonsPos = [{x: 44, y: 186}, {x: 120, y: 186}, {x: 195, y: 186}];
    this.blockButtonsPos  = {x: 85, y: 208};

    this.battleEnd = true;

    /**
     * Делает отметку о начале боя, если бой можно начать
     * @returns {boolean}
     */
    this.startNewBattle = function () {
        // не выполяем никаких действий, если предудущий бой не завершен
        if (that.battleEnd == false) {
            return false;
        }

        that.battleCounter++;
        that.battleEnd = false;

        return true;
    };


    /* обработчики экранов */
    /**
     * Обработка дисконнекта
     * @returns {string}
     */
    this.screenEvents['дисконнект'] = function () {
        return AutoitCommand.BotCheckImageAndClick('кнопка_да_зеленая');
    };

    /**
     * Всплывающее сообщение - подсказка
     * @returns {string}
     */
    this.screenEvents['сообщение_подсказка'] = function () {
        return AutoitCommand.BotCheckImageAndClick('кнопка_ок_зеленая');
    };

    /**
     * Всплывающее сообщение - сообщение с кнопкой подтверждения
     * @returns {string}
     */
    this.screenEvents['сообщение_без_выбора'] = function () {
        return AutoitCommand.BotCheckImageAndClick('кнопка_ок_желтая');
    };
    /**
     * Всплывающее сообщение - сообщение с кнопкой согласиться
     * @returns {string}
     */
    this.screenEvents['сообщение_согласиться'] = function () {
        return AutoitCommand.BotCheckImageAndClick('кнопка_согласиться_желтая');
    };

    // todo : найти что это. добавить описание
    /**
     *
     * @returns {string}
     */
    this.screenEvents['подтверждение_действия'] = function () {
        return AutoitCommand.BotCheckImageAndClick('кнопка_да_желтая');
    };

    /**
     * Экран локации
     * @returns {Array}
     */
    this.screenEvents['локация'] = function (location_name) {

        if (typeof location_name == 'undefined') {
            location_name = '';
        }

        return [AutoitCommand.ConsoleWrite('локация :  ' + location_name)];
    };

    this.screenEvents['локация_стагород']  = function () {
        return that.screenEvents['локация']('стагород');
    };
    this.screenEvents['локация_вирастоль'] = function () {
        return that.screenEvents['локация']('вирастоль');
    };

    /**
     * Экран результатов боя
     * @returns {string}
     */
    this.screenEvents['результаты_боя'] = function () {
        that.hitCounter   = 0;
        that.comboCounter = 0;
        that.battleEnd    = true;

        return AutoitCommand.BotCheckImageAndClick('кнопка_далее_левая');
    };

    /**
     * Экран боя
     * @returns {Array}
     */
    this.screenEvents['бой'] = function () {
        var autoitCommands = [];
        if (that.comboCounter > (AtomBot.settings.comboArray.length - 1)) {
            that.comboCounter = 0;
        }
        // определяем на какую кнопку атаки нужно нажать
        var attackButtonPos = that.attackButtonsPos[AtomBot.settings.comboArray[that.comboCounter] - 1];

        if (AtomBot.settings.useBlock && that.hitCounter == AtomBot.settings.startBlockTurn) {
            autoitCommands.push(AutoitCommand.BotDoubleClick(that.blockButtonsPos.x, that.blockButtonsPos.y));
            autoitCommands.push(AutoitCommand.Sleep(500));
        }
        that.comboCounter++;
        that.hitCounter++;

        autoitCommands.push(AutoitCommand.BotDoubleClick(attackButtonPos.x, attackButtonPos.y));
        return autoitCommands;
    };
    //this.screenEvents['локация_вирастоль'] = function () {return [];};
    //this.screenEvents['локация_стагород'] = function () {return [];};
    //this.screenEvents['локация_проселок'] = function () {return [];};
    //this.screenEvents['локация_тракт'] = function () {return [];};

};
DefaultTask.prototype  = new AtomBotTask();
DefaultTask.superclass = AtomBotTask.prototype;


/**
 * Задача - охота
 * @param {{mobImageName:string, battleLimit:number}}params
 * @constructor
 */
var HuntTask        = function (params) {
    var that                             = this;
    this.params                          = params;
    this.screenEvents['локация']         = function () {

        // если провели достаточное количество боев с мобом - переходим к следующему заданию
        if (that.battleCounter >= that.params.battleLimit) {
            return AtomBot.NextTask();
        }

        return AutoitCommand.BotCheckImageAndClickEx('кнопка_охота')
    };
    this.screenEvents['охота']           = function () {
        return AutoitCommand.BotCheckImageAndClickEx(that.params.mobImageName);
    };
    this.screenEvents['охота_атаковать'] = function () {

        return AutoitCommand.BotCheckImageAndClick('кнопка_атаковать');
    };

};
HuntTask.prototype  = new DefaultTask();
HuntTask.superclass = DefaultTask.prototype;


/**
 * Задача - дуэль
 * @param {{battleLimit:number}}params
 * @constructor
 */
var DuelTask        = function (params) {
    var that                     = this;
    this.params                  = params;
    this.screenEvents['локация'] = function () {

        // если провели достаточное количество боев с мобом - переходим к следующему заданию
        if (that.battleCounter >= that.params.battleLimit) {
            return AtomBot.NextTask();
        }

        return AutoitCommand.BotCheckImageAndClickEx('кнопка_дуэли')
    };
    this.screenEvents['дуэли']   = function () {
        return (that.startNewBattle()) ? AutoitCommand.BotCheckImageAndClickEx('кнопка_начать_поединок') : false;
    };
};
DuelTask.prototype  = new DefaultTask();
DuelTask.superclass = DefaultTask.prototype;


/**
 * Задача - сохдание открытого боя
 * @param {{battleLimit:number}}params
 * @constructor
 */
var OpenBattleTask        = function (params) {
    var that    = this;
    this.params = params;

    this.screenEvents['дуэли'] = function () {
        return (that.startNewBattle()) ? AutoitCommand.BotCheckImageAndClickEx('кнопка_открытый_бой') : false;
    };
};
OpenBattleTask.prototype  = new DuelTask({});
OpenBattleTask.superclass = DuelTask.prototype;


/**
 *
 * @type {{comboArray: number[], useBlock: boolean, startBlockTurn: number}}
 */
AtomBot.settings = {};

//
//var testInit = {
//	settings: {
//		comboArray       : [2, 3, 3, 2, 2, 2, 1, 1, 1],
//		useBlock         : true,
//		startBlockTurn   : 3,
//		useFlask         : true,
//		startUseFlaskTurn: 3,
//		startUseFlaskStep: 5
//	},
//	taskList: [
//
//		{
//			name  : 'HuntTask',
//			params: {
//				battleLimit: 5
//			}
//		},
//		{
//			name  : 'DuelTask',
//			params: {
//				battleLimit: 2
//			}
//		}
//	]
//};

/**
 *
 * @type {*[]}
 */
var testScreenList = [
    (new AtomBotScreen('дисконнект', ['сообщение_соединение_прервано', 'кнопка_да_зеленая', 'кнопка_выход_зеленая'])),
    (new AtomBotScreen('дисконнект', ['сообщение_невозможно_соединиться', 'кнопка_да_зеленая', 'кнопка_выход_зеленая'])),
    (new AtomBotScreen('сообщение_подсказка', ['кнопка_ок_зеленая'])),
    (new AtomBotScreen('сообщение_без_выбора', ['кнопка_ок_желтая'])),
    (new AtomBotScreen('сообщение_согласиться', ['кнопка_согласиться_желтая'])),
    (new AtomBotScreen('подтверждение_действия', ['кнопка_да_желтая'])),

    (new AtomBotScreen('локация', ['иконка_уровень', 'иконка_хп', 'рамка_картинки_локации']))
        .addSubScreen((new AtomBotScreen('локация_вирастоль', ['табличка_локации_вирастоль'])))
        .addSubScreen((new AtomBotScreen('локация_стагород', ['табличка_локации_стагород'])))
        .addSubScreen((new AtomBotScreen('локация_проселок', ['табличка_локации_проселок'])))
        .addSubScreen((new AtomBotScreen('локация_тракт', ['табличка_локации_тракт']))),

    (new AtomBotScreen('охота', ['кнопка_текущие_бои', 'надпись_охота'])),
    (new AtomBotScreen('дуэли', ['текст_начать_поединок'])),

    (new AtomBotScreen('охота_атаковать', ['кнопка_атаковать', 'кнопка_назад'])),
    (new AtomBotScreen('результаты_боя', ['текст_результаты_боя', 'кнопка_далее_левая'])),
    (new AtomBotScreen('бой', ['кнопки_атаки_верх', 'кнопки_атаки_низ']))
];

/**
 *
 * @type {{comboArray: number[], useBlock: boolean, useFlask: boolean, startBlockTurn: number, useFlaskStartTurn: number, useFlaskStep: number}}
 */
var testSettings = {
    comboArray       : [2, 3, 3, 2, 2, 2, 1, 1, 1],
    useBlock         : true,
    useFlask         : true,
    startBlockTurn   : 3,
    useFlaskStartTurn: 3,
    useFlaskStep     : 5
};

/**
 *
 * @type {{name: string, params: {battleLimit: number}}[]}
 */
var testTaskList = [
    {
        name  : 'HuntTask',
        params: {
            battleLimit: 5
        }
    },
    {
        name  : 'DuelTask',
        params: {
            battleLimit: 2
        }
    }
];

AtomBot.init(testScreenList, testSettings, testTaskList);


//var GraphNode = function (name, data) {
//	this.name = name;
//	this.data = data;
//};
//
//
//var BotGraph = function () {
//
//	this.nodes = {};
//
//	this.addNode = function (name, data) {
//		this.nodes[name] = new GraphNode(name, data);
//	};
//
//	this.addRelation = function (name1, name2) {
//
//	}
//};


//var k = {
//	'стагород': {
//		pointerImage: 'табличка_локации_стагород',
//		targetImages: ['кнопка_локация_стагород']
//	},
//	'тракт'   : {
//		pointerImage: 'табличка_локации_тракт',
//		targetImages: ['кнопка_локация_тракт']
//	}
//}
//
//
//var LocationGraph = new BotGraph();
//
//LocationGraph.addNode('стагород', {imageName: 'табличка_локации_стагород'});
//LocationGraph.addNode('тракт', {imageName: 'табличка_локации_тракт'});
//LocationGraph.addNode('погост', {imageName: 'табличка_локации_погост'});
//LocationGraph.addRelation('стагород', 'тракт').addRelation('тракт', 'стагород');
//LocationGraph.addRelation('тракт', 'погост');


//
//
//var Graph = function (){
//
//	this.matrix = [
//		[0,0],
//		[0,0]
//	];
//	this.addNode = function (name)
//}


//var MobitvaLocation = new (function () {
//
//	this.locations = {
//		'стагород': [
//			'тракт',
//			'зябкое_ущелье',
//			'поместье_раввика',
//			'слободка',
//			'коллектор',
//			'верхний_город'
//		],
//		'тракт': [
//			'стагород',
//			'гати',
//			'проселок',
//			'мавкина_роща',
//			'погост'
//		],
//		'гати': [
//			'тракт',
//			'гнилая_топь'
//		],
//	}
//
//});


//var MobitbaLocation = function () {
//
//};

//var MobitbaMob = function (name, level, location) {
//	this.name = name;
//	this.level = level;
//	this.location = location;
//
//	this.getLocation
//};


/** ------------------------------ END MOBITVA BOT LOGIC ------------------------------ **/



function test(screenName) {

    return AtomBot.getCurrentTaskIndex();

    //return AtomBot.getScreenParamsStringList().join('|');


    //return AtomBot.getScreenByName('дисконнект').name;

    //var htask = new HuntTask();
    //
    //return htask.getScreenEventNames().join('|');
}


//function getCommandsForScreen(screenName) {
//
//	var task = new DefaultTask();
//	var taskList = task.getCommandsForScreen(screenName);
//	return (typeof taskList === 'array') ? taskList.join('|') : taskList;
//}

//function getBotScreenList() {
//	return AtomBot.getScreenParamsStringList().join('|');
//}
