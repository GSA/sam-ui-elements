export const ScrollHelpers: (window) => {
  enableScroll: () => void, disableScroll: () => void } =
  function (window) {
    // Taken from https://stackoverflow.com/a/4770179/5157959

    // left: 37, up: 38, right: 39, down: 40,
    // spacebar: 32, pageup: 33, pagedown: 34, end: 35, home: 36
    if (!window) {
      return;
    }
    const keys = {37: 1, 38: 1, 39: 1, 40: 1};

    function preventDefault(e) {
      const returnVal = e || window.event;
      if (returnVal.preventDefault) {
        returnVal.preventDefault();
      }
      returnVal.returnValue = false;  
    }

    function preventDefaultForScrollKeys(e) {
      if (keys[e.keyCode]) {
        preventDefault(e);
        return false;
      }
    }

    function disableScroll() {
      if (window.addEventListener) { // older FF
        window.addEventListener('DOMMouseScroll', preventDefault, false);
      }
      window.onwheel = preventDefault; // modern standard
      window.onmousewheel =
        window.document.onmousewheel = preventDefault; // older browsers, IE
      window.ontouchmove  = preventDefault; // mobile
      document.onkeydown  = preventDefaultForScrollKeys;
    }

    function enableScroll() {
      if (window.removeEventListener) {
        window.removeEventListener('DOMMouseScroll', preventDefault, false);
      }
      window.onmousewheel = window.document.onmousewheel = undefined; 
      window.onwheel = undefined; 
      window.ontouchmove = undefined;  
      document.onkeydown = undefined;  
    }

    return {
      disableScroll: disableScroll,
      enableScroll: enableScroll
    };
  };
