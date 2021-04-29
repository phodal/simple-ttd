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
                    callee: {type: "Identifier", name: "$_$start"},
                    arguments: ""
                }
            }]
        }
    }

    insertEnd() {
        return {
            type: "ExpressionStatement",
            expression: {
                type: "CallExpression",
                callee: {type: "Identifier", name: "$_$end"},
                arguments: ""
            }
        }
    }

    run(nodes) {
        let origin_body = nodes.body;
        nodes.body = [];
        nodes.body.push(this.insertStart());

        let items = this.visitNodes(origin_body);
        nodes.body = nodes.body.concat(items);

        nodes.body.push(this.insertEnd());

        return nodes;
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
        let modify = visitor.run(node)
        let generateCode = this.generate(modify);

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
