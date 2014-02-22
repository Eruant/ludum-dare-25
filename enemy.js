function Enemy() {

  var e = window.essence
    , sys = e.system
    , t = this
    , addEnemy = function() {
        var r = Math.ceil(Math.random()*Math.floor(t.enemysAvailable))
          etype = t.enemyTypes[r-1];
        ;
        t.enemys.push({
            x: 0 /*Math.floor(Math.random()*sys.width)*/
          , y: e.world.y
          , xSpeed: Math.random()*etype.speed-(etype.speed/2)
          , health: etype.health
          , maxHealth: etype.health
          , damage: etype.damage
          , type: r
        });
      }
    , i
    , damage = []
    , addProjectile = function(x,y,rotation,speed,damage, playerX) {
        t.projectiles.push({
            x: x
          , y: y
          , xSpeed: (Math.cos(rotation - (90 * (180/Math.PI))) * speed) - playerX
          , ySpeed: Math.sin(rotation - (90 * (180/Math.PI))) * speed
          , rotation: rotation
          , thrust: speed
          , damage: damage
        });
      }
  ;

  e.audio.load('enemy_shot.wav', 'enemy_shoot');
  e.audio.load('enemy_missile.wav', 'enemy_missile');

  // public variables (for setting difficulty)
  this.enemys = [];
  this.maxCount = 5;
  this.wave = 0;
  this.waveTime = 1000 * 20; // time inbetween waves
  this.timeToNextWave = this.waveTime;
  this.enemysAvailable = 1; //1 allow more enemy types to spawn
  this.projectiles = [];

  this.enemyTypes = [
    { health: 100, speed:4, damage:10 },
    { health: 50, speed:8, damage: 5 },
    { health: 200, speed:2, damage: 20 },
    { health: 400, speed:2, damage: 30 },
    { health: 100, speed:4, damage: 50 },
    { health: 50, speed:6, damage: 0 }
  ];

  // spawn enemys
  for(i=0; i<t.maxCount; i++) {
    addEnemy();
  }

  this.update = function(time) {
    var i;

    t.timeToNextWave -= time;

    if(t.timeToNextWave < 0) {
      t.timeToNextWave = t.waveTime;
      if(t.enemysAvailable < t.enemyTypes.length) {
        t.enemysAvailable += 0.5;
      }
      t.maxCount += 2;
      for(i=0; i<t.maxCount; i++) {
        addEnemy();
      }
    }

    for(i=0; i<t.enemys.length; i++) {

      var enemy = t.enemys[i]
        , a
      ;

      // move enemy
      enemy.x += enemy.xSpeed;

      // loop around screen
      if(enemy.x < - 10) {
        enemy.x = sys.width + 10;
      }
      if(enemy.x > sys.width + 10) {
        enemy.x = -10;
      }

      if(Math.random() < 0.005 && enemy.damage > 0) {

        // figure out where player is
        a = Math.atan2(e.player.x - enemy.x, e.player.y - enemy.y);
        if(a < 0) {
          a += 2 * Math.PI;
        }
        t.shoot(enemy.x,enemy.y,-a,5,enemy.damage,enemy.xSpeed);
      }

      if(enemy.health <= 0) {
        t.enemys.remove(i);
        e.score += 100;
      }

    }

    for(i=0; i<damage.length; i++) {
      var d = damage[i]
        , j
      ;

      // check to see what enemys are here
      for(j=0; j<t.enemys.length; j++) {
        var ej = t.enemys[j]
          , halfRadius = d.radius / 2
        ;

        if(ej.x < d.x + halfRadius && ej.x > d.x - halfRadius) {
          var healthLoss = 10 * (Math.abs(ej.x - ej.y) / d.radius);
          ej.health -= healthLoss;
        }

      }

      d.radius -= 5;
      if(d.radius < 1) {
        damage.remove(i);
      }
    }

    
    for(i=0; i<t.projectiles.length; i++) {
      var p = t.projectiles[i]
      ;

      p.x += p.xSpeed;
      p.y += p.ySpeed;

      if(p.x > e.player.x -20 && p.x < e.player.x + 20 && p.y > e.player.y -30 && p.y < e.player.y ) {
        e.player.health -= p.damage;
        t.projectiles.remove(i);
        e.audio.play('injured');
      }

      if(p.x < 0 || p.x > sys.width || p.y > e.world.y+10 || p.y < 0) {
        t.projectiles.remove(i);
      }

    }
    
  };

  this.draw = function(time) {
    var ctx = sys.ctx
      , i
    ;

    for(i=0; i<t.enemys.length; i++) {
      
      var enemy = t.enemys[i]
        , maxHeathSize = enemy.maxHealth / 10
        , j
      ;

      // draw projectiles
      for(j=0; j<t.projectiles.length; j++){
        var p = t.projectiles[j];

        ctx.save();
        ctx.translate(p.x,p.y)
        ctx.rotate(p.rotation);
        ctx.beginPath();
        
        if(p.damage <= 10) {
          ctx.drawImage(e.spriteSheet, 0, 508, 4, 4, -2, 0, 4, 4);
        } else if(p.damage <= 20){
          ctx.drawImage(e.spriteSheet, 5, 505, 6, 7, -3, 0, 6, 7);
        } else if(p.damage <= 40){
          ctx.drawImage(e.spriteSheet, 12, 496, 8, 16, -4, 0, 8, 16);
        } else {
          ctx.drawImage(e.spriteSheet, 21, 491, 7, 21, -3, 0, 7, 21);
        }
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }

      ctx.save();
      ctx.translate(enemy.x,enemy.y);
      ctx.beginPath();

      if(enemy.xSpeed > 0) {
        ctx.scale(-1,1);
      }

      switch(enemy.type) {
        case 6:
          ctx.drawImage(e.spriteSheet, 480, 64, 32, 32, -16, -32, 32, 32);
        break;
        case 5:
          ctx.drawImage(e.spriteSheet, 352, 0, 32, 32, -16, -32, 32, 32);
        break;
        case 4:
          ctx.drawImage(e.spriteSheet, 384, 0, 32, 32, -16, -32, 32, 32);
        break;
        case 3:
          ctx.drawImage(e.spriteSheet, 416, 0, 32, 32, -16, -32, 32, 32);
        break;
        case 2:
          ctx.drawImage(e.spriteSheet, 448, 0, 32, 32, -16, -32, 32, 32);
        break;
        default:
          ctx.drawImage(e.spriteSheet, 480, 0, 32, 32, -16, -32, 32, 32);
        break;
      }
      ctx.closePath();
      ctx.fill();

      // health bar - need to check on maxHealth
      ctx.strokeStyle = '#000';
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.fillRect(-(maxHeathSize/2)-0.5, -26.5, maxHeathSize+1, 5);
      ctx.strokeRect(-(maxHeathSize/2)-0.5,-26.5, maxHeathSize+1, 5);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.beginPath();
      if(enemy.health / enemy.maxHealth > 0.5) {
        ctx.fillStyle = '#0f0';
      } else if(enemy.heath / enemy.maxHealth > 0.25) {
        ctx.fillStyle = '#cf0';
      } else {
        ctx.fillStyle = '#f00';
      }
      if(enemy.health > 0) {
        ctx.fillRect(-(maxHeathSize/2), -26, (enemy.health/10), 4);
      }
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }

    for(i=0; i<damage.length; i++) {
      var d = damage[i];

      ctx.save();
      ctx.translate(d.x,d.y);
      ctx.beginPath();
      ctx.fillStyle = 'rgba(255,50,50,0.8)';
      ctx.drawImage(e.spriteSheet, 0, 403, 64, 64, -d.radius/2, -d.radius/2, d.radius, d.radius);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }

  };

  // add an explosion
  this.addDamage = function(x,y,radius) {
    damage.push({
        x:x
      , y:y
      , radius:radius
    });
  };

  this.shoot = function(x,y,rotation,speed,damage,playerX) {
    addProjectile(x,y,rotation,speed,damage,playerX);
    if(damage <= 20) {
      e.audio.play('enemy_shoot');
    } else {
      e.audio.play('enemy_missile');
    }
  }

  sys.update.methods.push(this.update);
  sys.update.methods.push(this.draw);
}

