let wDim0 = [0,0]; // Window dimension at starting time
let tiles = []; // Array of Tiles
let numTiles = 10; // Number of Tiles
let fps = 12; // Frames per Second
let tileSize = [60,82]; // Width and Height
let tileGap = 16;
let transitionSpeed = 0.9;
let focusEnlarge = 24;
let backEl = [];
let nbackEl = 20;

function preload(){
  // put preload code here
}

function setup() {
  frameRate(fps);
  wDim0 = [windowWidth,windowHeight];
  createCanvas(wDim0[0],wDim0[1]);

  for (var xrel = (tileGap+tileSize[0])/2; xrel < (wDim0[0]*0.5)-tileSize[0]; xrel += tileGap+tileSize[0]) {
    for (var yrel = (tileGap+tileSize[1])/2; yrel < (wDim0[1]*0.5)-tileSize[1]*0.6; yrel += tileGap+tileSize[1]) {
      tiles.push(new Tile(wDim0[0]/2+xrel,wDim0[1]/2+yrel,random(0,1)<0.5));
      tiles.push(new Tile(wDim0[0]/2-xrel,wDim0[1]/2-yrel,random(0,1)<0.5));
      tiles.push(new Tile(wDim0[0]/2-xrel,wDim0[1]/2+yrel,random(0,1)<0.5));
      tiles.push(new Tile(wDim0[0]/2+xrel,wDim0[1]/2-yrel,random(0,1)<0.5));
    }
  }
}

function windowResized() {
  wDim0 = [windowWidth,windowHeight];
  resizeCanvas(wDim0[0],wDim0[1]);
}

function mouseClicked() {
  tiles.forEach((tile) => {
    if (tile.mouseHover())
      tile.speedpf = [0,0];
  });
}

function draw() {
  // put drawing code here
  background(0, 80, 5);

  //drawingContext.shadowOffsetX = 0;
  //drawingContext.shadowOffsetY = 0;
  //drawingContext.shadowBlur = 8;
  //drawingContext.shadowColor = 'black';
  //shuffle(tiles);
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
  constructor(x,y,cardcol = true) {
    this.pos = [x,y];
    this.startpos = [x,y];
    this.col = color(250);
    this.size = tileSize;
    this.noisenow = 0;
    //this.vert = this.noiseToPos(0);
    this.cardcolor = cardcol;
    this.speedpf = [random(-5,5),random(-5,5)]; // speed per frame
  }

  mouseHover() {
    if (mouseX > (this.pos[0]-this.size[0]/2) && mouseX < (this.pos[0]+this.size[0]/2) &&
        mouseY > (this.pos[1]-this.size[1]/2) && mouseY < (this.pos[1]+this.size[1]/2))
        return true;
    return false;
  }

  noiseToPos(startingNoise,normalized = true) {
    let perimeter = 1;
    if (normalized)
      perimeter = (this.size[0]+this.size[1]) * 2;
    let noiseScaled = ((startingNoise) * perimeter) % ((this.size[0]+this.size[1]) * 2);
    let result = [0,0];
    if (noiseScaled < this.size[0])
      result = [noiseScaled,0];
    else if (noiseScaled < (this.size[0]+this.size[1]))
      result = [this.size[0],noiseScaled-this.size[0]];
    else if (noiseScaled < (2*this.size[0]+this.size[1]))
      result = [this.size[0]-(noiseScaled-this.size[0]-this.size[1]),this.size[1]];
    else
      result = [0,this.size[1]-(noiseScaled-this.size[0]*2-this.size[1])];
    return [result[0]+this.pos[0]-this.size[0]/2,result[1]+this.pos[1]-this.size[1]/2]
  }

  move() {
    this.pos[0] = this.pos[0] + this.speedpf[0];
    this.pos[1] = this.pos[1] + this.speedpf[1];
    this.noisenow = noise(this.pos[0],this.pos[1],frameCount/40);
    if (this.cardcolor)
      this.col = color(this.noisenow*255+100,60,60);
    else
      this.col = color(60,60,this.noisenow*255+100);
    if (this.mouseHover()) {
        this.speedpf[0] *= 1.5;
        this.speedpf[1] *= 1.5;
        let addX = ((tileSize[0]+focusEnlarge+this.size[0])/2 - this.size[0])*transitionSpeed;
        let addY = ((tileSize[1]+focusEnlarge+this.size[1])/2 - this.size[1])*transitionSpeed;
        this.size = [this.size[0]+addX,this.size[1]+addY];
        this.col = color(this.noisenow*100+155,this.noisenow*100+155,50);
    }
    else if (this.size != tileSize) {
      let addX = (tileSize[0] - this.size[0])*transitionSpeed;
      let addY = (tileSize[1] - this.size[1])*transitionSpeed;
      this.size = [this.size[0]+addX,this.size[1]+addY];
    }

    if ((this.pos[0]-this.size[0]/2) < 0 || (this.pos[0]+this.size[0]/2) > wDim0[0]) {
      this.speedpf[0] = -this.speedpf[0];
    }
    if ((this.pos[1]-this.size[1]/2) < 0 || (this.pos[1]+this.size[1]/2) > wDim0[1]) {
      this.speedpf[1] = -this.speedpf[1];
    }
  }

  display() {
    pop();
    fill(this.col);
    stroke(60,60,60,200);
    strokeWeight(1);
    rect(this.pos[0]-this.size[0]/2, this.pos[1]-this.size[1]/2, this.size[0], this.size[1]);
    /*
    let vert1 = this.noiseToPos(frameCount,false);
    let vert2 = this.noiseToPos(this.noisenow*2);
    for (let delta = 0; delta < (this.size[0]+this.size[1])*2; delta+=10) {
      vert1 = this.noiseToPos(frameCount+delta,false);
      let noisehere = noise(vert1[0],vert1[1],frameCount/100);
      if (this.cardcolor)
        stroke(50+(noisehere*1024)%206,noisehere*100,noisehere*100);
      else
        stroke(noisehere*100,noisehere*100,50+(noisehere*1024)%206);
      line(vert1[0],vert1[1],vert2[0],vert2[1]);
    }
    */
    push();
  }
}
