#!/bin/bash
# Move to the Playwright test project folder
cd $HOME

# Install the necessary npm packages
npm install
npx playwright install

# Execute gremlins
echo "Running Playwright tests"
Xvfb :10 -screen 0 1920x1080x24 2>&1 >/dev/null &
DISPLAY=:10 npx playwright test
export RESULT=$?

echo "Playwright tests have finished"

pkill Xvfb
# Remove temporary folders
rm -rf .config .local .pki .cache .dbus .gconf .mozilla /tmp/.X10-lock

exit $RESULT