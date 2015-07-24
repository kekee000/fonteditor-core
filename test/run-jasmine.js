var system = require('system');

if (system.args.length !== 2) {
    console.log('Usage: run-jasmine.js URL');
    phantom.exit(1);
}

// Check for console message indicating jasmine is finished running
var doneRegEx = /^\d+ specs, (\d+) failure/;
var noReallyDoneRegEx = /^Finished in \d[\d\.]* second/;
var rc;

var page = require('webpage').create();

// Route 'console.log()' calls from within the Page context
// to the main Phantom context (i.e. current 'this')

page.onConsoleMessage = function (msg) {
    if (msg.indexOf('[JASMINE]') == 0) {
        msg = msg.substring(9);
        system.stdout.write(msg);
        var match = doneRegEx.exec(msg);
        if (match) {
            rc = match[1] === '0' ? 0 : 1;
            return;
        }
        match = noReallyDoneRegEx.exec(msg);
        if (match) {
            system.stdout.writeLine('');
            phantom.exit(rc);
        }
    }
    else {
        console.log('\n\x1B[33m[LOG]\x1B[0m ' + msg);
    }
};

system.stdout.writeLine('');
page.open(system.args[1], function(status){
    if (status !== 'success') {
        console.log('Could\'t load the page');
    }
    system.stdout.writeLine('');
});

