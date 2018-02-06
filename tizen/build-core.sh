#!/usr/bin/env bash
echo $(pwd)
rm ./BusTracker.wgt ./.manifest.tmp ./author-signature.xml ./signature1.xml
tizen clean
cp ../build/* .
rm favicon.ico *.map sw.js
tizen build-web # build a web project
tizen package -t wgt -s JohnCulviner # package the widget using my signature stored elsewhere
tizen install -n BusTracker.wgt # install the widget on emulator attached to sdb