const fs = require('fs');
const path = require('path');

var updateCoverage = function(target) {
    var exists = fs.existsSync(target);
    var isDirectory = exists;
    if (exists) {
        fs.readFile(target, 'utf8', function (err,data) {
            if (err) {
                return console.log(err);
            }
            var result = data.replace(/test-app\/src\/components\//g, 'src/');
            
            fs.writeFile(target, result, 'utf8', function (err) {
                if (err) return console.log(err);
            });
        });
    } else {
        console.log(target,"no exists");
    }
};

updateCoverage('coverage/lcov.info');