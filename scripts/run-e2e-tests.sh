#!/bin/bash
# Move to the Playwright test project folder
cd $HOME

# Install the necessary npm packages
npm install
npx playwright install

# Execute gremlins
echo "Running Playwright tests"
DISPLAY=:10 npx playwright test
export RESULT=$?

echo "Playwright tests have finished"
exit $RESULT