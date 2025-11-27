const fs = require('fs');
const convert = require('xml-js');
const protobuf = require('protobufjs');

// Charger la définition Protobuf depuis employee.proto
const root = protobuf.loadSync('employee.proto');
const EmployeeList = root.lookupType('Employees');

// Construire la liste d'employés
const employees = [
  { id: 1, name: 'Ali', salary: 9000 },
  { id: 2, name: 'Kamal', salary: 22000 },
  { id: 3, name: 'Amal', salary: 23000 }
];

// Objet racine compatible avec message Employees
const jsonObject = { employee: employees };

// ---------- JSON ----------
const jsonData = JSON.stringify(jsonObject, null, 2);
fs.writeFileSync('data.json', jsonData);

// ---------- XML ----------
const xmlOptions = { compact: true, ignoreComment: true, spaces: 2 };
const xmlData = "<root>\n" + convert.js2xml(jsonObject, xmlOptions) + "\n</root>";
fs.writeFileSync('data.xml', xmlData);

// ---------- Protobuf ----------
const errMsg = EmployeeList.verify(jsonObject);
if (errMsg) throw Error(errMsg);

const message = EmployeeList.create(jsonObject);
const buffer = EmployeeList.encode(message).finish();
fs.writeFileSync('data.pb', buffer);

// ---------- Mesure des tailles ----------
const jsonFileSize = fs.statSync('data.json').size;
const xmlFileSize = fs.statSync('data.xml').size;
const protoFileSize = fs.statSync('data.pb').size;

console.log(`Taille de 'data.json' : ${jsonFileSize} octets`);
console.log(`Taille de 'data.xml'  : ${xmlFileSize} octets`);
console.log(`Taille de 'data.pb'   : ${protoFileSize} octets`);

// ---------- Encodage / Décodage avec timing ----------

// JSON
console.time('JSON encode');
JSON.stringify(jsonObject);
console.timeEnd('JSON encode');

console.time('JSON decode');
JSON.parse(jsonData);
console.timeEnd('JSON decode');

// XML
console.time('XML encode');
convert.js2xml(jsonObject, xmlOptions);
console.timeEnd('XML encode');

console.time('XML decode');
const xmlJson = convert.xml2json(xmlData, { compact: true });
JSON.parse(xmlJson);
console.timeEnd('XML decode');

// Protobuf
console.time('Protobuf encode');
EmployeeList.encode(EmployeeList.create(jsonObject)).finish();
console.timeEnd('Protobuf encode');

console.time('Protobuf decode');
const decodedMessage = EmployeeList.decode(buffer);
EmployeeList.toObject(decodedMessage);
console.timeEnd('Protobuf decode');
