#!/bin/bash
if [ -d "./node_modules/puppeteer/.local-chromium/" ]
then
echo "Local Chrome found"
else 
echo "No local chrome for puppeteer was found, downloading now..."
npm install puppeteer
fi
