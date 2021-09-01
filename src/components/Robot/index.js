import React, { useEffect } from 'react';

import './styles.scss';

const Robot = () => {
  let jumping = false;
  // let left = 0;
  // Keyboard input with customisable repeat (set to 0 for no key repeat)
  //
  const KeyboardController = (keys, repeat) => {
  // Lookup of key codes to timer ID, or null for no repeat
  //
    let timers = {};

    // When key is pressed and we don't already think it's pressed, call the
    // key action callback and set a timer to generate another one after a delay
    //
    document.onkeydown = function (event) {
      const key = (event || window.event).keyCode;
      if (!(key in keys)) return true;
      if (!(key in timers)) {
        timers[key] = null;
        keys[key]();
        if (repeat !== 0) timers[key] = setInterval(keys[key], repeat);
      }
      return false;
    };

    // Cancel timeout and mark key as released on keyup
    //
    document.onkeyup = function (event) {
      const key = (event || window.event).keyCode;
      if (key in timers) {
        if (timers[key] !== null) clearInterval(timers[key]);
        delete timers[key];
      }
    };

    // When window is unfocused we may not get key events. To prevent this
    // causing a key to 'get stuck down', cancel all held keys
    //
    window.onblur = function () {
      for (key in timers) if (timers[key] !== null) clearInterval(timers[key]);
      timers = {};
    };
  };

  KeyboardController({
    37: function() { goLeft()},
    38: function() { goJump()},
    39: function() { goRight()},
    32: function() { goJump()},
  }, 50);
  // 200 originally, (works best with 50)

  /// /////////////////////////////

  const goJump = () => {
    const robot = document.querySelector('.robot');
    if (jumping === true) {
      console.log("can't jump");
    }
    else {
      robot.style.animationName = 'jump';
      jumping = true;

      setTimeout(() => {
        robot.style.animationName = 'none';
        jumping = false;
      }, 950);
    }
  };

  const goRight = () => {
    const robot = document.querySelector('.robot');
    const screenWidth = window.innerWidth;

    const leftPx = robot.style.left;
    const left = leftPx.split('px')[0];

    if (screenWidth - left > 30) {
      const newLeft = `${parseInt(left, 10) + 30}px`;
      robot.style.left = newLeft;
    }
  };

  const goLeft = () => {
    const robot = document.querySelector('.robot');
    const leftPx = robot.style.left;
    const left = leftPx.split('px')[0];

    if (left >= 0) {
      const newLeft = `${parseInt(left, 10) - 30}px`;
      robot.style.left = newLeft;
    }
  };

  // const jump = (evt) => {
  //   // const robot = document.querySelector('.robot');

  //   if (evt.code === 'Space' || evt.code === 'ArrowUp') {
  //     if (jumping === true) {
  //       console.log("can't jump");
  //     }

  //     else {
  //       robot.style.animationName = 'jump';
  //       jumping = true;

  //       setTimeout(() => {
  //         robot.style.animationName = 'none';
  //         jumping = false;
  //       }, 1000);
  //     }
  //   }

  //   if (evt.code === 'ArrowRight') {
  //     const screenWidth = window.innerWidth;

  //     const leftPx = robot.style.left;
  //     const left = leftPx.split('px')[0];

  //     if (screenWidth - left > 30) { // s'il reste au moins 30px à droite on peut continuer
  //       const newLeft = `${parseInt(left, 10) + 30}px`;
  //       console.log(newLeft);
  //       robot.style.left = newLeft;
  //     }
  //   }

  //   if (evt.code === 'ArrowLeft') {
  //     const screenWidth = window.innerWidth;

  //     const leftPx = robot.style.left;
  //     const left = leftPx.split('px')[0];

  //     if (left >= 50) { // s'il reste au moins 30px à droite on peut continuer
  //       const newLeft = `${parseInt(left, 10) - 30}px`;
  //       console.log(newLeft);
  //       robot.style.left = newLeft;
  //     }
  //   }
  // };

  // useEffect(() => {
  //   window.addEventListener('keydown', jump);

  //   // Remove event listeners on cleanup
  //   return () => {
  //     window.removeEventListener('keydown', jump);
  //   };
  // }, []);

  return (
    <div className="robot" style={{ left: '50px' }} />
  );
};

export default Robot;
