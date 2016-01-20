"use strict"

const DRIVER = 'browserstack-webdriver';

const RUNNERS = {
    'Win7 FF': {
        'capabilities': {
            'browserName': 'firefox',
            'os': 'WINDOWS',
            'os_version': '7'
        },
        'suites': [ 'core' ]
    },
    'Win7 Chrome': {
        'capabilities': {
            'browserName': 'chrome',
            'os': 'WINDOWS',
            'os_version': '7'
        },
        'suites': [ 'core' ]
    },
    'OSX FF': {
        'capabilities': {
            'browserName': 'firefox',
            'os': 'OS X',
            'os_version': 'Yosemite'
        },
        'suites': [ 'core' ]
    },
    'OSX Chrome': {
        'capabilities': {
            'browserName': 'chrome',
            'os': 'OS X',
            'os_version': 'Yosemite'
        },
        'suites': [ 'core' ]
    }
};

const BASE_CAPABILITIES = {
    'project': 'dash.js',
    'browserstack.user': '',
    'browserstack.key': '',
    'browserstack.debug': true,
    'browserstack.local': true
};

module.exports = {
    DRIVER: DRIVER,
    RUNNERS: RUNNERS,
    BASE_CAPABILITIES: BASE_CAPABILITIES
};
