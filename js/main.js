window.onload = function() {
    // You might want to start with a template that uses GameStates:
    //     https://github.com/photonstorm/phaser/tree/master/resources/Project%20Templates/Basic
    
    // You can copy-and-paste the code from any of the examples at http://examples.phaser.io here.
    // You will need to change the fourth parameter to "new Phaser.Game()" from
    // 'phaser-example' to 'game', which is the id of the HTML element where we
    // want the game to go.
    // The assets (and code) can be found at: https://github.com/photonstorm/phaser/tree/master/examples/assets
    // You will need to change the paths you pass to "game.load.image()" or any other
    // loading functions to reflect where you are putting the assets.
    // All loading functions will typically all be found inside "preload()".
    
    "use strict";
    
	var game = new Phaser.Game(700, 500, Phaser.CANVAS, 'game', { preload: preload, create: create, update: update, render: render });

	function preload() {

		//Add my spirites and background image
		game.load.spritesheet('yume', 'assets/yume.png', 32, 48);
	    game.load.image('background', 'assets/redmaze.png');
		game.load.image('effectie', 'assets/effect.png');
		game.load.audio('sfx', 'assets/sounds.ogg');

	}

	var effect;
	var player;
	var grav;
	var facing = 'left';
	var jumpTimer = 0;
	var score =0;
	var cursors;
	var bg;
	var scoreText;
	var introText;
	var fx;
	var timer=0;

	function create() {

	    game.physics.startSystem(Phaser.Physics.ARCADE);

	    bg = game.add.tileSprite(0, 0, 700, 500, 'background');

		grav = 55; //starting slow gravity
		game.physics.arcade.gravity.y = grav;

	    player = game.add.sprite(350, 500, 'yume');
		
	    game.physics.enable(player, Phaser.Physics.ARCADE);

	    player.body.bounce.y = 0.1;
	    player.body.collideWorldBounds = true;
		player.body.gravity.y=100;
	    player.body.setSize(20, 32, 5, 16);
		
	    player.animations.add('left', [0, 1, 2, 3], 10, true);
	    player.animations.add('turn', [4], 20, true);
	    player.animations.add('right', [5, 6, 7, 8], 10, true);
		
	    cursors = game.input.keyboard.createCursorKeys();
		
		fx = game.add.audio('sfx');
		fx.allowMultiple = true;
		
		fx.addMarker('destroy', 0, 0.37);
		fx.addMarker('over', 0.37, 0.69);
		
		scoreText = game.add.text(32, 10, 'score: 0', { font: "20px Arial", fill: "#ffffff", align: "left" });
		introText = game.add.text(game.world.centerX, 400, '- click to start -', { font: "40px Arial", fill: "#ffffff", align: "center" });
		introText.anchor.setTo(0.5, 0.5);
		
		game.input.onDown.add(createEffect, this);

	}

	function update() {

	    game.physics.arcade.collide(player, effect, collisionHandler, null, this);
		player.body.velocity.x = 0;

		if(effect!=null){
			if( effect.body.onFloor() ){
				gameOver();
			}
		}

		if (cursors.left.isDown)
	    {
	        player.body.velocity.x = -150;

	        if (facing != 'left')
	        {
	            player.animations.play('left');
	            facing = 'left';
	        }
	    }
	    else if (cursors.right.isDown)
	    {
	        player.body.velocity.x = 150;

	        if (facing != 'right')
	        {
	            player.animations.play('right');
	            facing = 'right';
	        }
	    }
	    else
	    {
	        if (facing != 'idle')
	        {
	            player.animations.stop();

	            if (facing == 'left')
	            {
	                player.frame = 0;
	            }
	            else
	            {
	                player.frame = 5;
	            }

	            facing = 'idle';
	        }
	    }

	}
	
	function createEffect(){
		//This function randomly creates an Effect and drops it randomly.
		introText.visible = false;
		
		effect = game.add.sprite(game.world.randomX, 0, 'effectie');
		game.physics.enable(effect, Phaser.Physics.ARCADE);
		effect.body.collideWorldBounds=true;
		effect.body.gravity.y=50;
		game.physics.arcade.gravity.y = grav;
	}
	
	function collisionHandler(_player, _effect) {

		_effect.kill(); //destroy effect
		score ++; //increment score
		scoreText.text = 'score: ' + score; //display new score
		
		fx.play('destroy');
		
		if(score%20==0){
			grav=grav*1.25;
		}
		createEffect();

	}
	
	function gameOver() {
    
		if(timer==0){
	    fx.play('over');
		introText.text = 'Game Over!';
	    introText.visible = true;
		timer++;
	}
	else{
		game.pause();
	}

	}

	function render() {

	    //game.debug.text(game.time.suggestedFps, 32, 32);
	    // game.debug.text(game.time.physicsElapsed, 32, 32);
	    // game.debug.body(player);
	    // game.debug.bodyInfo(player, 16, 24);

	}
    
};
