/* eslint-disable no-undef */
import React, { useEffect } from 'react';
import './styles.scss';
import runRobot from 'src/assets/images/run_robot.gif';
import fallRobot from 'src/assets/images/robot_fall_px.gif';
import explosionAudio from 'src/assets/audio/explosion.mp3';
import loseAudio from 'src/assets/audio/you_lose.mp3';
import runAudio from 'src/assets/audio/running.mp3';
import fallAudio from 'src/assets/audio/fall.mp3';
import jumpAudio from 'src/assets/audio/jump.mp3';

const Robot = () => {
  let jumping = false;
  let score = 0;
  let runInterval;
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
      if (lost) {
        return;
      }
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
      37: function() { goLeft(); },
      38: function() { goJump(); },
      39: function() { goRight(); },
      32: function() { goJump(); },
    },
    75,
  );
  // 200 originally, (works best with 50 or 100)
  const runSound = new Audio(runAudio);
  const jumpSound = new Audio(jumpAudio)

  const goJump = () => {
    const robot = document.querySelector('.rbt');
    if (jumping === true) {
      console.log("can't jump");
    }
    else {
      robot.style.animationName = 'jump';
      jumpSound.play();
      runSound.pause();
      jumping = true;
      setTimeout(() => {
        nearlyDown = false; // player jumped so nearlydown is false
      }, 100);
      setTimeout(() => {
        nearlyDown = true; // now player nearly reached the floor
        runSound.play();
      }, 700);
      setTimeout(() => {
        robot.style.animationName = '';
        jumping = false;
      }, 750);
    }
  };

  const explosionSound = new Audio(explosionAudio);
  const loseSound = new Audio(loseAudio);
  const fallSound = new Audio(fallAudio);

  let robotElement;
  const gameOver = (intervalID) => {
    robotElement.querySelector('.robot_image').src = fallRobot;

    lost = true;
    clearInterval(intervalID);
    setTimeout(() => {
      document.querySelector('.bg-container').style.animationPlayState = 'paused';
      robotElement.style.filter = 'drop-shadow(1px 3px 2px rgba(0, 0, 0, .8))';
      runSound.pause();
      clearInterval(runInterval);
      fallSound.play();
    }, 100);

    setTimeout(() => {
      loseSound.play();
    }, 1000);

    setTimeout(() => {
      robotElement.classList.add('robot-explode');
      explosionSound.play();
      setTimeout(() => {
        explosionSound.pause();
      }, 3000);
    }, 4000);
  };

  let obstacle1;
  let obstacle2;
  let obstacle3;
  const isCollide = () => {
    // for (let i = 1; i <= 100 && lost === false; i += 1) {
    const intervalID = setInterval(() => {
      const robotPosition = robotElement.getBoundingClientRect();

      const obstacle1Ctx = obstacle1.getBoundingClientRect();
      const obstacle2Ctx = obstacle2.getBoundingClientRect();
      const obstacle3Ctx = obstacle3.getBoundingClientRect();

      const differenceRight1 = robotPosition.right - obstacle1Ctx.left;
      const differenceLeft1 = robotPosition.left - obstacle1Ctx.right;

      const differenceRight2 = robotPosition.right - obstacle2Ctx.left;
      const differenceLeft2 = robotPosition.left - obstacle2Ctx.right;

      const differenceRight3 = robotPosition.right - obstacle3Ctx.left;
      const differenceLeft3 = robotPosition.left - obstacle3Ctx.right;

      if (!lost) {
        score += 1;
        document.querySelector('.score').textContent = score;
      }

      // eslint-disable-next-line max-len
      if (nearlyDown) {
        if ((differenceRight1 > 35 && differenceLeft1 < -5)) {
          gameOver(intervalID, obstacle1);
          if (obstacle1.className.includes('garbage')) {
            obstacle1.classList.add('obstacle-fall');
          }
        }
        if (differenceRight2 > 35 && differenceLeft2 < -5) { // (differenceTop > -20)
          gameOver(intervalID, obstacle2);
          if (obstacle2.className.includes('garbage')) {
            obstacle2.classList.add('obstacle-fall');
          }
        }
        if (differenceRight3 > 35 && differenceLeft3 < -5) { // (differenceTop > -20)
          gameOver(intervalID, obstacle3);
          if (obstacle3.className.includes('garbage')) {
            obstacle3.classList.add('obstacle-fall');
          }
        }
      }
    }, 100);
  };

  let left = 0;

  let movesAfterFall = 0;
  const goRight = () => {
    if (lost && movesAfterFall === 5) { // player can keep the button 'right' pushed and
    // move up to 5 times after he fall but if he releases button then push it again,
    // it won't work even if movesAfterFall is smaller than 5.
      return;
    }
    if (lost) {
      movesAfterFall += 1;
    }
    const robot = document.querySelector('.robot');
    const screenWidth = window.innerWidth;

    // const leftPx = robot.style.left;    // works with left ≠ transform
    // const left = leftPx.split('px')[0];

    // const leftPx = robot.style.transform; // works with transformX;
    // eslint-disable-next-line prefer-destructuring
    // left = leftPx.split('px')[0];

    if (screenWidth - left > 490) {
      // const newLeft = `${parseInt(left, 10) + 30}px`;
      // robot.style.left = newLeft;
      left = `${parseInt(left, 10) + 30}`;
      robot.style.transform = `translateX(${left}px)`;
    }
  };

  const goLeft = () => {
    if (lost) {
      return;
    }

    const robot = document.querySelector('.robot');
    // const leftPx = robot.style.left;
    // const left = leftPx.split('px')[0];

    if (left >= 0) {
      // const newLeft = `${parseInt(left, 10) - 30}px`;
      // robot.style.left = newLeft;
      left = `${parseInt(left, 10) - 30}`;
      robot.style.transform = `translateX(${left}px)`;
    }
  };

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
    obstacle1 = document.querySelector('.obs1');
    obstacle2 = document.querySelector('.obs2');
    obstacle3 = document.querySelector('.obs3');
    runSound.play();

    runInterval = setInterval(() => {
      runSound.currentTime = 0;
    }, 13100);

    isCollide();
  }, []);

  return (
    <>
      <div className="robot rbt" style={{ left: '50px' }}> {/* style={{ left: `${left}px` }} */}
        <img src={runRobot} className="robot_image" alt="" />
      </div>
      <p className="score">0</p>
    </>
  );
};

export default Robot;
