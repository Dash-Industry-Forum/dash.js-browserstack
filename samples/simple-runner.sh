#!/bin/sh
# Sample usage: samples/simple-runner.sh /path/to/config.json
set -x
config_file=$1
local_identifier='DASH-IF-dash.js'
local_path=`pwd`
browserstack_user=`cat $config_file | jq -r '.secure_configuration["browserstack-user"]'`
browserstack_key=`cat $config_file | jq -r '.secure_configuration["browserstack-key"]'`
# Running in a CI environment
if [ ! -z "$BUILD_TAG" ]
  then
    local_identifier=$BUILD_TAG
    # Clean old build artifacts out
    rm -rf logs/jenkins*
    mkdir logs
    # Create/update an index file
    echo -e "<a href="$BUILD_TAG">$BUILD_TAG</a><br>\n$(head -n 28 logs/index.html)" > logs/index.html
fi
# Debugging is useful, but we don't want keys in the logs
set +x

npm install
BrowserStackLocal -only -f $browserstack_key $local_path -localIdentifier $local_identifier &
sleep 5
mocha specrunner.js --user $browserstack_user --key $browserstack_key --identifier $local_identifier
RESULT=$?

# Stop BrowserStackLocal
jobs
kill %1

# Download reports
node $local_path/logfetcher.js --user $browserstack_user --key $browserstack_key

exit $RESULT
