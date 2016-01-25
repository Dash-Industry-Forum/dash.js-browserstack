"use strict";

var test = require('browserstack-webdriver/testing');

var mpds = [
    'http://rdmedia.bbc.co.uk/dash/ondemand/testcard/1/client_manifest-events.mpd',
    'http://rdmedia.bbc.co.uk/dash/ondemand/elephants_dream/1/client_manifest-all.mpd',
    'http://demo.unified-streaming.com/video/ateam/ateam.ism/ateam.mpd'
];

function run(driver, hostname) {
    for (let i = 0; i < mpds.length; i++) {

        describe(mpds[i], function() {
            test.it('should play the video', function() {
                driver.get('http://' + hostname + '/harness.html')
                .then(function() {
                    driver.executeScript('mpd("' + mpds[i] + '")');
                    driver.wait(function() {
                        return driver.executeScript('return events.timeupdate;');
                    }, 10000);
                });
            });

            test.it('should seek', function() {
                driver.executeScript('video.currentTime=Math.floor(video.duration - 5); resetEvents();');
                driver.wait(function() {
                    return driver.executeScript('return events.timeupdate && video.currentTime >= video.duration - 5 + 1;');
                }, 10000);
            });

            test.it('should end', function() {
                driver.executeScript('resetEvents()');
                driver.wait(function() {
                    return driver.executeScript('return events.ended;');
                }, 10000);
            });
        });
    }
}

module.exports = run;
