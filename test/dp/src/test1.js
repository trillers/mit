var fs = require('fs');
var cache = {};
var i = 0
function inconsistentRead(filename, callback) {
    if(cache[filename]) {
        //invoked synchronously
        callback(cache[filename]);
    } else {
        //asynchronous function
        fs.readFile(filename, 'utf8', function(err, data) {
            console.log("===========")
            cache[filename] = data;
            callback(data);
        });
    }
}
function createFileReader(filename) {
    var listeners = [];
    inconsistentRead(filename, function(value) {
        listeners.forEach(function(listener) {
            listener(value);
        }); });
    return {
        onDataReady: function(listener) {
            listeners.push(listener);
        }
    };
}
var reader1 = createFileReader('./data.txt');
reader1.onDataReady(function(data) {
    console.log('First call data: ' + data);
    //...sometime later we try to read again from
    //the same file
    var reader2 = createFileReader('./data.txt');
    reader2.onDataReady(function(data) {
        console.log('Second call data: ' + data);
        var reader3 = createFileReader('./data.txt');
        reader3.onDataReady(function(data) {
            console.log('Third call data: ' + data);
        });
    });
});