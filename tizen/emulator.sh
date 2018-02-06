#!/usr/bin/env bash
em-cli launch -n w-0122-1
sleep 10
source $(dirname $0)/build-core.sh
sdb dlog ConsoleMessage:V # watch console output for javascript logs