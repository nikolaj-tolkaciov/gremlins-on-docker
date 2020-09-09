#!/bin/bash
# Move to the Protractor test project folder
cd $HOME

# Install the necessary npm packages
npm install
./prerequisites.sh
# Run the Selenium installation script, located in the local node_modules/ directory.
# This script downloads the files required to run Selenium itself and build a start script and a directory with them.
# When this script is finished, we can start the standalone version of Selenium with the Chrome driver by executing the start script.
# node ./node_modules/protractor/bin/webdriver-manager update
# X11 for Ubuntu is not configured! The following configurations are needed for XVFB.
# Make a new display :21 with virtual screen 0 with resolution 1024x768 24dpi
Xvfb :10 -screen 0 1920x1080x24 2>&1 >/dev/null &

echo "Running Puppeteer tests"
DISPLAY=:10 node gremlins.js
export RESULT=$?

echo "Puppeteer tests have finished"
# Close the XVFB display
pkill Xvfb
# Remove temporary folders
rm -rf .config .local .pki .cache .dbus .gconf .mozilla

exit $RESULT