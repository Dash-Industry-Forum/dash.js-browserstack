"use strict";
/**
 * Runs a simple playback test on a set of MPDs. Validates start of playback,
 * seeking, and end of playback.
 * Edit core_mpds in the config to add/remove MPDs to play.
 */

var test = require('browserstack-webdriver/testing');

function run_mpd(mpd, driver, hostname) {
    describe(mpd, function() {
        test.it('should play the video', function() {
            driver.get('http://' + hostname + '/harness.html')
            .then(function() {
                driver.executeScript('mpd("' + mpd + '")');
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

function run(driver, config, hostname) {
    var mpds = config.core_mpds;
    for (var i = 0; i < mpds.length; i++) {
        run_mpd(mpds[i], driver, hostname);
    }
}

module.exports = run;
