/**
 * Created by q on 23.02.2016.
 */

/**
 * Граф для локаций
 * @constructor
 */
var Graph = function () {
    var that = this;

    this.nodes  = [];
    this.matrix = [];

    /**
     *
     * @param {{nodes: Array, matrix: Array}} data
     */
    this.init = function (data) {
        this.nodes  = data.nodes;
        this.matrix = data.matrix;

        return this;
    };

    /**
     *
     * @param nodeName
     * @returns {number}
     */
    this.addNode = function (nodeName) {
        this.nodes.push(nodeName);

        for (var i = 0; i < that.nodes.length; i++) {
            if (typeof  that.matrix[i] !== 'undefined') {
                that.matrix[i].push(999);
            }
        }

        that.matrix.push(new Array(this.nodes.length))

        for (i = 0; i < that.nodes.length; i++) {
            that.matrix[that.nodes.length - 1][i] = 999;
        }

        that.matrix[this.nodes.length - 1][this.nodes.length - 1] = 0.1;

        return this.nodes.length - 1;
    };

    /**
     *
     * @param nodeName1
     * @param nodeName2
     * @param weight
     */
    this.addRoute = function (nodeName1, nodeName2, weight) {

        if (typeof weight == 'undefined') {
            weight = 0.5;
        }

        var nodeOneIndex = ArrayIndexOf(that.nodes, nodeName1);
        var nodeTwoIndex = ArrayIndexOf(that.nodes, nodeName2);

        if (nodeOneIndex == -1) {
            nodeOneIndex = that.addNode(nodeName1);
        }
        if (nodeTwoIndex == -1) {
            nodeTwoIndex = that.addNode(nodeName2);
        }

        that.matrix[nodeOneIndex][nodeTwoIndex] = weight;
    };

    /**
     * Строим матрицу смежности
     */
    this.buildMatrix = function () {
        that.matrix = new Array(that.nodes.length);
        for (var i = 0; i < that.nodes.length; i++) {
            that.matrix[i] = new Array(that.nodes.length);
        }

        for (var i = 0; i < that.nodes.length; i++) {
            for (var j = 0; j < that.nodes.length; j++) {
                that.matrix[i][j] = 999;
            }
        }
    };

    /**
     *
     * @param nodeName1
     * @param nodeName2
     * @param normalizePath
     * @returns {*}
     */
    this.getRouteByNodeNames = function (nodeName1, nodeName2, normalizePath) {

        //return AutoitCommand.ConsoleWrite(typeof  Array.prototype.indexOf);

        var nodeIndexOne = ArrayIndexOf(this.nodes, nodeName1);
        var nodeIndexTwo = ArrayIndexOf(this.nodes, nodeName2);
        //var nodeIndexOne = this.nodes.indexOf(nodeName1);
        //var nodeIndexTwo = this.nodes.indexOf(nodeName2);

        //return '1';

        if (typeof normalizePath === 'undefined' || normalizePath) {
            var route  = this.getRoute(nodeIndexOne, nodeIndexTwo, [], 0);
            var result = [];

            for (var i in route.allPath) {
                result.push(this.nodes[route.allPath[i]]);
            }

            return result;
        }

        return this.getRoute(nodeIndexOne, nodeIndexTwo, [], 0);
    };

    /**
     *
     * @param nodeIndexOne
     * @param nodeIndexTwo
     * @param allPath
     * @param weight
     * @returns {*}
     */
    this.getRoute = function (nodeIndexOne, nodeIndexTwo, allPath, weight) {

        allPath.push(nodeIndexOne);
        if (nodeIndexOne == nodeIndexTwo) {
            return {
                allPath: allPath,
                weight : weight
            };
        }

        var minWeight = 999;
        var minPath   = [];

        for (var i = 0; i < this.nodes.length; i++) {
            // выбираем все вержины в которые есть путь из nodeIndexOne
            if (that.matrix[nodeIndexOne][i] != 999) {
                // если через эту вершину еще не проходили
                if (ArrayIndexOf(allPath, i) == -1) {
                    var res = this.getRoute(i, nodeIndexTwo, allPath.slice(0), weight + that.matrix[nodeIndexOne][i]);
                    if (res) {
                        if (res.weight < minWeight) {
                            minWeight = res.weight;
                            minPath   = res.allPath;
                        }
                    }
                }
            }
        }

        return {
            allPath: minPath,
            weight : minWeight
        };
    };


    /**
     *
     */
    this.printMatrix = function () {

        var strHeader = '';
        for (var i = 0; i < that.nodes.length; i++) {
            strHeader += '   ' + that.nodes[i][0];
        }

        for (var i = 0; i < that.nodes.length; i++) {
            var strOut = '';
            for (var j = 0; j < that.nodes.length; j++) {
                strOut += ' ' + that.matrix[i][j];
            }
            strOut += ' | ' + that.nodes[i];
        }
    };

    /**
     *
     * @returns {string}
     */
    this.toJSONString = function () {

        var matrixString = [];
        for (var i = 0; i < this.nodes.length; i++) {
            matrixString.push('[' + this.matrix[i].join(',') + ']');
        }
        var str = '{ "nodes": ["' + this.nodes.join('","') + '"],"matrix":[' + matrixString.join(',') + ']}';
        return str;
    };


};