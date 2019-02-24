/*
    = 実装テクニック =
    当たり判定をして物理オブジェクトを消去します

    // (1)グループ
    var group = new Group();
    scene.addChild(group);

    // (2)当たり判定(ground x group)
    ground.addCollision(group);
    ground.on(Event.COLLISION, function(e){
        var target = e.collision.target;
        target.destroy();
    });

    // (3)ブロック
    var block1 = new PhyBoxSprite(31, 31, enchant.box2d.DYNAMIC_SPRITE);
    block1.image = core.assets["images/do_daruma.png"];
    block1.x = 160-32;
    block1.y = 120;
    group.addChild(block1);
*/

var assets = [
    "images/title.png",// タイトル
    "images/do_background.png",
    "images/do_ground.png",
    "images/block_a.png",
    "images/block_b.png",
    "images/do_daruma.png",
    "images/cf307/monkeyapple.png",
    "images/cf307/banana.png",
    "images/cf307/sakuranbo.png",
    "images/cf307/monkey_gibbon_shadow2.png",
    "images/back_sky.png",
    "sounds/cf307/bgm_chouchou.mp3",
    "sounds/cf307/trumpet1.mp3",
    "sounds/cf307/puyon1.mp3",
];

function gameStart(){// ゲーム画面
    scene = new Scene();
    core.replaceScene(scene); core.resume();

    //==========
    // ここから
    //==========

    // ワールドを生成
    var world = new PhysicsWorld(0, 12);
    scene.on(Event.ENTER_FRAME, function() {
        world.step(core.fps);
    });

    var  MonkeyG = new Group();
    scene.addChild(MonkeyG);

    var BGM = core.assets["sounds/cf307/bgm_chouchou.mp3"].clone();
    BGM.play();// 修正

    // 背景画像を生成
    var sky1 = new Sprite(320, 480 * 3);
    sky1.y = -480 * 2;
    sky1.image = core.assets["images/back_sky.png"];
    MonkeyG.addChild(sky1);

    // 物理オブジェクトを生成
    var ground = new PhyBoxSprite(640, 60, enchant.box2d.STATIC_SPRITE);
    ground.image = core.assets["images/do_ground.png"];
    ground.x = scene.width * 0.5 - ground.width * 0.5;
    ground.y = 480-60;
    scene.addChild(ground);

    // 台
    var table = new PhyBoxSprite(96, 32, enchant.box2d.STATIC_SPRITE);
    table.image = core.assets["images/do_ground.png"];
    table.x = 160-48;
    table.y = 300;
    scene.addChild(table);

    // (1)グループ
    var group = new Group();
    scene.addChild(group);

    // (2)当たり判定(ground x group)
    ground.addCollision(group);
    ground.on(Event.COLLISION, function(e){
        //console.log(e);
        var target = e.collision.target;
        target.remove();
        switch(target.image){
            case core.assets["images/cf307/monkeyapple.png"]:
                console.log("aplle");
                howmanyF[0] -=1;
                break;
            case core.assets["images/cf307/banana.png"]:
                console.log("banana");
                howmanyF[1] -=1;
                break;
            case core.assets["images/cf307/sakuranbo.png"]:
                console.log("さくらんぼ");
                howmanyF[2] -=1;
                break;
        }
        if(score != 0){
            score--;
        }
    });

    // (3)ブロック
    /*
    var block1 = new PhyBoxSprite(32, 32, enchant.box2d.DYNAMIC_SPRITE);
    block1.image = core.assets["images/block_a.png"];
    block1.x = 7;
    block1.y = 0;
    group.addChild(block1);
   */
    //(4)タッチした座標を取得する
    scene.on(Event.TOUCH_START,function(e){
        dropBlock();
        readyAlt();
        score += 1;
        monkey.frame = 1;
    });
    scene.on(Event.TOUCH_END, function(e){
       console.log(monkey.y);
       console.log(e.y);
       monkey.frame = 0;
    });

    var howmanyF = [0,0,0];

    function dropBlock(){
        var fruits1 = new PhyBoxSprite(32,32, enchant.box2d.DYNAMIC_SPRITE,1,0.5,0);
        var rdm = getRandom(0,2);
        //ifと同じだが２つ以上だとこっちが楽
        switch(rdm){
            case 0: fruits1.image= core.assets["images/cf307/monkeyapple.png"];
                 howmanyF[0] +=1;
                 break;
            case 1: fruits1.image= core.assets["images/cf307/banana.png"];
                 howmanyF[1] +=1;
                 break;
            case 2: fruits1.image = core.assets["images/cf307/sakuranbo.png"];
                 howmanyF[2] +=1;
                 break;
         }
         fruits1.x = monkey.x;
         fruits1.y = monkey.y + 33;
         group.addChild(fruits1);
         console.log(howmanyF);
         var poi = core.assets["sounds/cf307/puyon1.mp3"].clone();
         poi.play();
         //scene.setScrollRange(fruits1,100,0,0,0);
     }

    var monkey = new Sprite(48,68);
    monkey.image = core.assets["images/cf307/monkey_gibbon_shadow2.png"];
    //monkey.backgroundColor = "red";
    MonkeyG.addChild(monkey);
    monkey.x = 0;
    monkey.y  = 64;
    monkey.tl.moveBy(320 -32, 0, 32);
    monkey.tl.moveBy(-320 + 32,0,32);
    monkey.tl.loop();

    //ヒモ
    var rope = new Sprite(960, 1);
    rope.backgroundColor = "brown";
    rope.y = monkey.y + 2;
    //rope.originX = 480;
    MonkeyG.addChild(rope);
    //rope.follow(monkey);

   //時間のカウント
    var timer = 55;

    var timelabel = new Label("TIME: " + timer);
    timelabel.x = 220;
    timelabel.color = 'orange';
    timelabel.font = "24px 'PixelMplus10'";
    MonkeyG.addChild(timelabel);

    rope.tl.delay(16);
    rope.tl.then(function(){
        timer--;
        console.log("あと"+ timer + "秒");
        timelabel.text = "TIME: " + timer;
        if(timer <= 10){
            timelabel.color = "red";
        }
        if(timer == 0){
            BGM.stop();
            console.log("おしまい");
            console.log(howmanyF);
            localStorage.setItem("howmanyF", howmanyF);
            localStorage.setItem("monkey_score", score);
            endStart();
        }
    });
    rope.tl.loop();

/*
    var sclbox = new Sprite(32,32);
    sclbox.backgroundColor = "red";
    sclbox.y = monkey.y;
    scene.addChild(sclbox);
    sclbox.follow(monkey);
    scene.setScrollRange(sclbox,100,0,0,0);
*/
    //scene.setScrollRange(monkey,64,0,0,0);
    monkey.addCollision(group);
    monkey.on(Event.COLLISION, function(){
      //monkey.y -= 10;
      //scorelabel.y -= 10;
      //sky1.y -= 10;
    });

    var score = 0;
    var scorelabel = new Label("SCORE: " + score);
    scorelabel.x = 0;
    scorelabel.color = 'black';
    scorelabel.font = "24px 'PixelMplus10'";
    MonkeyG.addChild(scorelabel);
    scorelabel.on(Event.ENTER_FRAME, function(){
        scorelabel.text = "SCORE: "+ score;
    });

    Dish = Class.create(PhyBoxSprite, {
        initialize:function(n,m){
            PhyBoxSprite.call(this,96,10,enchant.box2d.STATIC_SPRITE)
            this.x = n;
            this.y = m;
            this.backgroundColor = "#8b542e";
            scene.addChild(this);
       }
    });

  /*
    var dish = new PhyBoxSprite(170,74,enchant.box2d.DYNAMIC_SPRITE);
    dish.image = core.assets["images/cf307/monkeydish.png"];
    dish.x = 160 - dish.width / 2;
    dish.y = table.y - 130;
    scene.addChild(dish);
  */

    //皿の底
    var bottom = new Dish(table.x,table.y - 10);
    //皿の右側
    var right = new Dish(bottom.x + bottom.width - 20, bottom.y - 10);
    right.angle = -10;
    right.width = 70;

    //皿の左側
    var left = new Dish(bottom.x - 80, bottom.y - 10);
    left.width = 70;
    left.angle = 10;

    console.log(monkey.centerx);

    // (2) 処理を遅れさせよう
    function readyAlt(){
       scene.tl.clear();
       scene.tl.delay(16);// ３２から変更
       scene.tl.then(function(){
          checkAlt();
       });
    }

    // (3) ブロックを調べる処理
    function checkAlt(){
        console.log("高さを調べる");
        //console.log("箱のｙ：" + sclbox.y + "猿のy:" + monkey.y);
        // (4-1) グループで最も高い位置にあるブロックを調べる
        //for(初期化；　条件；　後処理；){処理}
        var borderY = 480;
        for(var i=0; i<group.childNodes.length; i++){
            console.log(i);
            var y = group.childNodes[i].y;
            console.log(y);
            //高い位置にあれば更新
            if(y < borderY){
                borderY = y;
            }
        }
        console.log("最も高い位置にあるのは：" + borderY);
        // (4-2) 高い位置から一定の距離を保つ
        var padding = 100;// １３０から変更
        if(borderY < monkey.y + padding){
            monkey.y = borderY - padding;
            rope.y = monkey.y + 2;
            scorelabel.y= monkey.y - 64;
            timelabel.y = monkey.y - 64;
            console.log("MG" + MonkeyG.y);
            console.log("m" + monkey.y);
            console.log("r" + rope.y);
        }
    }

    // (5) スクロールさせる
    scene.setScrollRange(monkey,63,null,null,null);

    sky1.tl.delay(8);
    sky1.tl.then(function(){
        console.log(monkey.y);
    });
    sky1.tl.loop();

   //var dotx =[0,0,1,1,0,1,0];

    //dotx.forEach(function (n) {
        //console.log(n);
    //});

    //==========
    // ここまで
    //==========
}

function endStart(){// ゲーム画面
    scene = new Scene();
    core.replaceScene(scene); core.resume();

    //==========
    // ここから
    //==========

    var sound = core.assets["sounds/cf307/trumpet1.mp3"].clone();
    sound.play();

    Fruits = Class.create(Sprite, {
        initialize: function(image){
            Sprite.call(this,32,32);
            this.image = core.assets[image];
        }
    });

    var howmany = localStorage.getItem("howmanyF");
    var howmanyA = howmany.split(",");
    var howmanyN  =[];

    for (var n in howmanyA) {
        var N = Number(howmanyA[n]);
        howmanyN.push(N);
        console.log(howmanyN);
    }

    //林檎をさっき皿の上にのったかずだけ出す
    for(var Fx = 0; Fx < howmanyN[0]; Fx++){
        var apple = new Fruits("images/cf307/monkeyapple.png");
        apple.x = 0 + ((Fx % 10) * 32);
        console.log(apple.x);
        apple.y =  (Math.floor(Fx / 10) * 32);;
        scene.addChild(apple);
    }

    //バナナをその続きからだす
    for(var Fx2 = 0; Fx2 < howmanyN[1]; Fx2++){
        var banana = new Fruits("images/cf307/banana.png");
        banana.x = 0 + (((Fx2 + Fx)  % 10) * 32);
        console.log(Fx);
        banana.y =  (Math.floor((Fx2 + Fx) / 10) * 32);
        scene.addChild(banana);
    }

    //さくらんぼをバナナの続きからだす
    for(var Fx3 = 0; Fx3 < howmanyN[2]; Fx3++){
       var cherry = new Fruits("images/cf307/sakuranbo.png");
       cherry.x = 0 + (((Fx3 + Fx2 + Fx)  % 10) * 32);
       console.log(Fx3);
       cherry.y =  (Math.floor((Fx3 + Fx2 + Fx) / 10) * 32);
       scene.addChild(cherry);
    }

    scene.backgroundColor = "green";
    var score = localStorage.getItem("monkey_score");

    var scorelabel = new Label("結果: " + score);
    scorelabel.x = 320 / 2 -100;
    scorelabel.y = 340;
    scorelabel.color = 'yellow';
    scorelabel.font = "48px 'PixelMplus10'";
    scene.addChild(scorelabel);
    //console.log(scorelabel);

    //core.end(score, "SCORE:" + score);

    console.log(enchant.nineleap.Game);
    core.end(score, 'スコア : ' + score);


    //==========
    // ここまで
    //==========

}

function titleStart(){// タイトル画面
    var scene = gameManager.createTitleScene();
    core.replaceScene(scene); core.pause();
    scene.on(enchant.Event.TOUCH_START, function(){gameStart();});
}

//==========
// EnchantJS
enchant('nineleap', 'box2d');
var gameManager;
var core;
var scene;
window.onload = function(){
    gameManager = new common.GameManager();
    core = gameManager.createCore(320, 480);
    core.preload(assets);
    core.onload = function(){titleStart();};
    core.start();
}
