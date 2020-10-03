let wDim0 = [0,0]; // Window dimension at starting time
let tiles = []; // Array of Tiles
let numTiles = 10; // Number of Tiles
let fps = 20; // Frames per Second
let tileSize = [60,60]; // Width and Height
let tileGap = 12;
let transitionSpeed = 0.7;
let focusEnlarge = tileGap*2;

function preload(){
  // put preload code here
}

function setup() {
  frameRate(fps);
  wDim0 = [windowWidth,windowHeight];
  createCanvas(wDim0[0],wDim0[1]);

  for (var x = (wDim0[0] % (tileSize[0]+tileSize[0]))/2 - tileGap/2; x+tileSize[0] < wDim0[0]; x += tileGap+tileSize[0]) {
    for (var y = (wDim0[1] % (tileSize[1]+tileSize[1]))/2 - tileGap/2; y+tileSize[1] < wDim0[1]; y += tileGap+tileSize[1]) {
      tiles.push(new Tile(x,y));
    }
  }
}

function draw() {
  // put drawing code here
  background(0, 130, 10);

  drawingContext.shadowOffsetX = 0;
  drawingContext.shadowOffsetY = 0;
  drawingContext.shadowBlur = 8;
  drawingContext.shadowColor = 'black';

  tiles.forEach((tile) => {
    tile.move();
    tile.display();
  });

}

function sign(number) {
  if (number == 0) return 0;
  return number/abs(number);
}

class Tile {
  constructor(x,y) {
    this.pos = [x,y];
    this.col = color(250);
    this.size = tileSize;
    this.startpos = [x+tileSize[0],y+tileSize[1]];
  }

  move() {
    if (mouseX > this.pos[0] && mouseX < (this.pos[0]+this.size[0]) &&
        mouseY > this.pos[1] && mouseY < (this.pos[1]+this.size[1])) {
        let addX = ((tileSize[0]+focusEnlarge+this.size[0])/2 - this.size[0])*transitionSpeed;
        let addY = ((tileSize[1]+focusEnlarge+this.size[1])/2 - this.size[1])*transitionSpeed;
        this.size = [this.size[0]+addX,this.size[1]+addY];
        this.pos[0] -= addX/2;
        this.pos[1] -= addY/2;
    }
    else if (this.size != tileSize) {
      let addX = (tileSize[0] - this.size[0])*transitionSpeed;
      let addY = (tileSize[1] - this.size[1])*transitionSpeed;
      this.size = [this.size[0]+addX,this.size[1]+addY];
      this.pos[0] -= addX/2;
      this.pos[1] -= addY/2;
    }
    let distance = ((this.pos[0]+this.size[0]/2-mouseX)^2+(this.pos[1]+this.size[1]/2-mouseY)^2)^0.5;
    let centered = [this.pos[0]+this.size[0]/2,this.pos[1]+this.size[1]/2];
    let addX = 0;
    let addY = 0;
    if (distance < 200) {
      addX -= sign(centered[0]-mouseX);
      addY -= sign(centered[1]-mouseY);
    }
    this.col = color(noise(centered[0],centered[1],frameCount/80)*100+155)
  }

  display() {
    fill(this.col);
    rect(this.pos[0], this.pos[1], this.size[0], this.size[1]);
  }
}
