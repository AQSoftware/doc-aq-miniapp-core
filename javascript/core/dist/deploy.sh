#!/bin/bash

rm -f *.tgz
yarn pack
aws s3 cp *.tgz s3://funminiapps/sdk/
aws s3 cp *.min.js s3://funminiapps/sdk/