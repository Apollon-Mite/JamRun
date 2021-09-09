/* eslint-disable consistent-return */
/* eslint-disable no-use-before-define */
/* eslint-disable no-undef */
import React, { useEffect } from 'react';
import './styles.scss';
import runRobot from 'src/assets/images/run_robot.gif';
import jumpRobot from 'src/assets/images/rbt_jump.gif';
import fallRobot from 'src/assets/images/robot_fall_px.gif';
import miniRobotStop from 'src/assets/images/mini-robot-good.png';
import glitter from 'src/assets/images/glitter.gif';
import explosionAudio from 'src/assets/audio/explosion.mp3';
import loseAudio from 'src/assets/audio/you_lose.mp3';
import finishHim from 'src/assets/audio/finish-him.mp3';
import fatality from 'src/assets/audio/fatality.mp3';
import runAudio from 'src/assets/audio/running.mp3';
import fallAudio from 'src/assets/audio/fall.mp3';
import jumpAudio from 'src/assets/audio/jump.mp3';

const Robot = () => {
  let jumping = false;
  let nearlyDown = true; // instead of checking vertical position at some intervals
  let playerHigh = false;
  let score = 0;
  let runInterval;
  let lost = false;
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
      if (lost) { // we stop keys from working after player lost
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
      // eslint-disable-next-line no-restricted-syntax
      for (key in timers) if (timers[key] !== null) clearInterval(timers[key]);
      timers = {};
    };
  };

  KeyboardController(
    {
      37() {
        goLeft();
      },
      38() {
        goJump();
      },
      39() {
        goRight();
      },
      32() {
        goJump();
      },
    },
    75,
  );
  // 200 originally, (works best with 50 or 100)

  const runSound = new Audio(runAudio);
  const jumpSound = new Audio(jumpAudio);

  const goJump = () => {
    const robot = document.querySelector('.rbt');
    if (jumping === true) {
      // console.log("can't jump");
    }
    else {
      robot.style.animationName = 'jump';
      robot.querySelector('.robot_image').src = jumpRobot;
      jumpSound.play();
      jumping = true;
      runSound.pause();

      setTimeout(() => {
        nearlyDown = false; // player jumped so nearlydown is false
      }, 100);
      setTimeout(() => {
        playerHigh = true;
      }, 200);
      setTimeout(() => {
        playerHigh = false;
      }, 850);
      setTimeout(() => {
        nearlyDown = true; // now player nearly reached the floor
        if (!lost) {
          runSound.play();
        }
      }, 700);
      setTimeout(() => {
        if (!lost) {
          robot.querySelector('.robot_image').src = runRobot;
        }
        robot.style.animationName = '';
        jumping = false;
      }, 750);
    }
  };

  const explosionSound = new Audio(explosionAudio);
  const loseSound = new Audio(loseAudio);
  const fallSound = new Audio(fallAudio);
  const finishHimSound = new Audio(finishHim);
  const fatalitySound = new Audio(fatality);

  let robotElement;

  const gameOver = (intervalID) => {
    robotElement.querySelector('.robot_image').src = fallRobot;

    lost = true;
    clearInterval(intervalID);
    setTimeout(() => {
      document.querySelector('.bg--1').style.animationPlayState = 'paused';
      document.querySelector('.bg--2').style.animationPlayState = 'paused';
      robotElement.style.filter = 'drop-shadow(1px 3px 2px rgba(0, 0, 0, .8))';
      runSound.pause();
      clearInterval(runInterval);
      fallSound.play();
    }, 100);

    setTimeout(() => {
      loseSound.play();
    }, 3000);

    setTimeout(() => {
      // finish him
      finishHimSound.play();
    }, 7000);

    setTimeout(() => {
      robotElement.classList.add('robot-explode');
      explosionSound.play();
      setTimeout(() => {
        explosionSound.pause();
      }, 3000);
    }, 9000);

    setTimeout(() => {
      // fatality
      fatalitySound.play();
    }, 12000);
  };

  const isCollide = () => {
    // for (let i = 1; i <= 100 && lost === false; i += 1) {
    const intervalID = setInterval(() => {
      const robotPosition = robotElement.getBoundingClientRect();

      const coins = document.querySelectorAll('.coin');
      coins.forEach((coin) => {
        const coinPosition = coin.getBoundingClientRect();
        const differenceLeft = coinPosition.left - robotPosition.right;
        const differenceBottom = robotPosition.top - coinPosition.bottom;
        // console.log("differenceBottom:",differenceBottom, "differenceLeft:", differenceLeft);
        if (differenceBottom < 10 && differenceLeft < 30 && differenceLeft > -30) {
          coin.style.backgroundImage = `url(${glitter})`;
        }
      });

      if (!lost) {
        score += 1;
        document.querySelector('.score').textContent = score;
      }

      const allObstacles = document.querySelectorAll('.obstacle');

      allObstacles.forEach((obstacle) => {
        // we get their positions
        const obstaclePosition = obstacle.getBoundingClientRect();
        const differenceRight = robotPosition.right - obstaclePosition.left;
        const differenceLeft = robotPosition.left - obstaclePosition.right;

        if (obstacle.className.includes('mini-rbt')) { // if it is a mini-robot
          if (differenceLeft > -500 && differenceLeft < 100) {
            obstacle.classList.remove('mini-rbt--stop');
            // if (obstacle.className.includes('mini-rbt--move-right')) {
            //   obstacle.classList.remove('mini-rbt--move-right');
            // }
            obstacle.classList.add('mini-rbt--move-left');
          }
          if (differenceRight > 50) {
            obstacle.classList.remove('mini-rbt--move-left');
            obstacle.classList.add('mini-rbt--move-right');

            if (!lost) {
              setTimeout(() => {
                obstacle.classList.remove('mini-rbt--move-right');
                obstacle.classList.add('mini-rbt--stop');
              }, 7000);
            }
          }
        }

        // we check if player collides with this obstacle
        if (nearlyDown && differenceRight > 35 && differenceLeft < -5) {
          gameOver(intervalID);
          lost = true;
          if (obstacle.className.includes('garbage')) { // if it is a garbage then it falls
            obstacle.classList.add('obstacle-fall');
          }
        }
      });
      if (lost) {
        allObstacles.forEach((obstacle) => {
          if (obstacle.className.includes('mini-rbt')) {
            setTimeout(() => {
              obstacle.style.animationPlayState = 'paused';
              obstacle.style.backgroundImage = `url(${miniRobotStop})`;
            }, 1000);
          }
        });
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
    runSound.volume = 0.2;
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
