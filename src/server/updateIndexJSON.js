var fs = require("fs");
function updateIndexJSON(){
  var json = { units: listUnits() },
      jsonStr = JSON.stringify(json, null, 2);
  console.log(jsonStr);
  fs.writeFile("index.json", jsonStr, function(err) {
    if (err) return console.error(err);
    console.log("Updated index.json");
  });
}

function listUnits(){
  var units = fs.readdirSync("units");
  return units.map(function (unit){
    return {
      name: unit,
      modules: listModules(unit)
    };
  });
}

function listModules(unit){
  var modules = fs.readdirSync("units/" + unit);
  return modules.map(function (module){
    return {
      name: module,
      examples: listExamples(unit, module)
    };
  });
}

function listExamples(unit, module){
  var examples = fs.readdirSync("units/" + unit + "/" + module);
  return examples.map(function (example){
    return {
      name: example,
      files: listFiles(unit, module, example)
    };
  });
}

function listFiles(unit, module, example){
  var files = fs.readdirSync("units/" + unit + "/" + module + "/" + example);
  var filesIndex = {};
  files.forEach(function (file){
    filesIndex[file] = false;
  });
  return filesIndex;
}

module.exports = updateIndexJSON;
