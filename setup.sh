#!/bin/bash
echo "Checking if 'serve' is installed..."
npm list --depth 1 --global serve > /dev/null 2>&1

if [ $? == 0 ]; then
  echo "'serve' Installed. Running simulator."
else
  echo "Installing 'serve'..."
  # Need sudo for Linux-based distros, non-sudo for macOS
  if [ $(uname -s) == 'Darwin' ]; then
    npm install -g serve
  else
    sudo npm install -g serve
  fi
fi

echo "Running MiniApp Simulator"
echo "$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )/build/"
serve -s "$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )/build/"
