import Blinky from "./characters/Blinky.js";
import Clyde from "./characters/Clyde.js";
import HoogMan from "./characters/HoogMan.js";
import Inky from "./characters/Inky.js";
import Pinky from "./characters/Pinky.js";
import GameBoard from "./gameBoard/GameBoard.js";
import Obstacle from "./gameBoard/Obstacle.js";
import Pellet from "./gameBoard/Pellet.js";
const sketch = (p) => {
    const characterSequence = (character) => {
        if (character.name != "Hoog-Man") {
            character.iterationVariables();
        }
        character.draw();
        if (character.name == "Hoog-Man" || character.mode != null) {
            character.checkCollision();
            character.checkNextMovement();
        }
        if (character.name != "Hoog-Man" && character.mode != null) {
            character.setMovement();
        }
    };
    p.setup = () => {
        initializeVars(p);
        getInputMethod();
        p.createCanvas(v.gameBoard.canvasDimension, v.gameBoard.canvasDimension);
        p.imageMode(p.CENTER);
        p.noCursor();
        p.textAlign(p.LEFT, p.CENTER);
        p.textFont("Roboto");
        p.textSize(v.gameBoard.widthUnit / 1.5);
        fadeIn(v.backgroundMusic, 0.55);
        p.noFill();
        if (v.inputMethod == "touch") {
            touchControls();
        }
        else if (v.inputMethod == "gestures") {
            gestureControls();
        }
    };
    p.draw = () => {
        p.background("black");
        v.gameBoard.draw();
        v.obstacles.forEach((obstacle, index) => obstacle.draw(index));
        v.pellets.forEach((pellet, index) => {
            pellet.draw();
            pellet.checkEaten(index);
        });
        characterSequence(v.hoogMan);
        characterSequence(v.blinky);
        characterSequence(v.pinky);
        characterSequence(v.inky);
        characterSequence(v.clyde);
    };
};
const v = {
    backgroundMusic: new Audio("assets/audio/background.webm"),
    deathSound: new Audio("assets/audio/death.webm"),
    frightenedSound: new Audio("assets/audio/frightened.webm"),
    gameCompletedSound: new Audio("assets/audio/gameCompleted.webm"),
    gameOverSound: new Audio("assets/audio/gameOver.webm"),
    pelletSound: new Audio("assets/audio/pellet.webm"),
    frightenedEnding: false,
    frightenedTime: 0,
    frightenedCounter: 0,
    pelletCounter: 0,
    endGame: (p) => {
        p.noLoop();
        v.hoogMan.lives--;
        responsiveGame(false, false);
        if (v.hoogMan.lives == 0 || v.pellets.length == 0) {
            let container, index, paragraph;
            if (v.hoogMan.lives == 0) {
                v.gameOverSound.play();
                index = 0;
                container = document.querySelector("#gameEndContainer");
                paragraph = document.querySelector("#gameEndContainer p");
            }
            else {
                v.gameCompletedSound.play();
                index = 1;
                container = document.querySelector("#gameFinishedContainer");
                paragraph = document.querySelector("#gameFinishedContainer p");
            }
            container.style.display = "flex";
            paragraph.innerText += ` ${v.gameBoard.score}`;
            document.querySelectorAll(".again")[index].addEventListener("click", () => {
                container.style.display = "none";
                responsiveGame(true, true);
            });
            document.querySelectorAll(".stop")[index].addEventListener("click", () => window.location.href = "https://github.com/DylanSealy/Hoog-Man/");
        }
        else {
            v.pelletCounter = 0;
            v.deathSound.play();
            setTimeout(() => {
                v.blinky.resetCharacter();
                v.clyde.resetCharacter();
                v.hoogMan.resetCharacter();
                v.inky.resetCharacter();
                v.pinky.resetCharacter();
                fadeIn(v.backgroundMusic, 0.55);
                p.loop();
            }, 650);
        }
    }
};
const initializeVars = (p) => {
    v.backgroundMusic.loop = v.frightenedSound.loop = true;
    v.backgroundMusic.volume = v.deathSound.volume = v.gameOverSound.volume = v.pelletSound.volume = 0.55;
    v.gameCompletedSound.volume = 0.60;
    v.frightenedImage = p.loadImage("assets/images/frightened.png");
    v.gameBoard = new GameBoard(p, v);
    v.blinky = new Blinky(p, v);
    v.clyde = new Clyde(p, v);
    v.hoogMan = new HoogMan(p, v);
    v.inky = new Inky(p, v);
    v.pinky = new Pinky(p, v);
    v.gesturePosition = [null, null, null, null];
    (() => {
        v.obstacleCoordinates = [
            [1, 1, 3, 4], [4, 0, 5, 4], [6, 1, 8, 4], [9, 0, 10, 3], [11, 1, 13, 3], [14, 0, 17, 2], [0, 5, 1, 8], [2, 5, 4, 8],
            [5, 5, 7, 6], [8, 5, 9, 6], [9, 4, 10, 7], [11, 5, 12, 6], [11, 4, 16, 5], [14, 3, 16, 4], [5, 7, 6, 8], [7, 7, 8, 10],
            [9, 8, 10, 10], [10, 9, 11, 11], [11, 7, 14, 8], [13, 6, 14, 7], [15, 6, 16, 8], [1, 9, 3, 13], [4, 9, 6, 12], [7, 11, 9, 12],
            [8, 12, 9, 13], [12, 9, 13, 12], [14, 9, 17, 10], [4, 13, 7, 14], [10, 12, 11, 14], [11, 13, 14, 14], [14, 11, 16, 12], [15, 12, 16, 13]
        ];
        v.obstacles = [];
        v.obstacleCoordinates.forEach(coordinates => {
            const obstacle = new Obstacle(p, v, coordinates[0], coordinates[1], coordinates[2], coordinates[3]);
            v.obstacles.push(obstacle);
        });
    })();
    (() => {
        v.pellets = [];
        for (let xPosition = 0; xPosition < 17; xPosition++) {
            for (let yPosition = 0; yPosition < 14; yPosition++) {
                let pellet;
                if (xPosition == 16 && yPosition == 13 ||
                    xPosition == 13 && yPosition == 0 ||
                    xPosition == 4 && yPosition == 6) {
                    pellet = new Pellet(p, v, xPosition, yPosition, true);
                }
                else {
                    pellet = new Pellet(p, v, xPosition, yPosition, false);
                }
                if (!pellet.checkCollisionObstacle()) {
                    v.pellets.push(pellet);
                }
            }
        }
    })();
};
const touchControls = () => {
    const upTouch = document.querySelector("#upTouch");
    upTouch.addEventListener("click", () => v.hoogMan.nextMovement = "up");
    upTouch.addEventListener("touchstart", () => v.hoogMan.nextMovement = "up");
    const rightTouch = document.querySelector("#rightTouch");
    rightTouch.addEventListener("click", () => v.hoogMan.nextMovement = "right");
    rightTouch.addEventListener("touchstart", () => v.hoogMan.nextMovement = "right");
    const downTouch = document.querySelector("#downTouch");
    downTouch.addEventListener("click", () => v.hoogMan.nextMovement = "down");
    downTouch.addEventListener("touchstart", () => v.hoogMan.nextMovement = "down");
    const leftTouch = document.querySelector("#leftTouch");
    leftTouch.addEventListener("click", () => v.hoogMan.nextMovement = "left");
    leftTouch.addEventListener("touchstart", () => v.hoogMan.nextMovement = "left");
};
const gestureControls = () => {
    const checkGesture = () => {
        if (v.gesturePosition[0] != null && v.gesturePosition[1] != null) {
            if (v.gesturePosition[3] < v.gesturePosition[1] - v.gameBoard.heightUnit) {
                v.hoogMan.nextMovement = "up";
            }
            else if (v.gesturePosition[2] > v.gesturePosition[0] + v.gameBoard.heightUnit) {
                v.hoogMan.nextMovement = "right";
            }
            else if (v.gesturePosition[3] > v.gesturePosition[1] + v.gameBoard.heightUnit) {
                v.hoogMan.nextMovement = "down";
            }
            else if (v.gesturePosition[2] < v.gesturePosition[0] - v.gameBoard.heightUnit) {
                v.hoogMan.nextMovement = "left";
            }
        }
    };
    const resetGesture = () => { v.gesturePosition = [null, null, null, null]; };
    const main = document.querySelector("main");
    main.addEventListener("touchstart", (event) => {
        if (v.hoogMan.lives != 0 && v.pellets.length != 0) {
            event.preventDefault();
        }
        v.gesturePosition[0] = event.touches[0].clientX;
        v.gesturePosition[1] = event.touches[0].clientY;
    });
    main.addEventListener("mousedown", (event) => {
        v.gesturePosition[0] = event.clientX;
        v.gesturePosition[1] = event.clientY;
    });
    main.addEventListener("touchmove", (event) => {
        v.gesturePosition[2] = event.touches[0].clientX;
        v.gesturePosition[3] = event.touches[0].clientY;
        checkGesture();
    });
    main.addEventListener("mousemove", (event) => {
        v.gesturePosition[2] = event.clientX;
        v.gesturePosition[3] = event.clientY;
        checkGesture();
    });
    main.addEventListener("touchend", () => resetGesture());
    main.addEventListener("mouseup", () => resetGesture());
    main.addEventListener("touchcancel", () => resetGesture());
};
document.querySelector("#social").addEventListener("click", () => window.location.href = "https://github.com/DylanSealy/Hoog-Man/");
document.querySelector("#startGame").addEventListener("click", () => startGame());
window.addEventListener("resize", () => { if (v.game && v.hoogMan.lives != 0) {
    responsiveGame(true, true);
} });
const startGame = () => {
    (() => {
        const main = document.querySelector("main");
        main.requestFullscreen();
        main.style.height = "100%";
        main.style.width = "100%";
        main.style.position = "absolute";
        main.style.top = "0";
        main.style.left = "0";
        main.style.backgroundColor = "black";
    })();
    v.game = new p5(sketch);
    const gameStartupContainer = document.querySelector("#gameStartupContainer");
    gameStartupContainer.style.display = "none";
};
const getInputMethod = () => {
    const inputMethod = document.getElementsByName("controls");
    if (inputMethod[0].checked || v.inputMethod == "keyboard") {
        v.inputMethod = "keyboard";
    }
    else if (inputMethod[1].checked || v.inputMethod == "touch") {
        v.inputMethod = "touch";
        (() => {
            const touchControlsContainer = document.getElementById("touchControlsContainer");
            touchControlsContainer.style.display = "flex";
            const touchControls = document.getElementsByClassName("touchControls");
            if (v.gameBoard.orientation == "landscape") {
                const touchElementWidth = (document.querySelector("html").offsetWidth - v.gameBoard.canvasDimension) / 2;
                touchControlsContainer.style.width = `${touchElementWidth}px`;
                touchControlsContainer.style.height = "100%";
                touchControlsContainer.classList.remove("containerPortrait");
                touchControlsContainer.classList.add("containerLandscape");
                for (let i = 0; i < touchControls.length; i++) {
                    touchControls[i].classList.remove("touchPortrait");
                    touchControls[i].classList.add("touchLandscape");
                }
            }
            else {
                const touchElementHeight = (document.querySelector("html").offsetHeight - v.gameBoard.canvasDimension) / 2;
                touchControlsContainer.style.height = `${touchElementHeight}px`;
                touchControlsContainer.style.width = "100%";
                touchControlsContainer.classList.remove("containerLandscape");
                touchControlsContainer.classList.add("containerPortrait");
                for (let i = 0; i < touchControls.length; i++) {
                    touchControls[i].classList.remove("touchLandscape");
                    touchControls[i].classList.add("touchPortrait");
                }
            }
        })();
    }
    else {
        v.inputMethod = "gestures";
    }
};
const responsiveGame = (resetAudio, newGame) => {
    v.backgroundMusic.pause();
    v.deathSound.pause();
    v.frightenedSound.pause();
    v.gameCompletedSound.pause();
    v.gameOverSound.pause();
    v.pelletSound.pause();
    if (resetAudio) {
        v.backgroundMusic.currentTime = v.deathSound.currentTime = v.frightenedSound.currentTime = 0;
        v.gameCompletedSound.currentTime = v.gameOverSound.currentTime = v.pelletSound.currentTime = 0;
    }
    if (newGame) {
        v.game.remove();
        v.game = new p5(sketch);
    }
};
const fadeIn = (audio, threshold) => {
    audio.volume = 0.00;
    audio.play();
    const fade = setInterval(() => {
        audio.volume += 0.03;
        if (audio.volume >= threshold) {
            clearInterval(fade);
            audio.volume = threshold;
        }
    }, 110);
};
(() => {
    const year = new Date().getFullYear();
    document.querySelector("footer").innerText = `© ${year} Hoog-Man (1.0.2)`;
})();
(() => {
    const inputMethod = document.getElementsByName("controls");
    if (navigator.userAgentData != undefined && navigator.userAgentData.mobile == true) {
        inputMethod[2].checked = true;
    }
    else if (navigator.userAgent.indexOf("Mobile") != -1) {
        inputMethod[2].checked = true;
    }
})();
window.addEventListener("keydown", event => {
    if (event.code == "Enter" && v.game == undefined) {
        startGame();
    }
    else if (v.inputMethod != undefined && v.inputMethod == "keyboard") {
        if (event.code == "ArrowUp" || event.code == "KeyW") {
            v.hoogMan.nextMovement = "up";
        }
        else if (event.code == "ArrowRight" || event.code == "KeyD") {
            v.hoogMan.nextMovement = "right";
        }
        else if (event.code == "ArrowDown" || event.code == "KeyS") {
            v.hoogMan.nextMovement = "down";
        }
        else if (event.code == "ArrowLeft" || event.code == "KeyA") {
            v.hoogMan.nextMovement = "left";
        }
    }
});
