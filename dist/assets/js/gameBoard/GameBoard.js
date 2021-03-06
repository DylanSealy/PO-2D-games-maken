export default class GameBoard {
    constructor(p, v) {
        this.draw = () => {
            this.frameRate = Math.round(this.p.frameRate());
            this.p.push();
            this.v.frightenedEnding == true ? this.p.stroke("red") : this.p.stroke("#7092BE");
            this.p.strokeWeight(3);
            this.p.rect(this.xInner, this.yInner, this.innerWidth, this.innerHeight, 4);
            this.p.rect(this.xOuter, this.yOuter, this.outerWidth, this.outerHeight, 10);
            this.p.stroke("black");
            this.p.strokeWeight(4);
            this.p.rect(this.xInner + this.widthUnit, this.yInner + this.innerHeight, this.widthUnit, 0);
            this.p.rect(this.xInner + this.widthUnit, this.yInner, this.widthUnit, 0);
            this.p.rect(this.xInner + this.widthUnit, this.yOuter + this.outerHeight, this.widthUnit, 0);
            this.p.rect(this.xInner + this.widthUnit, this.yOuter, this.widthUnit, 0);
            this.p.fill("white");
            this.p.text(`Score: ${this.score}`, this.xInner, this.canvasDimension - (this.canvasDimension - this.outerHeight) / 2.5);
            this.p.text(`Aantal levens: ${this.v.hoogMan.lives}`, this.xInner + this.widthUnit * 4, this.canvasDimension - (this.canvasDimension - this.outerHeight) / 2.5);
            if (this.v.blinky.mode == "frightened") {
                this.p.text(`Modus: ${this.v.blinky.mode}`, this.xInner + this.widthUnit * 9.5, this.canvasDimension - (this.canvasDimension - this.outerHeight) / 2.5);
            }
            this.p.pop();
        };
        this.p = p;
        const height = document.querySelector("main").offsetHeight;
        const width = document.querySelector("main").offsetWidth;
        this.canvasDimension = height > width ? this.canvasDimension = width - 1 : this.canvasDimension = height - 1;
        this.orientation = height > width ? "portrait" : "landscape";
        this.frameRate = Math.round(this.p.frameRate());
        this.xOuter = this.yOuter = this.canvasDimension / 60;
        this.xInner = this.yInner = this.xOuter * 2;
        this.innerHeight = this.canvasDimension - this.yInner * 4;
        this.innerWidth = this.canvasDimension - this.yInner * 2;
        this.outerHeight = this.canvasDimension - this.yOuter * 6;
        this.outerWidth = this.canvasDimension - this.xOuter * 2;
        this.heightUnit = this.innerHeight / 14;
        this.widthUnit = this.innerWidth / 17;
        this.score = 0;
        this.v = v;
    }
}
