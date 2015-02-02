#!/bin/bash
function test_ui {
    cd ui
    npm install
    npm test
    cd ..
}

function test_core_install {
    cd core
    sudo python setup.py install
    cd ..
}

test_ui
test_core_install