"use strict";

var config = require('./config.json');
var commander = require('commander');
var jsonfile = require('jsonfile');
var test;
require('./lib/polyfill');

commander.option('-r, --runner [runner]', 'Specify a specific Capability set to run on, e.g. --runner "Win7 Chrome". Runs all by default.')
    .option('-u, --user [user]', 'The BrowserStack API user to use.')
    .option('-k, --key [key]', 'The BrowserStack API key to use.')
    .option('-i, --identifier [identifier]', 'The BrowserStack LocalIdentifier to use. Optional.')
    .option('-l, --local [browser]', 'Use local webdriver instead of BrowserStack with the specified browser.')
    .option('-u, --url [url]', 'The URL for dash.js-browser. Required if --local.')
    .parse(process.argv);

// Update capabilities with credentials if provided
if (commander.user) {
    config.base_capabilities['browserstack.user'] = commander.user;
}
if (commander.key) {
    config.base_capabilities['browserstack.key'] = commander.key;
}
if (commander.identifier) {
    config.base_capabilities['browserstack.localIdentifier'] = commander.identifier;
}
if (commander.local) {
    test = require('selenium-webdriver/testing');
} else {
    test = require('browserstack-webdriver/testing');
}
// If we're running on Jenkins, tag with the specific build
if (process.env.BUILD_TAG) {
    config.base_capabilities.build += '- ' + process.env.BUILD_TAG;
}

// This is the hostname that will serve the local directory
var hostname = commander.url ? commander.url : 'http://' + config.base_capabilities['browserstack.user'] + '.browserstack.com';

function get_driver(capabilities) {
    var webdriver,
        driver;
    if (commander.local) {
        webdriver = require('selenium-webdriver');
        driver = new webdriver.Builder()
            .withCapabilities(webdriver.Capabilities[commander.local]())
            .build();
    } else {
        webdriver = require('browserstack-webdriver');
        driver = new webdriver.Builder()
            .usingServer('http://hub.browserstack.com/wd/hub')
            .withCapabilities(capabilities)
            .build();
    }

    return driver;
}

function run_suite(spec, suite, driver) {
    describe(config.runners[spec].suites[suite], function() {
        require('./spec/' + config.runners[spec].suites[suite])(test, driver, config, hostname);
    });
}

// Currently we wait for one to finish before starting the next
// Using https://www.browserstack.com/automate/node#wd's parallel runs would be good
var runner_running = false;
var runner_results = {};
function run_runner(spec) {
    if (runner_running) {
        setTimeout(function() {
            run_runner(spec);
        }, 5000);
    } else {
        runner_running = true;
        test.describe(spec, function() {
            var capabilities = Object.assign({}, config.base_capabilities, config.runners[spec].capabilities);

            var driver = get_driver(capabilities);

            for (var suite in config.runners[spec].suites) {
                if (config.runners[spec].suites.hasOwnProperty(suite)) {
                    run_suite(spec, suite, driver);
                }
            }

            driver.session_.then(function(sessionData) {
                runner_results[spec] = sessionData.id_;
                jsonfile.writeFile('sessions.json', runner_results);
            });

            test.after(function() {
                driver.quit();
                runner_running = false;
            });
        });
    }
}

for (var spec in config.runners) {
    if (config.runners.hasOwnProperty(spec)) {
        if (!commander.runner || spec === commander.runner) {
            run_runner(spec);
        }
    }
}
