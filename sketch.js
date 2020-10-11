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
let suits = ["♥","♦","♣","♠"];
let values = ["A","2","3","4","5","6","7","8","9","10","J","Q","K"];
let textTime = 7;
let elastCoeff = 8;
let maxspeed = 60;
let soundtrack;

function preload(){
  // put preload code here
}

function setup() {
  frameRate(fps);
  wDim0 = [windowWidth,windowHeight];
  tileSize = [(windowWidth+windowHeight)/20,1.4*(windowWidth+windowHeight)/20];
  createCanvas(wDim0[0],wDim0[1]);
  soundtrack = loadSound('Catch Up - Dan Lebowitz.mp3');

  suits.forEach((suit) => {
    values.forEach((value) => {
      let cardcolred = false;
      if (suit == "♥" || suit == "♦")
        cardcolred = true;
      tiles.push(new Tile(random(wDim0[0]),random(wDim0[1]),random(0,1)<0.5,suit,value));
    });
  });
  /*
  for (var xrel = (tileGap+tileSize[0])/2; xrel < (wDim0[0]*0.5)-tileSize[0]; xrel += tileGap+tileSize[0]) {
    for (var yrel = (tileGap+tileSize[1])/2; yrel < (wDim0[1]*0.5)-tileSize[1]*0.6; yrel += tileGap+tileSize[1]) {
      tiles.push(new Tile(wDim0[0]/2+xrel,wDim0[1]/2+yrel,random(0,1)<0.5));
      tiles.push(new Tile(wDim0[0]/2-xrel,wDim0[1]/2-yrel,random(0,1)<0.5));
      tiles.push(new Tile(wDim0[0]/2-xrel,wDim0[1]/2+yrel,random(0,1)<0.5));
      tiles.push(new Tile(wDim0[0]/2+xrel,wDim0[1]/2-yrel,random(0,1)<0.5));
    }
  }*/
}

function windowResized() {
  wDim0 = [windowWidth,windowHeight];
  resizeCanvas(wDim0[0],wDim0[1]);
}

function mouseClicked() {
  tiles.forEach((tile) => {
    if (tile.mouseHover()) {
      tile.clickaction();
    }
  });
}

function draw() {
  /* // Very joky
  if(frameCount == 5*fps) {
    soundtrack.play();
  }
  */
  // put drawing code here
  background(0, 80, 5);
  push();
  noStroke();
  translate(wDim0[0]/2,wDim0[1]/2);
  for(let rad = wDim0[0]+wDim0[1]; rad > 0; rad -= (wDim0[0]+wDim0[1])/24) {
    fill(0,30+70*(1-rad/(wDim0[0]+wDim0[1])),0);
    ellipse(0,0,rad*(1+0.1*sin(rad/5+frameCount/50)));
  }
  pop();
  //drawingContext.shadowOffsetX = 0;
  //drawingContext.shadowOffsetY = 0;
  //drawingContext.shadowBlur = 8;
  //drawingContext.shadowColor = 'black';
  //shuffle(tiles);
  tiles.forEach((tile) => {
    tile.move();
    tile.display();
  });

  if(frameCount/fps < textTime){
    push();
    fill(255,255,255,200-(frameCount/fps)*(200/textTime));
    noStroke();
    translate(wDim0[0]/2,wDim0[1]/2);
    rotate( sin((frameCount/fps)*(5*PI/textTime)) );
    textSize(80-(frameCount/fps)*(60/textTime));
    textAlign(CENTER, CENTER);
    text('Playful\nPlaying\nCards', 0, 0);
    pop();
  }
}

function sign(number) {
  if (number == 0) return 0;
  return number/abs(number);
}

class Tile {
  constructor(x,y,cardcolred,csuit,cvalue) {
    this.pos = [x,y];
    this.startpos = [x,y];
    this.col = color(250);
    this.size = tileSize;
    this.noisenow = 0;
    this.turned = true;
    //this.vert = this.noiseToPos(0);
    this.redcard = cardcolred;
    this.speedpf = [random(-5,5),random(-5,5)]; // speed per frame
    this.csuit = csuit;
    this.cvalue = cvalue;
    this.initrand = random(1,5);
  }

  mouseHover() {
    if (mouseX > (this.pos[0]-this.size[0]/2) && mouseX < (this.pos[0]+this.size[0]/2) &&
        mouseY > (this.pos[1]-this.size[1]/2) && mouseY < (this.pos[1]+this.size[1]/2))
        return true;
    return false;
  }

  clickaction(){
    if(this.turned)
      this.speedpf = [0,0];
    else
      this.speedpf = [random(-5,5),random(-5,5)];

    this.turned = ! this.turned;
  }

  noiseToPos(startingNoise) {
    startingNoise = abs(startingNoise);
    let perimeter = (this.size[0]+this.size[1]) * 2;
    let noiseScaled = (startingNoise % perimeter);
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

    if(this.turned) {
      let numhover = 0;
      tiles.forEach((tile) => {
        if(this.initrand != tile.initrand) { //notsame
          if ((abs(tile.pos[0]-this.pos[0]) < this.size[0])&&(abs(tile.pos[1]-this.pos[1]) < this.size[1])) {
            this.speedpf[0] -= 0.1*(tile.pos[0]-this.pos[0])/abs(tile.pos[0]-this.pos[0])*((-abs(tile.pos[0]-this.pos[0])+this.size[0])/this.size[0]);
            this.speedpf[1] -= 0.1*(tile.pos[1]-this.pos[1])/abs(tile.pos[1]-this.pos[1])*((-abs(tile.pos[1]-this.pos[1])+this.size[1])/this.size[1]);
            //this.speedpf[1] -= 0.1*((tile.pos[1]-this.pos[1])/this.size[1]);
            numhover++;
          }
        }
      });
      this.speedpf[0] *= 1-0.8*exp(-numhover*2);
      this.speedpf[1] *= 1-0.8*exp(-numhover*2);
    }

    pop();
    //shadow
    fill(0,0,0,75);
    stroke(0,0,0,0);
    rect(this.pos[0]-this.size[0]/2+40*(this.pos[0]-wDim0[0]/2)/(wDim0[0]/2), this.pos[1]-this.size[1]/2+40*(this.pos[1]-wDim0[1]/2)/(wDim0[1]/2), this.size[0], this.size[1]);
    push();
    this.noisenow = noise(this.pos[0],this.pos[1],frameCount/40);

    if (this.redcard)
      this.col = color(this.noisenow*155+100,60,60);
    else
      this.col = color(60,60,this.noisenow*155+100);

    if (this.mouseHover()) {
        if (this.turned) {
          if (this.speedpf[0] == 0)
            this.speedpf[0] = rand(-5,5);
          if (this.speedpf[1] == 0)
            this.speedpf[1] = rand(-5,5);
          this.speedpf[0] *= 2;
          this.speedpf[1] *= 2;
        }
        if (abs(this.speedpf[0])>maxspeed)
          this.speedpf[0] = this.speedpf[0]*maxspeed/abs(this.speedpf[0]);
        if (abs(this.speedpf[1])>maxspeed)
          this.speedpf[1] = this.speedpf[1]*maxspeed/abs(this.speedpf[1]);
        let addX = ((tileSize[0]+focusEnlarge+this.size[0])/2 - this.size[0])*transitionSpeed;
        let addY = ((tileSize[1]+focusEnlarge+this.size[1])/2 - this.size[1])*transitionSpeed;
        this.size = [this.size[0]+addX,this.size[1]+addY];
        if (this.redcard)
          this.col = color(this.noisenow*155+100,80,80);
        else
          this.col = color(80,80,this.noisenow*155+100);
    }
    else if (this.size != tileSize) {
      let addX = (tileSize[0] - this.size[0])*transitionSpeed;
      let addY = (tileSize[1] - this.size[1])*transitionSpeed;
      this.size = [this.size[0]+addX,this.size[1]+addY];
    }

    if (this.turned) {
      if (this.pos[0]-this.size[0]/2 < 0 ) {
        //this.speedpf[0] = abs(this.speedpf[0]);
        this.speedpf[0] += -(this.pos[0]-this.size[0]/2)^2/elastCoeff;
      }
      else if (this.pos[0]+this.size[0]/2 > wDim0[0]) {
        //this.speedpf[0] = -abs(this.speedpf[0]);
        this.speedpf[0] -= (this.pos[0]+this.size[0]/2 - wDim0[0])^2/elastCoeff;
      }
      if (this.pos[1]-this.size[1]/2 < 0 ) {
        //this.speedpf[1] = abs(this.speedpf[1]);
        this.speedpf[1] += -(this.pos[1]-this.size[1]/2)^2/elastCoeff;
      }
      else if (this.pos[1]+this.size[1]/2 > wDim0[1]) {
        //this.speedpf[1] = -abs(this.speedpf[1]);
        this.speedpf[1] -= (this.pos[1]+this.size[1]/2 - wDim0[1])^2/elastCoeff;
      }
    }
  }

  display() {
    if(!this.turned) {
      push();
      fill(255);
      stroke(200)
      strokeWeight(1);
      rect(this.pos[0]-this.size[0]/2, this.pos[1]-this.size[1]/2, this.size[0], this.size[1]);

      if (this.csuit == "♦" || this.csuit == "♥")
        fill(250,0,0);
      else
        fill(0);
      noStroke();
      translate(this.pos[0],this.pos[1]);
      rotate(sin(this.noisenow*2*PI+(frameCount/fps)*(6*PI/textTime))/2 );
      textSize(this.size[0]/3 + 4*cos(this.noisenow*2*PI+(frameCount/fps)*(12*PI/textTime)));
      textAlign(CENTER, CENTER);
      text(this.cvalue+this.csuit, 0, 0);
      pop();
    }
    else {
      push();
      fill(this.col);
      if (this.redcard)
        stroke(150,30,30,230);
      else
        stroke(30,30,150,230);
      strokeWeight(2);
      rect(this.pos[0]-this.size[0]/2, this.pos[1]-this.size[1]/2, this.size[0], this.size[1]);
      strokeWeight(3);

      let vert1 = [0,0];
      let vert2 = [0,0];
      for (let delta = 0; delta < (this.size[0]+this.size[1])*2; delta+=24) {
        vert1 = this.noiseToPos(this.initrand*this.size[0]+this.initrand*frameCount+delta);
        vert2 = this.noiseToPos((this.initrand*this.size[0]+this.initrand*frameCount)*5+delta);
        if (this.redcard)
          stroke(150,30,30,230);
        else
          stroke(30,30,150,230);
        line(vert1[0],vert1[1],vert2[0],vert2[1]);
      }
      pop();
    }
  }
}
