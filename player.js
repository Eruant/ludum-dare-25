function Player() {

  var e = window.essence
    , sys = e.system
    , t = this
    , maxProjectiles = 5
    , addProjectile = function() {
        t.projectiles.push({
            x: t.x
          , y: t.y
          , xSpeed: t.xSpeed
          , ySpeed: t.ySpeed
          , rotation: t.rotation
          , thrust: 0.5
        });
        e.score -= 10;
      }
    , lastShot = new Date().getTime()
    , shotTime = 250
    , damage = []
  ;

  e.audio.load('bomb_fire.wav', 'fire');
  e.audio.load('bomb_explode.wav', 'explode');
  e.audio.load('injured.wav', 'injured');

  this.x = sys.width / 2;
  this.y = e.world.y;
  this.xSpeed = 0;
  this.ySpeed = 0;
  this.rotation = Math.PI;
  this.thrust = 0;
  this.keys = {
      left: 37
    , right: 39
    , up: 38
    , shoot: 90
  };
  this.health = 100;
  this.projectiles = [];

  this.update = function(time) {

    var activeKeys = e.input.activeKeys
      , dx
      , dy
      , i
    ;

    // check to see if we have pressed any keys
    for(i in activeKeys) {
      if(activeKeys[i] === t.keys.left) {
        t.rotation -= 0.05;
      }
      if(activeKeys[i] === t.keys.right) {
        t.rotation += 0.05;
      }
      if(activeKeys[i] === t.keys.up) {
        if(t.thrust < 0.5) {
          t.thrust += 0.15;
        }
      }
      if(activeKeys[i] === t.keys.shoot) {
        if(t.projectiles.length < maxProjectiles) {
          if(sys.lastUpdate - lastShot > shotTime) {
            addProjectile();
            e.audio.play('fire');
            lastShot = sys.lastUpdate;
          }
        }
      }
    }

    // reduce thrust (to bring us down)
    if(t.thrust > 0) {
      t.thrust -= 0.1;
    } else if(t.thrust < 0) {
      t.thrust = 0;
    }

    // if we are on the ground and rotated - try and straighted out
    if(t.y > e.world.y-1) {
      if(t.rotation < Math.PI+0.1 && t.rotation > Math.PI-0.1) {
        t.rotation = Math.PI;
      } else{
        if(t.rotation > Math.PI) {
          t.rotation -= 0.1;
        }
        if(t.rotation < Math.PI) {
          t.rotation += 0.1;
        }
      }
      // stop the sliding along the ground
      if(t.xSpeed < 0.1 && t.xSpeed > -0.1) {
        t.xSpeed = 0;
      } else if(t.xSpeed !== 0) {
        t.xSpeed += (t.xSpeed > 0) ? -0.1 : 0.1;
      }
    }

    // calculate our movement
    dy = (t.thrust > 0) ? Math.cos(t.rotation) * t.thrust : 0;
    dx = (t.thrust > 0) ? Math.sin(t.rotation) * t.thrust : 0;

    // add gravity
    t.xSpeed -= dx;
    t.ySpeed += dy + e.environment.gravity;

    // ground collision
    if(t.y > e.world.y) {
      t.ySpeed = (-t.ySpeed) * 0.3;
      t.y = e.world.y;
      t.xSpeed = t.xSpeed / 2;
    }

    // sky collision
    if(t.y < 30) {
      t.thrust = 0;
      t.ySpeed = (-t.ySpeed) * 0.75;
      if(t.ySpeed < 1) {
        t.ySpeed = 1;
      }
    }
    
    // stop boncing off the floor
    if(t.ySpeed < 0.4 && t.ySpeed > -0.4 && t.y > e.world.y-1) {
      t.ySpeed = 0;
    }
    // update the player position
    t.x += t.xSpeed;
    t.y += t.ySpeed;

    // loop either side of the screen
    if(t.x > sys.width) {
      t.x = 0;
    }
    if(t.x < 0) {
      t.x = sys.width;
    }

    for(i=0; i<t.projectiles.length; i++) {
      var p = t.projectiles[i]
        , dx = Math.cos(p.rotation + (90 * (180/Math.PI))) * p.thrust
        , dy = Math.sin(p.rotation + (90 * (180/Math.PI))) * p.thrust
      ;

      p.xSpeed = p.xSpeed * 0.9;
      p.ySpeed += dy + e.environment.gravity;
    
      p.x += p.xSpeed;
      p.y += p.ySpeed;

      if(p.y + p.ySpeed > e.world.y) {
        t.projectiles.remove(i);
        e.enemy.addDamage(p.x,p.y,50);
        t.addDamage(p.x,p.y,50);
      }
    }

    for(i=0; i<damage.length; i++) {
      var d = damage[i]
        , j
        , halfRadius = d.radius / 2
      ;

      if(t.x < d.x + halfRadius && t.x > d.x - halfRadius && t.y < d.y + halfRadius && t.y > d.y - halfRadius) {
        var healthLoss = 5 * (Math.abs(t.x - t.y) / d.radius);
        t.health -= healthLoss;
        e.audio.play('injured');
      }

      d.radius -= 5;
      if(d.radius < 1) {
        damage.remove(i);
      }
    }

    if(t.health < 0) {
      e.gameOver();
    }

    // add health over time
    if(t.health < 100 && t.y > e.world.y - 10) {
      t.health += 0.2;
    }
    
    
  }; // end update

  this.draw = function(time) {
    var ctx = sys.ctx
      , activeKeys = e.input.activeKeys
      , i
    ;

    // draw projectiles
    for(i=0; i<t.projectiles.length; i++){
      var p = t.projectiles[i];

      ctx.save();
      ctx.translate(p.x,p.y)
      ctx.rotate(p.rotation);
      ctx.beginPath();
      ctx.drawImage(e.spriteSheet, 0, 497, 7, 7, -3.5, 0, 7, 7);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }

    ctx.save();
    ctx.translate(t.x, t.y);
    ctx.rotate(t.rotation+Math.PI);

    ctx.drawImage(e.spriteSheet, 32, 468, 40, 38, -20, -38, 40, 38);
    
    // draw booster
    for(i in activeKeys) {
      if(activeKeys[i] === t.keys.up) {
        ctx.fillStyle = '#f3f';
        ctx.beginPath();
        ctx.drawImage(e.spriteSheet, 74, 466, 44, 44, -22, -40, 44, 44);
        ctx.closePath();
        ctx.fill();
      }
    }

    ctx.restore();

    // health bar
    ctx.save();
    ctx.translate(t.x-20, t.y-20);
    ctx.strokeStyle = '#000';
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.fillRect(-0.5,-26.5, 41, 5);
    ctx.strokeRect(-0.5,-26.5, 41, 5);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    if(t.health > 50) {
      ctx.fillStyle = '#0f0';
    } else if(t.health > 25) {
      ctx.fillStyle = '#cf0';
    } else {
      ctx.fillStyle = '#f00';
    }
    ctx.fillRect(0, -26, ((t.health/100)*40), 4);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

  };

  // add an explosion
  this.addDamage = function(x,y,radius) {
    damage.push({
        x:x
      , y:y
      , radius:radius
    });
    e.audio.play('explode');
  };

  sys.update.methods.push(this.update);
  sys.update.methods.push(this.draw);
}
