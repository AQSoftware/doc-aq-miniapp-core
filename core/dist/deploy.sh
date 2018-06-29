#!/bin/bash -ex

rm -f *.tgz
yarn pack
aws s3 cp *.tgz s3://fma-sdk/sdk/
