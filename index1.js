// ===============================
// Étape 1 – Importer les modules
// ===============================
const fs = require('fs');
const convert = require('xml-js');
const protobuf = require('protobufjs');

// ===============================
// Étape 2 – Charger le fichier .proto
// ===============================
const root = protobuf.loadSync('employee.proto');
const EmployeeList = root.lookupType('Employees');

// ===============================
// Étape 3 – Créer la liste d'employés
// ===============================
const employees = [
  { id: 1, name: 'Ali', salary: 9000 },
  { id: 2, name: 'Kamal', salary: 22000 },
  { id: 3, name: 'Amal', salary: 23000 }
];

// ===============================
// Étape 4 – Construire l’objet racine
// ===============================
let jsonObject = { employee: employees };

// ===============================
// Étape 5 – Sérialisation en JSON
// ===============================
fs.writeFileSync('data.json', JSON.stringify(jsonObject, null, 2));
console.log('Fichier JSON créé : data.json');

// ===============================
// Étape 6 – Sérialisation en XML
// ===============================
const xmlOptions = { compact: true, ignoreComment: true, spaces: 2 };
let xmlData = "<root>\n" + convert.js2xml(jsonObject, xmlOptions) + "\n</root>";
fs.writeFileSync('data.xml', xmlData);
console.log('Fichier XML créé : data.xml');

// ===============================
// Étape 7 – Sérialisation en Protobuf
// ===============================
const errMsg = EmployeeList.verify(jsonObject);
if (errMsg) throw Error(errMsg);

const message = EmployeeList.create(jsonObject);
const buffer = EmployeeList.encode(message).finish();
fs.writeFileSync('data.pb', buffer);
console.log('Fichier Protobuf créé : data.pb');

// ===============================
// Étape 8 – Récupérer la taille des fichiers
// ===============================
const jsonFileSize = fs.statSync('data.json').size;
const xmlFileSize = fs.statSync('data.xml').size;
const protoFileSize = fs.statSync('data.pb').size;

console.log(`Taille de 'data.json' : ${jsonFileSize} octets`);
console.log(`Taille de 'data.xml'  : ${xmlFileSize} octets`);
console.log(`Taille de 'data.pb'   : ${protoFileSize} octets`);
