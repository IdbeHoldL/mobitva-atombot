/**
 * Created by q on 22.02.2016.
 */


var MobitvaAtomBot        = function () {
    var that = this;

    /**
     *
     * @type {{comboArray: number[], useBlock: boolean, useFlask: boolean, useSmartFightDelay: boolean, startBlockTurn: number, useFlaskStartTurn: number, useFlaskStep: number, afterFightDelay: number, robberyDefense:boolean, robberyAttack: boolean,useVigor: boolean}}
     */
    this.settings = null;
    this.locationsGraph = null;

    /**
     * Инициализация
     * @param screenList
     * @param {Graph} locationsGraph
     * @param {mLocation[]} locationList
     */
    this.init = function (screenList, locationsGraph, locationList) {
        this.screenList     = screenList;
        this.locationsGraph = locationsGraph;
        this.locationList   = locationList;


    };

    /**
     *
     * @param mobName
     * @returns {mLocation|bool}
     */
    this.getMobLocation = function (mobName) {

        for (var i in this.locationList) {
            var location = this.locationList[i];

            for (var j in location.mobList) {
                if (location.mobList[j].name == mobName) {
                    return location;
                }
            }
        }

        return false;
    };

    /**
     *
     * @param mobName
     * @returns {mMob|bool}
     */
    this.getMobByName = function (mobName) {

        for (var i in this.locationList) {
            var location = this.locationList[i];

            for (var j in location.mobList) {
                if (location.mobList[j].name == mobName) {
                    return location.mobList[j];
                }
            }
        }

        return false;
    };


    /**
     *
     * @param nameNode
     * @returns {mLocation|boolean}
     */
    this.getLocationByNameNode = function (nameNode) {

        for (var i in this.locationList) {
            var location = this.locationList[i];
            if (location.nameNode == nameNode) {
                return location;
            }
        }

        return false;
    };

    /**
     * Загрузить список задач
     * @param {{name: string, params: {}}[]} taskList
     * @returns {*}
     */
    this.loadTasks = function (taskList) {
        for (var i in taskList) {
            var newTask = null;
            switch (taskList[i][0].toLowerCase()) {
                case 'default'  :
                    newTask = new MobitvaBotDefaultTask().setBot(this);
                    break;
                case 'duel'  :
                    newTask = new MobitvaBotDuelTask(taskList[i][1][0]).setBot(this);
                    break;
                case 'hunt'  :
                    newTask = new MobitvaBotHuntTask(taskList[i][1][0], taskList[i][1][1]).setBot(this);
                    break;
                case 'wall'  :
                    newTask = new MobitvaBotWallTask(taskList[i][1][0], taskList[i][1][1]).setBot(this);
                    break;
                case 'quest_vigor'  :
                    newTask = new MobitvaBotQuestVigorTask().setBot(this);
                    break;
                case 'survive'  :
                    newTask = new MobitvaBotSurviceTask(taskList[i][1][0]).setBot(this);
                    break;
                case 'robbery'  :
                    newTask = new MobitvaBotRobberyTask(taskList[i][1][0]).setBot(this);
                    break;
                case 'robbery_attack'  :
                    newTask = new MobitvaBotRobberyAttackTask().setBot(this);
                    break;
                case 'sleep'  :
                    newTask = new MobitvaBotSleepTask(taskList[i][1][0]).setBot(this);
                    break;
            }
            that.taskList.push(newTask);
        }

        return newTask.name;
    };

    /**
     * Хеш от списка экранов (названия экранов для текушей задачи)
     * @returns {string}
     */
    this.getScreenListHash = function () {
        return ObjectHashCode(ObjectKeys(this.getCurrentTask().screenEvents).join());
    };
};
MobitvaAtomBot.prototype  = new AtomBot();
MobitvaAtomBot.superclass = AtomBot.prototype;