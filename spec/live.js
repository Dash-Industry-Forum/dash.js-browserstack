"use strict";
/**
 * Runs a simple playback test on a set of MPDs. Validates start of playback,
 * seeking, and end of playback.
 * Edit core_mpds in the config to add/remove MPDs to play.
 */

var test = require('browserstack-webdriver/testing');

function run_mpd(mpd, test, driver, hostname) {
    describe(mpd, function() {
        test.it('should play the video', function() {
            driver.get(hostname + '/harness.html')
            .then(function() {
                driver.executeScript('mpd("' + mpd + '")');
                driver.wait(function() {
                    return driver.executeScript('return events.timeupdate >= 15;');
                }, 15000);
            });
        });

        test.it('should play for a few seconds', function() {
            driver.executeScript('window.lt_ct=video.currentTime');
            driver.wait(function() {
                return driver.executeScript('return video.currentTime >= window.lt_ct + 8');
            }, 20000);
        });
    });
}

function run(test, driver, config, hostname) {
    var mpds = config.live_mpds;
    for (var i = 0; i < mpds.length; i++) {
        run_mpd(mpds[i], test, driver, hostname);
    }
}

module.exports = run;
