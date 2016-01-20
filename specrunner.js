"use strict";

var config = require('./config');
var webdriver = require(config.DRIVER);
var test = require('browserstack-webdriver/testing');

var runner_requested;

for (let index in process.argv) {
    if (process.argv[index].startsWith('--runner')) {
        let arg = process.argv[index].replace('--runner ', '').replace('--runner=', '');
        if (config.RUNNERS.hasOwnProperty(arg)) {
            runner_requested = arg;
        }
    }
    if (process.argv[index].startsWith('--user')) {
        let arg = process.argv[index].replace('--user ', '').replace('--user=', '');
        config.BASE_CAPABILITIES['browserstack.user'] = arg;
    }
    if (process.argv[index].startsWith('--key')) {
        let arg = process.argv[index].replace('--key ', '').replace('--key=', '');
        config.BASE_CAPABILITIES['browserstack.key'] = arg;
    }
}

for (let spec in config.RUNNERS) {
    if (config.RUNNERS.hasOwnProperty(spec)) {
        if (!runner_requested || spec === runner_requested) {
            test.describe(spec, function() {
                let capabilities = Object.assign({}, config.BASE_CAPABILITIES, config.RUNNERS[spec].capabilities);
                let driver = new webdriver.Builder()
                    .usingServer('http://hub.browserstack.com/wd/hub')
                    .withCapabilities(capabilities)
                    .build();

                for (let suite in config.RUNNERS[spec].suites) {
                    describe(spec + ' - ' + config.RUNNERS[spec].suites[suite], function() {
                        require('./spec/' + config.RUNNERS[spec].suites[suite])(driver);
                    });
                }

                test.after(function() {
                    driver.quit();
                });
            });
        }
    }
}
