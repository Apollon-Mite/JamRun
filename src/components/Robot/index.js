import React, { useEffect, useState } from 'react';
import './styles.scss';
import runRobot from 'src/assets/images/run_robot.gif';
import fallRobot from 'src/assets/images/robot_fall_px.gif';

const Robot = () => {
  let jumping = false;
  let lost = false;
  let nearlyDown = true; // instead of checking vertical position at some intervals
  // we are going to let game know when character nearly reached the floor, in which
  // case : nearlyDown will be true.
  
  

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

  KeyboardController(
    {
      37: function() { goLeft()},
      38: function() { goJump()},
      39: function() { goRight()},
      32: function() { goJump()},
    },
    75,
  );
  // 200 originally, (works best with 50 or 100)

  const goJump = () => {
    const robot = document.querySelector('.robot');
    if (jumping === true) {
      console.log("can't jump");
    }
    else {
      robot.style.animationName = 'jump';
      jumping = true;
      setTimeout(() => {
        nearlyDown = false; // player jumped so nearlydown is false
      }, 100);
      setTimeout(() => {
        nearlyDown = true; // now player nearly reached the floor
      }, 700);
      setTimeout(() => {
        robot.style.animationName = '';
        jumping = false;
      }, 750);
    }
  };

  let robotElement;
  let obstacleElement;
  const isCollide = () => {
    // for (let i = 1; i <= 100 && lost === false; i += 1) {
    const intervalID = setInterval(() => {
      const robotPosition = robotElement.getBoundingClientRect();
      const obstaclePosition = obstacleElement.getBoundingClientRect();
      const differenceRight = robotPosition.right - obstaclePosition.left;
      const differenceLeft = robotPosition.left - obstaclePosition.right;
      // const differenceTop = robotPosition.bottom - obstaclePosition.top;
      console.log(differenceLeft);
      if (differenceRight > 35 && differenceLeft < -5 && nearlyDown) { //(differenceTop > -20)
        robotElement.querySelector('.robot_image').src = fallRobot;
        console.log("Touché à gauche");
        lost = true;
        clearInterval(intervalID);
      }
      // if (differenceLeft < -10) {
      //   console.log("Touché à droite")
      // }
      // if (lost === true) {
      //   clearInterval(intervalID);
      // }
    }, 100);
  };

  const goRight = () => {
    const robot = document.querySelector('.robot');
    const screenWidth = window.innerWidth;

    const leftPx = robot.style.left;
    const left = leftPx.split('px')[0];

    if (screenWidth - left > 130) {
      const newLeft = `${parseInt(left, 10) + 30}px`;
      robot.style.left = newLeft;
      // setLeft(left + 30);
    }
  };

  const goLeft = () => {
    const robot = document.querySelector('.robot');
    const leftPx = robot.style.left;
    const left = leftPx.split('px')[0];

    if (left >= 0) {
      const newLeft = `${parseInt(left, 10) - 30}px`;
      robot.style.left = newLeft;
      // setLeft(left - 30);
    }
    // isCollide();
  };









  // const [difference, setdifference] = useState(0);

  // const runningAnimation = () => {
  //   const robotElement = document.querySelector('.robot');
  //   const obstacleElement = document.querySelector('.obstacle');
  //   for (let i = 1; i <= 14 && lost === false; i += 1) {
  //     setTimeout(() => {
  //       robotElement.className = `robot run${i}`; // running animation consists on this line

  //       // const robotPosition = robotElement.getBoundingClientRect();
  //       // const obstaclePosition = obstacleElement.getBoundingClientRect();
  //       // const differenceRight = robotPosition.right - obstaclePosition.left;
  //       // const differenceLeft = robotPosition.right - obstaclePosition.left;
  //       // // difference = differenceRight;
  //       // // setdifference(differenceRight)
  //       // // const differenceLeft
  //       // // console.log(differenceRight);

  //       // if (differenceRight > 0) {
  //       //   console.log("Perdu")
  //       //   lost = true;
  //       // }

  //       // if (i === 14 && lost === false) {
  //       //   runningAnimation();
  //       // }
  //       // console.log("animation", left);
  //     }, 50 * (i)); // picture changes every 50ms
  //   }
  // };

  useEffect(() => {
    robotElement = document.querySelector('.robot');
    obstacleElement = document.querySelector('.obstacle');
    isCollide();
  }, []);

  return (
    <>
      <div className="robot" style={{ left: "50px" }}> {/* style={{ left: `${left}px` }} */}
        <img src={runRobot} className="robot_image" />
      </div>
      {/* <p className="difference">{left}</p> */}
    </>
  );
};

export default Robot;
