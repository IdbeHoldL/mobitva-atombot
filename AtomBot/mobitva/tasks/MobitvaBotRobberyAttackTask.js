/**
 * Охота
 * @param mobImageName
 * @param battleLimit
 * @constructor
 */
var MobitvaBotRobberyAttackTask = function () {

    MobitvaBotRobberyAttackTask.superclass.constructor.call(this);

    this.name        = 'Грабежи вмешательство';
    this.description = 'Вмешательство в грабежи (помошь сокланам в грабежах)';

    /**
     *
     * @type {{mobName: *, battleLimit: *}}
     */
    this.params = {};

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
            return AutoitCommand.BotCheckImageAndClickDouble('кнопка_дуэли', 'кнопка_красная_Дуэли');
        }

        this.bot.NextTask();
        return [];
    };

    this.screenEvents['дуэли'] = function (params) {

        return [
            AutoitCommand.BotSend('{F1}', 1),
            AutoitCommand.BotSend('{enter}', 1)
        ];
    };

    this.screenEvents['клан'] = function (params) {
        this.bot.NextTask();
        return [];
    };

    this.screenEvents['клан_грабежи_красные'] = function (params) {
        return AutoitCommand.BotCheckImageAndClick('кнопка_красная_Грабежи');
    };

    this.screenEvents['клан_грабежи_текущие_красные'] = function (params) {
        return AutoitCommand.BotCheckImageAndClick('кнопка_красная_Текущие');
    };

    this.screenEvents['вмешательство_список_боев'] = function (params) {
        return AutoitCommand.BotCheckImageAndClick('текст_vs');
    };

    this.screenEvents['вмешательство_просмотр_состава'] = function (params) {
        return AutoitCommand.BotCheckImageAndClick('текст_вмешаться');
    };

};
extend(MobitvaBotRobberyAttackTask, MobitvaBotDefaultTask);