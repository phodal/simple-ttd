const Instrumentor = require("./instrumentor");

let instrumentor = new Instrumentor({});
let code = `
console.log('hello, world')
`;
let instrument = instrumentor.instrument(code);

console.log(instrument);

