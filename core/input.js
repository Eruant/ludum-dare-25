/*
* INPUT
* ====================
* Author:   Matt Gale (info@littleball.co.uk)
* Version:  0.0.2
*
* This module deals with getting user input from the device
*/

(function() {

  window.essence.input = new function(){
  
    // --- variables

    // private variables
    var t = this,
      getEvent;

    // public variables
    this.activeKeys = new Array();

    // --- private functions

    // get event
    getEvent = function(ev) {
      return ev || window.event;
    };

    // --- public funtions

    // activate the key listener (if used)
    this.keyListener = function() {
      window.addEventListener('keydown', t.keyPressed, false);
      window.addEventListener('keyup', t.keyReleased, false);
    };

    // point a listener at this funtion
    this.keyPressed = function(ev) {
      var ev = getEvent(ev);
      if(t.activeKeys.indexOf(ev.keyCode) == -1) {
        t.activeKeys.push(ev.keyCode);
      }
    };

    // point a listener at this
    this.keyReleased = function(ev) {
      var ev = getEvent(ev),
        key = t.activeKeys.indexOf(ev.keyCode);
      if(key !== -1) {
        t.activeKeys.splice(key,1);
      }
    };

    this.isKeyPressed = function(ev,keyCode) {
      var ev = getEvent(ev);
      if(ev.keyCode && ev.keyCode == keyCode) {
        return true;
      } else {
        return false;
      }
    }

  };

})();
