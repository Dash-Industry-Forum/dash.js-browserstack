"use strict";

var config = require('./config');
var webdriver = require(config.DRIVER);
var test = require('browserstack-webdriver/testing');
var commander = require('commander');

commander.option('-r, --runner [runner]')
    .option('-u, --user [user]')
    .option('-k, --key [key]')
    .parse(process.argv);

if (commander.user) {
    config.BASE_CAPABILITIES['browserstack.user'] = commander.user;
}
if (commander.key) {
    config.BASE_CAPABILITIES['browserstack.key'] = commander.key;
}

var hostname = config.BASE_CAPABILITIES['browserstack.user'] + '.browserstack.com';

for (let spec in config.RUNNERS) {
    if (config.RUNNERS.hasOwnProperty(spec)) {
        if (!commander.runner || spec === commander.runner) {
            test.describe(spec, function() {
                let capabilities = Object.assign({}, config.BASE_CAPABILITIES, config.RUNNERS[spec].capabilities);
                let driver = new webdriver.Builder()
                    .usingServer('http://hub.browserstack.com/wd/hub')
                    .withCapabilities(capabilities)
                    .build();

                for (let suite in config.RUNNERS[spec].suites) {
                    if (config.RUNNERS[spec].suites.hasOwnProperty(suite)) {
                        describe(spec + ' - ' + config.RUNNERS[spec].suites[suite], function() {
                            require('./spec/' + config.RUNNERS[spec].suites[suite])(driver, hostname);
                        });
                    }
                }

                test.after(function() {
                    driver.quit();
                });
            });
        }
    }
}
