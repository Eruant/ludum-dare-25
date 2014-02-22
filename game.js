// Array Remove - By John Resig (MIT Licensed)
Array.prototype.remove = function(from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};

(function(e){
  
  // show a start screen

  e.startScreen = {
    title: '2012: Mayan Revenge'
  };

  e.tips = [
      'You will regain your health by landing'
    , 'Watch out, you can damage yourself with your own weapon'
    , 'Take out as many enemys as you can with one bomb'
    , 'Vehicles are more dangerous, take them out first'
    , 'Don\'t try this at home'
    , 'Every shot reduces your score'
  ];
  
  e.audio.load('bg_music.wav', 'bg');
  e.audio.setVolume('bg', 0);
  e.audio.setLooping('bg');

  e.font = '14px "NoconsequenceRegular", Arial';
  e.fontLarge = '20px "NoconsequenceRegular", Arial';

  var s = e.startScreen
    , sys = e.system
  ;

  e.score = 0;
  e.prevHighscore = 0;
  e.graphicsLoaded = false;

  if(typeof(Storage) !== undefined) {
    e.highscore = (localStorage.highscore !== undefined) ? localStorage.highscore : 0;
    e.ls = true;
  } else {
    e.highscore = 0;
    e.ls = false;
  }

  e.spriteSheet = new Image();
  e.spriteSheet.width = 512;
  e.spriteSheet.height = 512;
  e.spriteSheet.src = 'ld25.png';
  e.spriteSheet.onload = function() {
    e.graphicsLoaded = true;
  };

  
  s.welcomeScreen = function(time) {
    var ctx = sys.ctx;

    ctx.mozImageSmoothingEnabled = false;
    ctx.webkitImageSmoothingEnabled = false;
    
    ctx.save();
    ctx.beginPath();
    ctx.fillStyle = "#690";
    ctx.fillRect(0,0,sys.width,sys.height);
    ctx.closePath();
    ctx.restore();

    ctx.save();
    ctx.translate(Math.floor(sys.width/2),Math.floor(sys.height/2));
    
    ctx.drawImage(e.spriteSheet, 128, 192, 352, 256, -176, -128, 352, 256);
    
    ctx.fillStyle = '#fff';
    ctx.shadowColor = '#000';
    ctx.shadowBlur = 2;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    ctx.font = e.fontLarge;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(s.title, 0, -30);

    ctx.font = e.font;
    ctx.fillText("Use arrow keys to move", 0, 0);
    ctx.fillText("'Z' to shoot", 0, 30);

    ctx.restore();
    
    ctx.save();
    ctx.translate(Math.floor(sys.width/2),sys.height-10);
    ctx.font = e.fontLarge;
    ctx.fillStyle = '#fff';
    ctx.shadowColor = '#000';
    ctx.shadowBlur = 2;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    ctx.fillText("It's the end of the Mayan calendar", 0, -60);
    ctx.fillText("Time to destroy the world", 0, -30);
    ctx.restore();

  };

  sys.update.methods.push(s.welcomeScreen);
  sys.init();
  //e.state.pauseGame();

  s.draw = function(time) {
    var ctx = sys.ctx;

    ctx.fillStyle = '#000';
    ctx.font = e.font;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText("Score: " + e.score, 10, 10);

    if(e.score > e.prevHighscore) {
      e.highscore = e.score;
      if(e.ls) {
        localStorage.highscore = e.highscore;
      }
    }
    ctx.textAlign = 'right';
    ctx.fillText("Highscore: " + e.highscore, sys.width-10, 10);

    ctx.textAlign = 'center';
    ctx.fillText("Next wave in " + Math.floor(e.enemy.timeToNextWave/1000), sys.width/2, 10);
  }

  e.startGame = function(firstTime) {

    e.score = 0;
    
    // on a key press - remove the start screen
    window.addEventListener('keydown', function(ev){

      if(!firstTime) {
        if(ev.keyCode !== 13) {
          return false;
        }
      } else {
        e.audio.play('bg');
      }
      e.audio.fadeTo('bg', 1000, 1);
      sys.update.methods = [];
      e.state.startGame();
      this.removeEventListener('keydown', arguments.callee, false);
      
      // now load in the world
      e.world = new World();
      e.player = new Player();
      e.enemy = new Enemy();

      // move the drawing of background to last position
      sys.update.methods.push(e.world.drawForeground);

      e.input.keyListener();

      sys.update.methods.push(s.draw);
    }, false);

  };

  e.gameOver = function() {
    sys.update.methods = [e.endScreen];
  };

  e.endScreen = function(time) {
    var ctx = sys.ctx;
    
    e.audio.fadeTo('bg', 1000, 0.2);

    ctx.save();
    ctx.translate(Math.floor(sys.width/2),Math.floor(sys.height/2));
    
    ctx.drawImage(e.spriteSheet, 128, 192, 352, 256, -176, -128, 352, 256);
    
    ctx.fillStyle = '#fff';
    ctx.shadowColor = '#000';
    ctx.shadowBlur = 2;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    ctx.font = e.font;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Oops, the world didn\'t end', 0, -30);
    ctx.fillText('Score: '+e.score, 0, 0);

    ctx.fillText('Press "enter" to try again', 0, 30);

    if(e.score > e.prevHighscore ) {
      e.prevHighscore = e.score;
      e.highScore = e.prevHighscore;
      ctx.fillStyle = '#f90';
      ctx.font = e.fontLarge;
      ctx.fillText('You have a new highscore', 0, -150);
    }
    
    ctx.restore();
    
    ctx.save();
    ctx.translate(sys.width/2,20);
    ctx.fillStyle = '#000';
    ctx.font = e.font;
    ctx.textBaseline = 'top';
    ctx.textAlign = 'center';
    ctx.fillText("Tip: "+e.tips[Math.floor(Math.random()*e.tips.length)], 0, 0);
    ctx.restore();

    e.state.pauseGame();
    e.startGame(false);
  };

  e.startGame(true);

})(window.essence);
