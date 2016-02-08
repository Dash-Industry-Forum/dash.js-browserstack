"use strict";
/**
 * Runs a simple playback test on a set of MPDs. Validates start of playback,
 * seeking, and end of playback.
 * Edit core_mpds in the config to add/remove MPDs to play.
 */

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

function run(test, driver, config, hostname) {
    var mpds = config.core_mpds;
    for (var i = 0; i < mpds.length; i++) {
        run_mpd(mpds[i], test, driver, hostname);
    }
}

module.exports = run;
