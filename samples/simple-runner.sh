#!/bin/sh
# Sample usage: samples/simple-runner.sh /path/to/config.json
set -ux
config_file=$1
local_identifier='DASH-IF-dash.js'
local_path=`pwd`
browserstack_user=`cat $config_file | jq -r '.secure_configuration["browserstack-user"]'`
browserstack_key=`cat $config_file | jq -r '.secure_configuration["browserstack-key"]'`

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
