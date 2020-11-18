'use strict'

var startTime;
var elapsedTime;
var timerInterval;

// function getTime() {
//     return new Date().toString().split(' ')[4];
// }

//stopWatch
function timeToString(elapsedTime) {
    var toSec = elapsedTime / 1000;
    var ss = Math.floor(toSec);
    // var ms = elapsedTime % 1000;
    // console.log('elapsed=' + elapsedTime + ' toSec=' + toSec);
    var formattedSS = ss.toString().padStart(3, "0");
    // var formattedMS = ms.toString().padStart(3, "0");

    return formattedSS; //+ '.' + formattedMS;
}

function print(txt) {
    document.getElementById("timer").innerHTML = txt;
}

function startWatch() {
    startTime = Date.now();
    timerInterval = setInterval(function printTime() {
        elapsedTime = Date.now() - startTime;
        print(timeToString(elapsedTime));
    }, 100);
}

function stopWatch() {
    clearInterval(timerInterval);
}

function resetWatch() {
    clearInterval(timerInterval);
    print("000");

    startTime = 0;
}
