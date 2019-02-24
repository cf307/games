var assets = [
    "images/title.png",// タイトル
    "images/tono.png",
    "images/bk_mage.png",
    "images/apple.png",
    "images/banana.png",
    "images/sakuranbo.png",
    "images/hat_tnt.png",
    "images/nk_sign_60.png",
    "images/st_negi_18_64.png",
    "images/ss_tuna_s_32_64.png",
    "images/nk_sign_stop.png",
    "sounds/jump02.mp3",
    "sounds/kotsudumi1.mp3",
    "sounds/boyon1.mp3",
    "sounds/appare.mp3",
    "sounds/manzokuzya.mp3",
    "sounds/hate.mp3",
    "sounds/tawakemono.mp3",
    "sounds/stupid3.mp3",
    "sounds/blip04.mp3",
    "sounds/utikubizya_1.mp3",
];

    // 何回もぶつかるバグを修正すること→修正済
/*
    音声のライセンス
    https://note.cman.jp/other/voice/ より
    HTS Voice "NIT ATR503 M001" Copyright (c) 2003-2012 Nagoya Insitute of Technology
    ロゴ <a rel="license" href="http://creativecommons.org/licenses/by/4.0/"><img alt="クリエイティブ・コモンズ・ライセンス" style="border-width:0" src="https://i.creativecommons.org/l/by/4.0/80x15.png" /></a>
    （https://creativecommons.org/choose/ で作れる）
    あるいは(Licensed under CC BY 4.0) https://find47.jp/ja/credit/
*/
function gameStart(){
    var scene = new Scene();
    core.replaceScene(scene); core.resume();

    //==========
    // ここから
    //==========

    scene.backgroundColor = "green";

    // 殿〜
    var tono = new Sprite(190, 140);
    tono.image = core.assets["images/tono.png"];
    tono.x = 320 / 2 - tono.width / 2;
    tono.y = 320 - 140;
    tono.originY = 140;
    scene.addChild(tono);
    var ts = 1;
    console.log("game");

    // 衝突判定用の頭の上
    var judge = new Sprite(32, 10);
    //judge.backgroundColor = "blue";
    judge.follow(tono);
    judge.y = tono.y - 8;
    judge.x = tono.x + tono.width / 2 - judge.width / 2;
    scene.addChild(judge);
    judge.originY = 140;// これ入れないと小さくしたときにずれる

    // スコア表示
    var score = 0;
    scoreLabel = new Label('SCORE : 0');
    scene.addChild(scoreLabel);
    scoreLabel.x = 100;
    scoreLabel.y = 10;
    scoreLabel.color = 'white';
    scoreLabel.font = "24px 'PixelMplus10'";

    // 画面をドラッグして殿を動かす
    scene.addEventListener(Event.TOUCH_START, function(e){
        X = tono.x - e.x; // 殿とタッチした場所の座標の差分
    });
    scene.addEventListener(Event.TOUCH_MOVE,function(e){
        tono.x = e.x + X;
    });

    // グループ
    var mageGroup = new Group();
    scene.addChild(mageGroup);

    // まげを出す関数（殿の大きさを変えようとして倍率をxにしたがその後結局使わずx=0.9で固定）
    function Mage(x){
        var mage = new Sprite(45, 60);
        mage.image = core.assets["images/bk_mage.png"];
        var magex = getRandom(0, 320 - 45);
        mage.x = magex;
        mage.y = - mage.height;
        mage.originY = 0;
        mage.tug = "まげ";
        mageGroup.addChild(mage);
        // まげの大きさを変える
        mage.scale(x);
        // 殿の大きさが変わり続けないようにする
        var p1 = x;
        if(ts != p1){
            ts = p1;
            tono.scale(p1);
            judge.scale(p1);
        }
        // 落とす
        mage.tl.moveBy(0, 320 + 60, 16 * 5 * x);
    }

    // 果物を落とす関数
    function Fruits(){
        var fruits = new Sprite(32, 32);
        var fi = getRandom(0, 3);
        if(fi == 0){
            fruits.image = core.assets["images/apple.png"];
        }
        if(fi == 1){
            fruits.image = core.assets["images/banana.png"];
        }
        if(fi == 2){
            fruits.image = core.assets["images/sakuranbo.png"];
        }
        if(fi == 3){
            fruits.image = core.assets["images/hat_tnt.png"];
        }
        var fruitsx = getRandom(0, 320 - 45);
        fruits.x = fruitsx;
        fruits.y = - fruits.height;
        fruits.originY = 0;
        fruits.tug = "果物";
        mageGroup.addChild(fruits);
        // 落とす
        fruits.tl.moveBy(0, 320 + 60, 16 * 5 * 0.9);
    }

    // いろいろな物を落とす関数
    function Mono(){
        var mi = getRandom(0, 3);
        //var mi = 0;// テスト用
        switch(mi){
            case 0: x = 64;
                    y =  135;
                    im = "images/nk_sign_60.png";
                    c = 0.5;
                    t = "標識";
            break;
            case 1: x = 18;
                    y = 64;
                    im = "images/st_negi_18_64.png";
                    c = 1.2;
                    t = "ねぎ";
            break;
            case 2: x = 32;
                    y = 64;
                    im = "images/ss_tuna_s_32_64.png",
                    c = 1;
                    t = "まぐろ";
            break;
            case 3: x = 64;
                    y = 135;
                    im = "images/nk_sign_stop.png";
                    c = 0.5;
                    t = "標識";
        }
        var mono = new Sprite(x, y);
        mono.image = core.assets[im];
        var monox = getRandom(0, 320 - x);
        mono.x = monox;
        mono.y = - y;
        mono.originY = y;
        mono.tug = t;
        mageGroup.addChild(mono);
        mono.scale(c);
        // 落とす
        mono.tl.moveBy(0, 320 + 60, 16 * 5 * 0.9);
    }

    //Mono(); // テスト用

    // 10個ずつ出す（だんだん速く）
    scene.tl.then(function(){
        Mage10(32);
    });
    scene.tl.then(function(){
        Mage10(24);
    });
    scene.tl.then(function(){
        Mage10(18);
    });
    scene.tl.then(function(){
        Mage10(16);
    });
    scene.tl.then(function(){
        Mage10(15);
    });
    scene.tl.then(function(){
        Mage10(14);
    });
    scene.tl.then(function(){
        Mage10(13);
    });
    scene.tl.then(function(){
        Mage10(12);
    });
    scene.tl.then(function(){
        Mage10(11);
    });
    scene.tl.then(function(){
        Mage10(10);
    });

    // 速さ（間隔）を変えてまげやいろいろな物を１０個出す関数
    function Mage10(x){
        for(var i=0; i<10; i++){
            scene.tl.then(function(){
                // 二割果物、二割物にする
                var select = getRandom(0, 9);
                // ただし最初の１０個はまげにする
                if(x == 32){
                    select = 4;
                }
                if(select < 2){
                    Mono();
                }else if(select < 4){
                    Fruits();
                }else{
                    Mage(0.9);
                }
            });
            scene.tl.delay(x);
        }
        // １００個落ちたらゲーム終了（最後の一個が落ちる時間待機）
        if(x == 10){
            scene.tl.delay(16 * 5 * 0.9).then(function(){
                console.log("end");
                switch(true){
                    case score > 999: a = "あっぱれ！";
                    break;
                    case score > 799: a = "ほうびをつかわす！";
                    break;
                    case score > 599: a = "大儀であった。";
                    break;
                    case score > 299: a = "精進いたせ。";
                    break;
                    case score >=  0: a = "修行が必要じゃな。";
                }
                core.end(score, a + '得点：' + score);
            });
        }
    }

    // 衝突判定
    judge.addCollision(mageGroup);
    judge.addEventListener(Event.COLLISION, function(e){
        // 二回衝突してしまうので一旦外す
        judge.removeCollision(mageGroup);
        e.collision.target.tl.clear();// まげを止める
        // 物のとき少し浮くので位置を微調整
        if(e.collision.target.tug == "果物"){
            e.collision.target.y += 5;
        }
        if(e.collision.target.tug == "標識"){
            e.collision.target.y += 5;
        }
        if(e.collision.target.tug == "ねぎ"){
            e.collision.target.y += 6;
        }
        if(e.collision.target.tug == "まぐろ"){
            e.collision.target.y += 10;
        }
        // 判定
        Judge();
        // 消す
        e.collision.target.tl.delay(7).then(function(){
            e.collision.target.remove();
            tono.frame = 0;
            judge.addCollision(mageGroup);
            //tono1.remove(); ここではできない
        });
    });

    // 当たり具合の判定
    function Judge(){
        p = 0;
        // 位置で判定
        var sa0 = (e.collision.target.x + e.collision.target.width / 2) - (judge.x + judge.width / 2);
        var sa = Math.abs(sa0);// 絶対値
        console.log("差", sa);
        e.collision.target.originY = e.collision.target.height;
        if(sa < 3){
            console.log("<3");
            tono.frame = 1;
            if(e.collision.target.tug != "まげ"){
                tono.frame = 3;
            }
            Tokuten(10);// +10と出す
        }else if(sa < 5){
            Tokuten(8);
        }else if(sa < 15){
            Tokuten(5);
            // ずれた分傾ける
            e.collision.target.rotate(sa0);
            tono.frame = 2;
        }else{
            Tokuten(1);
            e.collision.target.rotate(sa0);
            tono.frame = 5;
        }
        scoreLabel.text = 'SCORE : ' + score;
    }

    // 加算される得点の表示
    function Tokuten(x){
        // 得点加算
        score += x;
        var label = new Label("+" + x);
        label.x = judge.x;
        label.y = judge.y - 10;
        label.color = "red";
        if(e.collision.target.tug == "果物"){
            label.y = judge.y - 10 - 22;
        }
        label.font = "20px 'PixelMplus10'";
        scene.addChild(label);
        label.tl.moveBy(0, -20, 7);
        // 音
        Sound(x);
        label.tl.then(function(){
            this.remove();
        });
    }

    // 音
    function Sound(x){
        switch(x){
            case 10: a = "sounds/kotsudumi1.mp3";
                     b = "sounds/appare.mp3";
            break;
            case 8:  a = "sounds/jump02.mp3";
                     b = "sounds/manzokuzya.mp3";
            break;
            case 5:  a = "sounds/stupid3.mp3";
                     b = "sounds/hate.mp3";
            break;
            case 1:  a = "sounds/boyon1.mp3";
                     b = "sounds/tawakemono.mp3";
            break;
        }
        var sound = core.assets[a].clone();// 音
        sound.play();
        var sound0 = core.assets[b].clone();// 声
        sound0.play();
    }

    // 地面
    var ground = new Sprite(320, 10);
    ground.y = 319;
    //ground.backgroundColor = "red";
    scene.addChild(ground);

    // 衝突判定（地面に落ちたら）
    ground.addCollision(mageGroup);
    ground.addEventListener(Event.COLLISION, function(e){
        tono.frame = 6;
        e.collision.target.tl.clear();// まげを止める
        // 音（ブ、打首じゃ）
        var soundb = core.assets["sounds/blip04.mp3"].clone();
        soundb.play();
        var soundu = core.assets["sounds/utikubizya_1.mp3"].clone();
        soundu.play();
        e.collision.target.tl.delay(7).then(function(){
            e.collision.target.remove();
            tono.frame = 0;
        });
    });

    //==========
    // ここまで
    //==========

};

function titleStart(){// タイトル画面
    var scene = gameManager.createTitleScene();
    core.replaceScene(scene); core.pause();
    scene.on(enchant.Event.TOUCH_START, function(){gameStart();});
}

//==========
//EnchantJS
enchant();
var gameManager;
var core;
var scene;
window.onload = function(){
    gameManager = new common.GameManager();
    core = gameManager.createCore(320, 320);
    core.preload(assets);
    core.onload = function(){gameStart();};
    core.start();
};
