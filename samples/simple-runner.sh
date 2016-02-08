#!/bin/sh
# Sample usage: samples/simple-runner.sh /path/to/config.json
set -x
config_file=$1
local_identifier='DASH-IF-dash.js'
local_path=`pwd`
browserstack_user=`jq -r '.secure_configuration["browserstack-user"]' < $config_file`
# Debugging is useful, but we don't want keys in the logs
set +x
browserstack_key=`jq -r '.secure_configuration["browserstack-key"]' < $config_file`
set -x
# Running in a CI environment
if [ ! -z "$BUILD_TAG" ]
  then
    local_identifier=$BUILD_TAG
    # Clean old build artifacts out
    rm -rf logs/jenkins*
    if [ ! -d "logs" ]; then
        mkdir logs
    fi
    touch logs/index.html
fi

npm install
set +x
BrowserStackLocal -only -f $browserstack_key $local_path -localIdentifier $local_identifier &
sleep 5
set -x
multi="json=report.json spec=-" node_modules/.bin/mocha specrunner.js --user $browserstack_user --key $browserstack_key --identifier $local_identifier --reporter mocha-multi
RESULT=$?

set +x
# Stop BrowserStackLocal
jobs
kill %1

# Download reports
node $local_path/logfetcher.js --user $browserstack_user --key $browserstack_key

passes=`jq '.stats.passes' < report.json`
fails=`jq  '.stats.tests' < report.json`

# Create/update an index file
echo -e "<a href="$BUILD_TAG">$BUILD_TAG</a> $(echo -n $passes)/$(echo -n $fails)<br>\n$(head -n 28 logs/index.html)" > logs/index.html

exit $RESULT
