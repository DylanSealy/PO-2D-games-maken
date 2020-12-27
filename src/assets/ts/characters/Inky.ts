import {Color, GameVariables, GhostInterface, Name} from "../Types";
import Ghost from "../assets/Ghost.js";
import p5 from "p5";

export default class Inky extends Ghost implements GhostInterface {
    color: Color;
    name: Name;
    pelletCounter: number;
    pelletThreshold: number;
    xPosition: number;
    yPosition: number;
    xStartPosition: number;
    yStartPosition: number;
    xTargetTile: number;
    yTargetTile: number;
    constructor(p: p5, v: GameVariables) {
        super(p, v);
        this.color = "blue";
        this.name = "Inky";
        this.pelletCounter = this.pelletThreshold = 25;
        this.xPosition = this.xStartPosition = this.v.gameBoard.xInner + this.v.gameBoard.widthUnit * 15.5;
        this.yPosition = this.yStartPosition = this.v.gameBoard.yInner + this.v.gameBoard.heightUnit * 0.5;
        this.xTargetTile = this.v.gameBoard.xOuter + this.v.gameBoard.outerWidth;
        this.yTargetTile = this.v.gameBoard.yOuter + this.v.gameBoard.outerHeight;
    }
    setMovement: () => void = () => {
        if (this.mode == "chase") {
            switch (this.v.hoogMan.movement) {
            case "up": this.movementSequence(this.checkDistanceTarget("Hoog-Man", -2, -2)); break;
            case "right": this.movementSequence(this.checkDistanceTarget("Hoog-Man", 2, 2)); break;
            case "down": this.movementSequence(this.checkDistanceTarget("Hoog-Man", 2, 2)); break;
            case "left": this.movementSequence(this.checkDistanceTarget("Hoog-Man", -2, -2)); break;
            default:
                switch (this.v.hoogMan.previousMovement) {
                case "up": this.movementSequence(this.checkDistanceTarget("Hoog-Man", -2, -2)); break;
                case "right": this.movementSequence(this.checkDistanceTarget("Hoog-Man", 2, 2)); break;
                case "down": this.movementSequence(this.checkDistanceTarget("Hoog-Man", 2, 2)); break;
                case "left": this.movementSequence(this.checkDistanceTarget("Hoog-Man", -2, -2)); break;
                default: this.movementSequence(this.checkDistanceTarget("Hoog-Man", 0, 0)); break;
                } break;
            }
        }
        else if (this.mode == "scatter") {this.movementSequence(this.checkDistanceTarget("Target tile", 0, 0));}
        else {this.frightenedMovement();}
    }
}