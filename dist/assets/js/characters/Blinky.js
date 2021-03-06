import Ghost from "../assets/Ghost.js";
export default class Blinky extends Ghost {
    constructor(p, v) {
        super(p, v);
        this.setMovement = () => {
            if (this.mode == "chase") {
                this.movementSequence(this.checkDistanceTarget("Hoog-Man", 0, 0));
            }
            else if (this.mode == "scatter") {
                this.movementSequence(this.checkDistanceTarget("Target tile", 0, 0));
            }
            else {
                this.frightenedMovement();
            }
        };
        this.color = "red";
        this.image = this.p.loadImage("assets/images/blinky.png");
        this.mode = "scatter";
        this.movement = "left";
        this.name = "Blinky";
        this.pelletCounter = this.pelletThreshold = 0;
        this.xPosition = this.xStartPosition = this.v.gameBoard.xInner + this.v.gameBoard.widthUnit * 13.5;
        this.yPosition = this.yStartPosition = this.v.gameBoard.yInner + this.v.gameBoard.heightUnit * 0.5;
        this.xTargetTile = this.v.gameBoard.xOuter;
        this.yTargetTile = this.v.gameBoard.yOuter + v.gameBoard.outerHeight;
    }
}
