/* eslint-disable eqeqeq */
/* eslint-disable consistent-return */
/* eslint-disable no-use-before-define */
/* eslint-disable no-undef */
import React, { useEffect } from 'react';
import './styles.scss';

import faceRightRobot from 'src/assets/images/rbt_staying-right.gif';
import faceLeftRobot from 'src/assets/images/rbt_staying-left.gif';
import runRobotRight from 'src/assets/images/run_robot_right.gif';
import runRobotLeft from 'src/assets/images/run_robot_left.gif';
import jumpRobotRight from 'src/assets/images/rbt-new-jump-right.gif';
import jumpRobotLeft from 'src/assets/images/rbt-new-jump-left.gif';

import shootStayLeft from 'src/assets/images/rbt_stay_shoot-left.gif';
import shootStayRight from 'src/assets/images/rbt_stay_shoot-right.gif';

import crouchRight from 'src/assets/images/rbt_sit_right.gif';
import crouchLeft from 'src/assets/images/rbt_sit_left.gif';

import fallRobotRight from 'src/assets/images/robot_fall_right.gif';
import fallRobotLeft from 'src/assets/images/robot_fall_left.gif';
import miniRobotStop from 'src/assets/images/mini-robot-good.png';
import glitter from 'src/assets/images/glitter.gif';
import coinGif from 'src/assets/images/coin.gif';
import cityAudio from 'src/assets/audio/city-night-crowd.mp3';
import coinCollectAudio from 'src/assets/audio/collect_coin.mp3';
import explosionAudio from 'src/assets/audio/explosion.mp3';
import loseAudio from 'src/assets/audio/you_lose.mp3';
import finishHim from 'src/assets/audio/finish-him.mp3';
import fatality from 'src/assets/audio/fatality.mp3';
import runAudio from 'src/assets/audio/running.mp3';
import fallAudio from 'src/assets/audio/fall_sound.mp3';
import jumpAudio from 'src/assets/audio/jump.mp3';

const Robot = () => {
  let jumping = false;
  let nearlyDown = true; // instead of checking vertical position at some intervals
  // we are going to let game know when character nearly reached the floor, in which
  // case : nearlyDown will be true.
  let score = 0;
  let runInterval;
  let lost = false;
  let rightDirection = true;
  let rightSteps = 0;
  let leftSteps = 0;
  const runSound = new Audio(runAudio);

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
      // if (!(timers[39]) && !(timers[37])) {
      //   robotElement.querySelector('.robot_image').src = faceRightRobot;
      //   return true;
      // }
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
      if (key == 39) { // if released button is right
        rightSteps = 0;
        if (leftSteps < 1 && !lost) {
          robotElement.querySelector('.robot_image').src = faceRightRobot;
        }
        if (runningRightInterval !== null) {
          clearInterval(runningRightInterval);
          runningRightInterval = null;
        }
      }
      if (key == 37) { // if relased button is left
        leftSteps = 0;
        if (rightSteps < 1 && !lost) {
          robotElement.querySelector('.robot_image').src = faceLeftRobot;
        }
        if (runningLeftInterval !== null) {
          clearInterval(runningLeftInterval);
          runningLeftInterval = null;
        }
      }
      if (key == 40) { // if he stands up after crouching
        if (rightDirection) {
          robotElement.querySelector('.robot_image').src = faceRightRobot;
        }
        else {
          robotElement.querySelector('.robot_image').src = faceLeftRobot;
        }
        crouching = false;
      }

      if (!(timers[39]) || !(timers[37])) { // if no movement key is pressed, we stop run sound
        runSound.pause();
        runSound.currentTime = 0;
        runSoundOn = false;
      }
    };

    // When window is unfocused we may not get key events. To prevent this
    // causing a key to 'get stuck down', cancel all held keys
    //
    window.onblur = function () {
      // eslint-disable-next-line no-restricted-syntax
      for (key in timers) if (timers[key] !== null) clearInterval(timers[key]);
      timers = {};

      rightSteps = 0;
      leftSteps = 0;
      runSound.pause();
      runSound.currentTime = 0;
      runSoundOn = false;
    };
  };

  KeyboardController(
    {
      37() { // left
        goLeft();
      },
      38() { // up
        goJump();
      },
      39() { // right
        goRight();
      },
      40() { // down
        crouch();
      },
      32() { // space bar
        shootGun();
      },
    },
    75,
  );
  // 200 originally, (works best with 50 or 100)

  let crouching = false;
  const crouch = () => {
    if (crouching) {
      return;
    }
    if (rightDirection) {
      robotElement.querySelector('.robot_image').src = crouchRight;
      crouching = true;
    }
    else {
      robotElement.querySelector('.robot_image').src = crouchLeft;
      crouching = true;
    }
  };

  let shooting = false;
  const shootGun = () => {
    if (shooting) {
      return;
    }
    if (rightDirection) {
      shooting = true;
      robotElement.querySelector('.robot_image').src = shootStayRight;
      setTimeout(() => {
        shooting = false;
      }, 400);
    }
    else {
      shooting = true;
      robotElement.querySelector('.robot_image').src = shootStayLeft;
      setTimeout(() => {
        shooting = false;
      }, 400);
    }
  };

  const jumpSound = new Audio(jumpAudio);

  const goJump = () => {
    const robot = document.querySelector('.rbt');
    if (jumping === true) {
      // console.log("can't jump");
    }
    else {
      if (rightDirection) {
        robot.querySelector('.robot_image').src = jumpRobotRight;
      }
      else {
        robot.querySelector('.robot_image').src = jumpRobotLeft;
      }

      jumpSound.play();
      robot.style.animationName = 'jump';
      jumping = true;
      runSound.pause();

      setTimeout(() => {
        nearlyDown = false; // player jumped so nearlydown is false
      }, 100);
      setTimeout(() => {
        nearlyDown = true; // now player nearly reached the floor
        if (!lost) {
          // runSound.play();
        }
      }, 700);
      setTimeout(() => {
        if (!lost) {
          if (rightDirection) {
            if (rightSteps > 0) {
              robot.querySelector('.robot_image').src = runRobotRight;
            }
            else {
              robot.querySelector('.robot_image').src = faceRightRobot;
            }
          }
          if (!rightDirection) {
            if (leftSteps > 0) {
              robot.querySelector('.robot_image').src = runRobotLeft;
            }
            else {
              robot.querySelector('.robot_image').src = faceLeftRobot;
            }
          }
        }
        robot.style.animationName = '';
        jumping = false;
      }, 740);
    }
  };

  const explosionSound = new Audio(explosionAudio);
  const loseSound = new Audio(loseAudio);
  const fallSound = new Audio(fallAudio);
  const finishHimSound = new Audio(finishHim);
  const fatalitySound = new Audio(fatality);

  let robotElement;

  const gameOver = (intervalID) => {
    if (rightDirection) {
      robotElement.querySelector('.robot_image').src = fallRobotRight;
    }
    else {
      robotElement.querySelector('.robot_image').src = fallRobotLeft;
    }

    lost = true;
    clearInterval(intervalID);
    setTimeout(() => {
      document.querySelector('.bg--1').style.animationPlayState = 'paused';
      // document.querySelector('.bg--2').style.animationPlayState = 'paused';
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

  const coinCollectSound = new Audio(coinCollectAudio);
  const cityCrowdSound = new Audio(cityAudio);

  const isCollide = () => {
    // for (let i = 1; i <= 100 && lost === false; i += 1) {
    const intervalID = setInterval(() => {
      const robotPosition = robotElement.getBoundingClientRect();

      const coins = document.querySelectorAll('.coin');
      coins.forEach((coin) => {
        const coinPosition = coin.getBoundingClientRect();
        const differenceLeft = coinPosition.left - robotPosition.right;
        const differenceBottom = robotPosition.top - coinPosition.bottom;
        // console.log("Bottom:",differenceBottom, "Left:", differenceLeft, "jump:", jumping);
        const collected = !!coin.className.includes('collected');

        if (!collected && differenceBottom < 30 && differenceLeft < 30 && differenceLeft > -55) {
          coin.style.backgroundImage = `url(${glitter})`;
          coin.classList.add('collected');
          
          coinCollectSound.currentTime = 0;
          coinCollectSound.play();
          setTimeout(() => {
            coin.classList.add('opacity');
          }, 500);

          score += 50;
          document.querySelector('.score').textContent = score;
          setTimeout(() => {
            if (!lost) { // we recreate the coin
              coin.style.backgroundImage = `url(${coinGif})`;
              coin.classList.remove('collected');
              coin.classList.remove('opacity');
            }
          }, 10000);
        }
      });

      // if (!lost) {
        // score += 1;
        // document.querySelector('.score').textContent = score;
      // }

      const nightCities = document.querySelectorAll('.crowd');
      nightCities.forEach((city) => {
        const cityPosition = city.getBoundingClientRect();
        const differenceLeft = cityPosition.left - robotPosition.right;
        // let differenceRight
        const citySound = !!city.className.includes('city-sound');

        if (!citySound && differenceLeft < 400) {
          cityCrowdSound.currentTime = 0;
          cityCrowdSound.volume = 0.2;
          cityCrowdSound.play();
          city.classList.add('city-sound');
        }
        const citySoundStrong = !!city.className.includes('city-sound--strong');
        if (!citySoundStrong && differenceLeft < 100) {
          cityCrowdSound.volume = 1;
          city.classList.add('city-sound--strong');
          setTimeout(() => {
            cityCrowdSound.volume = 0.5;
          }, 5000);
          setTimeout(() => {
            cityCrowdSound.volume = 0.2;
          }, 7000);
          setTimeout(() => {
            cityCrowdSound.pause();
          }, 10000);
        }
      });

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

            setTimeout(() => {
              if (!lost) {
                obstacle.classList.remove('mini-rbt--move-right');
                obstacle.classList.add('mini-rbt--stop');
              }
            }, 7000);
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
    }, 60); // à 100 normalement
  };

  let left = 0;

  let movesAfterFall = 0;
  let runningRightInterval = null;
  let runSoundOn = false;

  const goRight = () => {
    // eslint-disable-next-line max-len
    if ((lost && movesAfterFall === 5) || leftSteps > 0) { // player can keep the button 'right' pushed and
    // move up to 5 times after he fall but if he releases button then push it again,
    // it won't work even if movesAfterFall is smaller than 5.
      return;
    }
    if (lost) {
      movesAfterFall += 1;
    }
    // const background = document.querySelector('.bg--1');
    // const bgLeftValue = background.style.left.split('px')[0];
    // background.style.left = `${bgLeftValue - 30}px`;

    const robot = document.querySelector('.robot');
    rightDirection = true;

    rightSteps += 1;

    if (rightSteps == 1) {
      robot.querySelector('.robot_image').src = runRobotRight;
    }

    if (rightSteps > 1 && !lost && robot.querySelector('.robot_image').getAttribute('src') != runRobotRight) {
      robot.querySelector('.robot_image').src = runRobotRight;
    }

    if (!runSoundOn && !jumping) {
      runSound.play();
      runSoundOn = true;
      runningRightInterval = setInterval(() => {
        runSound.currentTime = 0;
      }, 13100);
    }

    const screenWidth = window.innerWidth;

    if (screenWidth - left > 1000) { // 490 originally
    left = `${parseInt(left, 10) + 30}`;
    robot.style.transform = `translateX(${left}px)`;
    }

    if (screenWidth - left < 1000) { // 490 originally
      const background = document.querySelector('.bg--1');
      const bgLeftValue = background.style.left.split('px')[0];
      background.style.left = `${bgLeftValue - 30}px`;
    }
    
  };

  let runningLeftInterval = null;

  const goLeft = () => {
    if (lost || rightSteps > 0) {
      return;
    }
    leftSteps += 1;
    rightDirection = false;
    const robot = document.querySelector('.robot');
    // if (leftSteps < 2) {
    //   robot.querySelector('.robot_image').src = faceLeftRobot;
    // }
    if (leftSteps == 1) {
      robot.querySelector('.robot_image').src = runRobotLeft;
    }
    if (leftSteps > 1 && !lost && robot.querySelector('.robot_image').getAttribute('src') != runRobotLeft) {
      robot.querySelector('.robot_image').src = runRobotLeft;
    }
    if (!runSoundOn && !jumping) {
      runSound.play();
      runSoundOn = true;
      runningLeftInterval = setInterval(() => {
        runSound.currentTime = 0;
      }, 13100);
    }
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

    isCollide();
  }, []);

  return (
    <>
      <div className="robot rbt" style={{ left: '50px' }}> {/* style={{ left: `${left}px` }} */}
        <img src={faceRightRobot} className="robot_image" alt="" />
      </div>
      <p className="score">0</p>
    </>
  );
};

export default Robot;
