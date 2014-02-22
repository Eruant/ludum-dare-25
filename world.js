function World() {

  var e = window.essence
    , sys = e.system
    , t = this
    , worldImg = new Image()
    , bushes = []
    , trees = []
    , i
    , bgCanvas = document.createElement('canvas')
    , bgCtx = bgCanvas.getContext('2d')
    , sky = bgCtx.createLinearGradient(0,0,0,sys.height)
    , ground = bgCtx.createLinearGradient(0,0,0,60)
  ;

  this.x = sys.width / 2;
  this.y = sys.height - 20;
  this.xSpeed = 0;
  this.ySpeed = 0;

  if(!document.getElementById('background')) {

  sky.addColorStop(0, '#ccf');
  sky.addColorStop(1, '#fff');
  
  ground.addColorStop(0, '#660');
  ground.addColorStop(1, '#390');

  sys.canvas.style.position = 'absolute';
  sys.canvas.style.zIndex = 2;
  bgCanvas.width = sys.width;
  bgCanvas.height = sys.height;
  bgCanvas.style.position = 'absolute';
  bgCanvas.style.opacity = 0.8;
  bgCanvas.style.zIndex = 1;
  bgCanvas.id = 'background';
  document.getElementsByTagName('body')[0].appendChild(bgCanvas);

  // draw sky
  bgCtx.save();
  bgCtx.beginPath();
  bgCtx.fillStyle = sky;
  bgCtx.fillRect(0,0,sys.width,sys.height);
  bgCtx.closePath();
  bgCtx.fill();
  bgCtx.restore();

  bgCtx.save();
  bgCtx.beginPath();
  bgCtx.fillStyle = ground;
  bgCtx.fillRect(0, t.y-40, sys.width, 60);
  bgCtx.closePath();
  bgCtx.fill();
  bgCtx.restore();

  this.addBush = function(x, y, w, h, srcX, srcY) {
    bushes.push({
        x: x
      , y: y
      , width: w
      , height: h
      , srcX: srcX
      , srcY: srcY
    });
  };

  this.addTree = function(x, y, w, h, srcX, srcY) {
    trees.push({
        x: x
      , y: y
      , width: w
      , height: h
      , srcX: srcX
      , srcY: srcY
    });
  };

  for(i=0; i<30; i++) {
    this.addTree(Math.floor(Math.random()*(sys.width+40))-40, sys.height-Math.floor(Math.random()*50)-180, 192, 90, 128, 2);
    this.addTree(Math.floor(Math.random()*(sys.width+40))-40, sys.height-Math.floor(Math.random()*50)-180, 192, 64, 128, 96);
  }

  for(i=0; i<100; i++) {
    this.addTree(Math.floor(Math.random()*(sys.width+40))-40, sys.height-Math.floor(Math.random()*30)-140, 26, 110, 57, 2);
    this.addTree(Math.floor(Math.random()*(sys.width+40))-40, sys.height-Math.floor(Math.random()*30)-105, 29, 90, 27, 0);
    this.addTree(Math.floor(Math.random()*(sys.width+40))-40, sys.height-Math.floor(Math.random()*100)-100, 40, 41, 83, 0);
  }

  for(i=0; i<50; i++) {
    if(Math.random() < 0.5) {
      // foreground
      //this.addBush(Math.floor(Math.random()*sys.width), sys.height-Math.floor(Math.random()*10)-20, 23, 15, 1, 1);
      //this.addBush(Math.floor(Math.random()*sys.width), sys.height-Math.floor(Math.random()*10)-20, 26, 15, 0, 17);

      // background
      this.addTree(Math.floor(Math.random()*sys.width), sys.height-Math.floor(Math.random()*90)-30, 24, 28, 83, 41);
      this.addTree(Math.floor(Math.random()*sys.width), sys.height-Math.floor(Math.random()*90)-30, 24, 28, 83, 41);
      this.addTree(Math.floor(Math.random()*sys.width), sys.height-Math.floor(Math.random()*30)-130, 26, 110, 57, 2);
      this.addTree(Math.floor(Math.random()*sys.width), sys.height-Math.floor(Math.random()*30)-105, 29, 90, 27, 0);
      this.addTree(Math.floor(Math.random()*sys.width), sys.height-Math.floor(Math.random()*30)-30, 26, 15, 0, 17);
      this.addTree(Math.floor(Math.random()*sys.width), sys.height-Math.floor(Math.random()*30)-30, 23, 15, 1, 1);
    } else {
      this.addTree(Math.floor(Math.random()*sys.width), sys.height-30, 26, 15, 0, 17);
    }
  }

  for(i=0; i<100; i++) {
    this.addTree(Math.floor(Math.random()*sys.width), sys.height-Math.floor(Math.random()*90)-100, 40, 41, 83, 0);
    this.addTree(Math.floor(Math.random()*sys.width), sys.height-Math.floor(Math.random()*100)-100, 24, 28, 83, 41);
  }
  } // if no background

  for(var i=0; i<trees.length; i++) {
      var tree = trees[i];
      
      bgCtx.save();
      bgCtx.beginPath();
      bgCtx.drawImage(e.spriteSheet, tree.srcX, tree.srcY, tree.width, tree.height, tree.x, tree.y, tree.width, tree.height);
      bgCtx.closePath();
      bgCtx.restore();
    }

  this.update = function(time) {
    
    // update the player position
    /*
    t.x += t.xSpeed;
    t.y += t.ySpeed;

    if(t.y > sys.height - 10) {
      t.ySpeed = (-t.ySpeed) * 0.3;
      t.y = sys.height - 10;
    }
    */
  };

  this.draw = function(time) {
    var ctx = sys.ctx
    ;

    ctx.save();
    ctx.translate(t.x, t.y);
    ctx.beginPath();
    ctx.fillStyle = '#3f3';
    ctx.moveTo(sys.width/2,0);
    ctx.lineTo(sys.width/2,sys.height/2);
    ctx.lineTo(-sys.width/2,sys.height/2);
    ctx.lineTo(-sys.width/2,0);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    for(var i=0; i<trees.length; i++) {
      var tree = trees[i];
      
      ctx.save();
      ctx.beginPath();
      ctx.drawImage(e.spriteSheet, tree.srcX, tree.srcY, tree.width, tree.height, tree.x, tree.y, tree.width, tree.height);
      ctx.closePath();
      ctx.restore();
    }

  };

  this.drawForeground = function(time) {
    var ctx = sys.ctx;

    // if this isn't going to change we need to draw from static
    for(var i=0; i<bushes.length; i++) {
      var bush = bushes[i];
      
      ctx.save();
      ctx.beginPath();
      ctx.drawImage(e.spriteSheet, bush.srcX, bush.srcY, bush.width, bush.height, bush.x, bush.y, bush.width, bush.height);
      ctx.closePath();
      ctx.restore();
    }

  };

  //sys.update.methods.push(this.update);
  //sys.update.methods.push(this.draw);
}
