// This is the example viewer server.
//
// It's purpose is to enable editing the examples
// inside the presentation environment.

var express = require("express");
var bodyParser = require("body-parser");
var fs = require("fs");
var mkdirp = require("mkdirp");
var path = require("path");
var async = require("async");
var updateIndexJSON = require("./updateIndexJSON");
var examplePath = require("../common/examplePath");

var app = express();

app.use(bodyParser.json());
app.use(express.static(".", {
  dotfiles: "allow"
}));

app.post("/save", function (req, res){
  const params = req.body.params,
        files = req.body.files,
        fileNames = Object.keys(files);

  async.each(fileNames, function (fileName, callback){
    const directory = examplePath(params),
          filePath = path.join(directory, fileName),
          content = files[fileName];

    mkdirp(directory, function (err) {
      if (err) return res.send(err);
      fs.writeFile(filePath, content, function(err) {
        if (err) return res.send(err);
        callback();
      });
    });
  }, function (){
    res.send("Saved!");
    updateIndexJSON();
  });
});

// Update the index when the server starts,
// in case files have changed outside the editor.
updateIndexJSON();

app.listen(3000, function () {
  console.log("Listening at http://localhost:3000");
});
