const acorn = require("acorn");
const {generate} = require("escodegen");

class InstrumentorVisitor {
    constructor() {

    }

    visitNodes(nodes) {
        let newNodes = [];
        for (const node of nodes) {
            let items = this.visitNode(node);
            newNodes.push(items)
        }

        return newNodes
    }

    visitNode(node) {
        switch (node.type) {
            case 'VariableDeclaration':
                return node
            case 'VariableDeclarator':
                return node
            case 'Literal':
                return node
            case 'Identifier':
                return node
            case 'BinaryExpression':
                return node
            default:
                return node
        }
    }

    insertStart() {
        return {
            type: "VariableDeclaration",
            kind: "var",
            declarations: [{
                type: "VariableDeclarator",
                id: {type: "Identifier", name: "$_$idt"},
                init: {
                    type: "CallExpression",
                    callee: {type: "Identifier", name: "$_$st"},
                    arguments: ""
                }
            }]
        }
    }

    run(nodes) {
        let new_nodes = [];
        // new_nodes.push(this.insertStart());
        let items = this.visitNodes(nodes.body);
        let fin = new_nodes.concat(items);
        return fin;
    }
}

var Instrumentor = function (config) {
    this.opts = {};
    Object.assign(this.opts, config);
}

Instrumentor.prototype = {
    instrument: function (content) {
        let node = this.parse(content);
        let visitor = new InstrumentorVisitor();
        // let modify = visitor.run(node)
        // console.log(modify);
        let generateCode = this.generate(node);

        return {
            code: generateCode
        }
    },
    change: function (node, visitor) {
        console.log(node);
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
