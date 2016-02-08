[Latest build status](http://smp-scratch.s3-website-eu-west-1.amazonaws.com/browserstack/)

A set of tests and associated running and helper code for performing Cross-Platform tests against [dash.js](https://github.com/Dash-Industry-Forum/dash.js).

## Quick Start to Viewing
These tests should be automatically ran once per day (8am GMT), and the resulting logs and video recordings uploaded to http://smp-scratch.s3-website-eu-west-1.amazonaws.com/browserstack/. Just take a look there to see the latest results.

## Quick Start to Running
### Prerequisites
1. Ensure you have node 0.12.x or newer, mocha, jq and BrowserStackLocal installed
2. A copy of the ```dist``` directory from dash.js 2.0.0 or newer to a directory named dash in the root of your local checkout
3. A valid BrowserStackLocal API user and key

### Run the tests
1. Install dependencies with ```npm install```
2. Start BrowserStackLocal with ```BrowserStackLocal -only -f YOUR_KEY PATH_TO_WORKING_DIR -localIdentifier SESSION_IDENTIFIER```
3. Run tests in working directory with ```mocha specrunner.js --user YOUR_USER --key YOUR_KEY --identifier SESSION_IDENTIFIER```

## Running locally
1. Ensure you have a Selenium webdriver installed and available in your path
2. Ensure that your dash.js-browserstack is available on a webserver
3. Run the tests with, for example, ```mocha specrunner.js --local chrome --url http://localhost/dash.js-browserstack --runner "Win7 Chrome"```

## Advanced Running
samples/simple-runner.sh does the above, but with some bonuses such as downloading the resulting logs and creating an index to view them. It can be run both in a Jenkins CI environment and locally, with the invocation ```samples/simple-runner.sh /path/to/config.json```. A sample config file would look as follows:

```json
{
    "secure_configuration": {
        "browserstack-user": "YOUR_USER",
        "browserstack-key": "YOUR_KEY"
    }
}
```

The logs directory will contain results in the same format used for the daily runs.

## Notes
This is currently a proof of concept and could do with several key improvements:

1. Parallelisation (currently only one capability suite is run at a time)
2. Far more tests (e.g. Live, MultiPeriod, additional browsers, different configurations)
3. Wiring to run against pull requests
