/**
 * Created by q on 22.02.2016.
 */


var MobitvaBotAutoitCommand        = function () {

    /**
     * Двойной клик по координатам
     * @param x
     * @param y
     * @returns {string}
     * @constructor
     */
    this.BotDoubleClick = function (x, y) {

        return [
            this.BotClick(x, y),
            this.BotSleep(300),
            this.BotClick(x, y)
        ].join('|');
    };

    /**
     * Клик в пустую область экрана (чтобы сбросить фокус с элементов интерфейса)
     * @returns {string}
     * @constructor
     */
    this.BotFakeClick = function () {
        return 'BotFakeClick()';
    };

    /**
     * Клик по картинке, с принудительным снятием скриншота
     * @param imageName
     * @returns {string}
     * @constructor
     */
    this.BotCheckImageAndClickEx = function (imageName) {
        return "BotCheckImageAndClickEx('" + imageName + "')";
    };

    /**
     *
     * @param message
     * @returns {string}
     * @constructor
     */
    this.BotExit = function (message) {
        return "BotExit('" + message + "')";
    };


    /**
     *
     * @param x
     * @param y
     * @returns {string}
     * @constructor
     */
    this.BotClickNoDiff = function (x, y) {
        return "BotClickNoDiff(" + x + "," + y + ")";
    };

    this.BotCheckImageAndClickDouble = function (imageName1, imageName2) {
        return "BotCheckImageAndClickDouble('" + imageName1 + "','" + imageName2 + "')";
    };


};
MobitvaBotAutoitCommand.prototype  = new AtomBotAutoitCommand();
MobitvaBotAutoitCommand.superclass = AtomBotAutoitCommand.prototype;