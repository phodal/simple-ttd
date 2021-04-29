const acorn = require("acorn");
const {generate} = require("escodegen");

var Instrumentor = function (config) {
    this.opts = {};
    Object.assign(this.opts, config);
    this.visitor = this.createVisitor();
}

Instrumentor.prototype = {
    instrument: function (content) {
        let node = this.parse(content);
        let modify = this.change(node, this.visitor);
        let generateCode = this.generate(modify);

        return {
            code: generateCode
        }
    },
    createVisitor: function () {

    },
    change: function (node, visitor) {
        return node;
    },
    generate: function (node) {
        return generate(node, {})
    },
    parse: function (content) {
        var node = acorn.parse(content, {
            ecmaVersion: 11,
            locations: true,
            allowImportExportEverywhere: true,
            allowReturnOutsideFunction: true,
            allowAwaitOutsideFunction: true,
            plugins: {
                jsx: true
            }

        });

        return node;
    }
}

module.exports = Instrumentor;
