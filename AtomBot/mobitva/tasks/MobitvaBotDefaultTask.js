/**
 * Задача по умолчанию.
 * Тут описаны стандартные действия для всех экранов
 * Срабатывает, когда бот не может определить экран, на котором находится.
 * @constructor
 */
var MobitvaBotDefaultTask = function () {

    MobitvaBotDefaultTask.superclass.constructor.call(this);

    this.test['тест']    = function () {
        return "стандарт";
    };
    this.test['default'] = function () {
        //console.log(this);
        return "стандарт";
    };

    this.name        = 'Задача по умолчанию';
    this.description = 'Завершает начатый бой, закрывает сообщения и подсказки';

    this.hitCounter       = 0;
    this.comboCounter     = 0;
    this.battleCounter    = 0;
    this.attackButtonsPos = [{x: 44, y: 186}, {x: 120, y: 186}, {x: 195, y: 186}];
    this.blockButtonsPos  = {x: 85, y: 208};
    this.flaskButtonPos   = {x: 19, y: 262};

    this.battleEnd = true;

    /**
     *
     * @type {MobitvaAtomBot}
     */
    this.bot = false;


    this.getMoveCommands = function (locationFromName, locationToName) {

        if (!locationFromName || !locationToName) {
            return false;
        }

        // переход в нужную локацию
        if (locationFromName != locationToName) {

            var route = this.bot.locationsGraph.getRouteByNodeNames(locationFromName, locationToName);

            if (typeof route[1] !== 'undefined') {
                var nextLocation               = this.bot.getLocationByNameNode(route[1]);
                var nextLocationLinkImageNames = (nextLocation) ? nextLocation.linkImageNames : false;
            }

            // если получили имена каринок-ссылок - кликаем по ним
            if (nextLocationLinkImageNames) {
                var result = [];
                for (var i in nextLocationLinkImageNames) {
                    result.push(AutoitCommand.BotCheckImageAndClick(nextLocationLinkImageNames[i]))
                }
                return result;
            }
        }

        return false;
    };


    /****************************************** обработчики экранов ******************************************/

    /* Экран с зеленой кнопкой да (встречается на экранах дисконнекта)*/
    this.screenEvents['неопознанный_экран[кнопка_да_зеленая]'] = function (params) {
        return AutoitCommand.BotCheckImageAndClick('кнопка_да_зеленая');
    };

    /* Экран с кнопкой ок зеленой (встречается на сообщениях-подсказках) */
    this.screenEvents['неопознанный_экран[кнопка_ок_маленькая]'] = function (params) {
        return AutoitCommand.BotCheckImageAndClick('кнопка_ок_маленькая');
    };

    /* Экран с кнопкой отклонить - отклоняем все подряд. */
    this.screenEvents['неопознанный_экран[кнопка_оранжевая_Отклонить]'] = function (params) {
        return AutoitCommand.BotCheckImageAndClick('кнопка_оранжевая_Отклонить');
    };

    /* Экран с кнопкой согласиться (встречается на большинстве сообщений) */
    this.screenEvents['неопознанный_экран[кнопка_согласиться]'] = function (params) {
        return AutoitCommand.BotCheckImageAndClick('кнопка_согласиться');
    };

    /* Экран с кнопкой ок белая (встречается на большинстве сообщений) */
    this.screenEvents['неопознанный_экран[кнопка_ок_белая]'] = function (params) {
        return AutoitCommand.BotCheckImageAndClick('кнопка_ок_белая');
    };

    /* Экран с кнопкой ок (встречается на большинстве сообщений) */
    this.screenEvents['неопознанный_экран[кнопка_ок]'] = function (params) {
        return AutoitCommand.BotCheckImageAndClick('кнопка_ок');
    };

    /* Экран с кнопкой далее. Встречается на экране результатов боя */
    this.screenEvents['неопознанный_экран[кнопка_далее]'] = function (params) {
        return AutoitCommand.BotCheckImageAndClick('кнопка_далее');
    };

    /* Экран с кнопкой да. Встречается в сообщениях (примример при нападении в грабежах) */
    this.screenEvents['неопознанный_экран[кнопка_оранжевая_Да]'] = function (params) {
        return AutoitCommand.BotCheckImageAndClick('кнопка_оранжевая_Да');
    };

    /* Сообщение добавление в друзья - отклоняем приглашения */
    this.screenEvents['сообщение_добавление_в_друзья'] = function (params) {
        return AutoitCommand.BotCheckImageAndClick('кнопка_оранжевая_Нет');
    };

    /* Сообщение приглашения в клан - отклоняем приглашение */
    this.screenEvents['сообщение_приглашение_в_клан'] = function (params) {
        return AutoitCommand.BotCheckImageAndClick('кнопка_оранжевая_Нет');
    };

    /* Экран с сообщением о нападении */
    this.screenEvents['сообщение_грабеж'] = function (params) {

        // если в настройках выставлено защищаться - принимаем бой
        if (this.bot.settings.robberyDefense) {
            return AutoitCommand.BotCheckImageAndClick('кнопка_оранжевая_Да');
        }

        return AutoitCommand.BotCheckImageAndClick('кнопка_оранжевая_Нет');
    };

    /* Экран с кнопкой назад F2 (коричневая на клавишу F2 - встречается на большинстве экранов) */
    this.screenEvents['неопознанный_экран[кнопка_назад_f2]'] = function (params) {
        return AutoitCommand.BotCheckImageAndClick('кнопка_назад_f2');
    };

    /* Экран с кнопкой далее F1 (коричневая на клавишу F1 - встречается при сообщении о получении уровня, результатах боя и других) */
    this.screenEvents['неопознанный_экран[кнопка_далее_f1]'] = function (params) {
        return AutoitCommand.BotCheckImageAndClick('кнопка_далее_f1');
    };

    /* Всплывающее сообщение - закончилась выносливость */
    this.screenEvents['сообщение_выносливость'] = function (params) {

        // добавляем задачу - выполнение квеста "восстановление выносливости", если нужно
        if (this.bot.settings.useVigor) {
            this.bot.addPriorityTask(new MobitvaBotQuestVigorTask());
        }

        return [
            AutoitCommand.BotCheckImageAndClick('кнопка_далее')
        ];
    };

    /* Экран локации */
    this.screenEvents['локация'] = function (params) {

        // если в настройках выставлено вмешиваться в грабежи - добавляем задачу вмешательства в грабежи
        if (this.bot.settings.robberyAttack && params.is_red) {
            this.bot.addPriorityTask(new MobitvaBotRobberyAttackTask());
            return [];
        }

        if (typeof location_name == 'undefined') {
            location_name = '';
        }

        return [];
    };

    /* Экран результатов боя */
    this.screenEvents['результаты_боя'] = function (params) {
        // сбрасываем счетчики боя
        this.hitCounter   = 0;
        this.comboCounter = 0;
        this.battleEnd    = true;

        // увеличиваем счетчик проведенных боев
        if (!MobitvaBot.isDuplicateScreen()) {
            this.battleCounter++
        }

        return [
            AutoitCommand.BotCheckImageAndClick('кнопка_далее_f1'),
            AutoitCommand.ConsoleWrite('Ждем задержку после боя'),
            AutoitCommand.BotSleep(this.bot.settings.afterFightDelay * 1000)
        ];
    };

    /* Экран боя */
    this.screenEvents['бой'] = function (params) {

        // первое действие - клик в пустую область экрана (чтобы сюросить форус со всех элементов управления)
        var autoitCommands = [
            AutoitCommand.BotFakeClick(),
            AutoitCommand.BotSleep(150)
        ];

        // сбрасываем счетчик комбо, если он больше количества ударов в комбо
        if (this.comboCounter > (MobitvaBot.settings.comboArray.length - 1)) {
            this.comboCounter = 0;
        }
        autoitCommands.push(AutoitCommand.ConsoleWrite('>>> debug this.comboCounter: ' + this.comboCounter + ' this.hitCounter: ' + this.hitCounter));

        // определяем на какую кнопку атаки нужно нажать
        var attackButtonPos = this.attackButtonsPos[MobitvaBot.settings.comboArray[this.comboCounter] - 1];

        // ставим блок, если в настройках включено использование блоков и сейчас ход, с которого нужно выставить блок.
        if (MobitvaBot.settings.useBlock && this.hitCounter == (MobitvaBot.settings.startBlockTurn - 1)) {
            autoitCommands.push(AutoitCommand.ConsoleWrite('>>> СТАВЛЮ БЛОК'));
            autoitCommands.push(AutoitCommand.BotClickNoDiff(this.blockButtonsPos.x, this.blockButtonsPos.y));
            autoitCommands.push(AutoitCommand.BotSleep(1500));
            autoitCommands.push(AutoitCommand.BotFakeClick());
            autoitCommands.push(AutoitCommand.BotSleep(150));
        }

        // используем эликсир, если в настройках включено использование эликсиров и сейчас ход, в который нужно использовать эликсир.
        if (MobitvaBot.settings.useFlask
            && (this.hitCounter == (MobitvaBot.settings.useFlaskStartTurn - 1)
                || ((this.hitCounter != 0) && (this.hitCounter - (MobitvaBot.settings.useFlaskStartTurn - 1) > 0) &&
                    ((this.hitCounter - (MobitvaBot.settings.useFlaskStartTurn - 1)) % MobitvaBot.settings.useFlaskStep == 0)))) {

            autoitCommands.push(AutoitCommand.ConsoleWrite('>>> ИСПОЛЬЗУЮ ЭЛИКСИР'));
            autoitCommands.push(AutoitCommand.BotClickNoDiff(this.flaskButtonPos.x, this.flaskButtonPos.y));
            autoitCommands.push(AutoitCommand.BotSleep(1500));
            autoitCommands.push(AutoitCommand.BotFakeClick());
            autoitCommands.push(AutoitCommand.BotSleep(150));
        }

        autoitCommands.push(AutoitCommand.ConsoleWrite('>>> АТАКУЮ, КНОПКА ' + MobitvaBot.settings.comboArray[this.comboCounter]));

        // увеличиваем счетчики ударов и комбо
        this.comboCounter++;
        this.hitCounter++;

        // добавляем клик по нужной кнопке атаки
        autoitCommands.push(AutoitCommand.BotClickNoDiff(attackButtonPos.x, attackButtonPos.y));

        return autoitCommands;
    };

    /* Бой, персонаж погиб (экран с кнопкой выйти из боя) */
    this.screenEvents['бой_персонаж_погиб'] = function (params) {

        // сбрасываем счетчики боя
        this.hitCounter   = 0;
        this.comboCounter = 0;
        this.battleEnd    = true;

        return AutoitCommand.BotCheckImageAndClick('кнопка_выйти');
    };


    /****************************************** обработчики экранов ******************************************/

}
    ;
extend(MobitvaBotDefaultTask, AtomBotTask);