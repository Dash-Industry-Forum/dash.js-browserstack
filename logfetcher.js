var request = require('request');
var fs = require('fs');
var runs = require('./sessions.json');
var commander = require('commander');

commander.option('-u, --user [user]')
    .option('-k, --key [key]')
    .parse(process.argv);
var auth_string = commander.user + ':' + commander.key;
var outdir = 'logs/' + process.env.BUILD_TAG;

if (!fs.statSync('logs')) {
    fs.mkdir('logs');
}
if (!fs.statSync(outdir)) {
    fs.mkdir(outdir);
}

function store_run(run) {
    request.get({
        url: 'https://' + auth_string + '@www.browserstack.com/automate/sessions/' + runs[run] + '.json',
        json: true
    },
    function(error, response, body) {
        if (!error) {
            // Currently the text URL seems to work with curl, but ask for a login for request :(
            var video_url = body.automation_session.video_url;
            //var text_url = body.automation_session.browser_url.replace('https://', 'https://' + auth_string + '@') + '/logs';
            console.log(video_url);
            //console.log(text_url);

            request(video_url).pipe(fs.createWriteStream(outdir + '/' + run + '.mp4'));
            //request(text_url).pipe(fs.createWriteStream(outdir + '/' + run + '.log'));
        }
    });
}

for (var run in runs) {
    if (runs.hasOwnProperty(run)) {
        store_run(run);
    }
}
