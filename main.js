var assets = [
    "images/title.png",// タイトル
    "images/donut01.png",
    "images/donut02.png",
    "images/donut03.png",
    "images/donut04.png",
    "images/gameoverao.png",
    "images/gameclear.png",
    "sounds/correct1.mp3",
    "sounds/incorrect1.mp3",
    "sounds/card-turn-over1.mp3",
];

/*
・functionをつかってキャラを作った時に、グループのなかでどうやって区別すればいいの忘れていた→
charaGroup.childNodes[1]でできることを思い出して解決

・繰り返し遊びたいのだが、
しかしイベントリスナ（タッチ）を繰り返すと繰り返すたびに重複してタッチが起こってしまうので、イベントリスナをその都度削除しようと思ったが調べても書き方がわからなくてできなかったので、タッチはfunctionの外に出して繰り返さないようにして、当たりの場合は判定用の四角を被せてそれをその都度消すやり方でやった。削除の書き方は？

・間違えたらゲームオーバー
*/

function gameStart(){
    var scene = new Scene();
    core.replaceScene(scene); core.resume();

    //==========
    // ここから
    //==========

    scene.backgroundColor = "#fff3b8";
    scene.backgroundColor = "blue";

    // スコア
    var score = 0;
    scoreLabel = new Label('SCORE : 0');
    scene.addChild(scoreLabel);
    scoreLabel.x = 10;
    scoreLabel.y = 5;
    scoreLabel.color = 'yellow';
    scoreLabel.font = "32px 'PixelMplus10'";

    // 左の白い枠
    var card1 = new Sprite(100, 48);
    card1.backgroundColor = "white";
    card1.x = 320 / 4 - card1.width / 2;
    card1.y = 320 / 4 - card1.height / 2 + 50;
    scene.addChild(card1);

    // 右の黒い枠
    var card2 = new Sprite(100, 48);
    card2.backgroundColor = "black";
    card2.x = 320 / 4  * 3 - card1.width / 2;
    card2.y = 320 / 4 - card1.height / 2 + 50;
    scene.addChild(card2);

    // キャラ用のグループ
    var charaGroup = new Group();
    scene.addChild(charaGroup);

    // キャラ作成のfunction
    function makeChara(x, y, path){
        // キャラ
        var chara = new Sprite(64, 64);
        chara.image = core.assets[path];
        chara.x = x;
        chara.y = y;
        charaGroup.addChild(chara);
        chara.originX = 0;
    }

    // キャラ四天王の出現
    makeChara(40 * 1 - 32, 200, "images/donut01.png");// 320 / 8 = 40なので
    makeChara(40 * 3 - 32, 200, "images/donut02.png");
    makeChara(40 * 5 - 32, 200, "images/donut03.png");
    makeChara(40 * 7 - 32, 200, "images/donut04.png");

/*
    // りんご
    var chara1 = new Sprite(64, 64);
    chara1.image = core.assets["images/donut01.png"];
    chara1.x = 40 * 1 - 32;
    chara1.y = 200;
    chara1.tag = "りんご";
    scene.addChild(chara1);
    //chara1.originX = 0;

    // にんじん
    var chara2 = new Sprite(64, 64);
    chara2.image = core.assets["images/donut02.png"];
    chara2.x = 40 * 3 - 32;
    chara2.y = 200;
    chara2.tag = "にんじん";
    scene.addChild(chara2);
    //chara2.originX = 0;

    // きゅうり
    var chara3 = new Sprite(64, 64);
    chara3.image = core.assets["images/donut03.png"];
    chara3.x = 40 * 5 - 32;
    chara3.y = 200;
    chara3.tag = "りんご";
    scene.addChild(chara3);
    //chara3.originX = 0;

    // ぶどう
    var chara4 = new Sprite(64, 64);
    chara4.image = core.assets["images/donut04.png"];
    chara4.x = 40 * 7 - 32;
    chara4.y = 200;
    chara4.tag = "りんご";
    scene.addChild(chara4);
    //chara4.originX = 0;
*/
    // VegetablesかFruitのラベル
    var vf = new Label();
    vf.y = card1.y + 5;// 9leapでは少し上にずれる
    vf.color = 'black';
    vf.font = "18px 'PixelMplus10'";
    // 切り替えるためのfunction
    function VorF(vegeorfru, x){// VegetableとFruitの文字数が違うので中心になるようにxを変数にして調整する
        scene.addChild(vf);
        vf.x = x;
        vf.text = vegeorfru;
    }
    // テスト用
    //VorF("Vegetable",card1.x + 50 - 18 * 9 / 4);
    //VorF("Fruit", card1.x + 50 - 18 * 5 / 4);

    // WingかMuscleのラベルも同じように作る
    var wm = new Label();
    wm.y = card2.y + 5;
    wm.color = 'white';
    wm.font = "18px 'PixelMplus10'";
    // 切り替えるためのfunction
    function WorM(wingormus, x){
        scene.addChild(wm);
        wm.x = x;
        wm.text = wingormus;
    }
    // テスト用
    //WorM("Wing", card2.x + 50 - 18 * 4 / 4);
    //WorM("Muscle", card2.x + 50 - 18 * 6 / 4);

    /* 失敗例（消せないのでできなかった）
    function Vege(){
        var vege = new Label("Vegetable");
        labelGroup.addChild(vege);
        vege.x = card1.x + 50 - 18 * 9 / 4;// 中心にくるように調整（９文字）
        vege.y = card1.y + 15;
        vege.color = 'black';
        vege.font = "18px 'PixelMplus10'";
        vage.text = "Vegetable";
    }
    // Fruitのラベル
    function Fru(){
        var fru = new Label("fruit");
        labelGroup.addChild(fru);
        fru.x = card1.x + 50 - 18 * 5 / 4;// ５文字なので
        fru.y = card1.y + 15;
        fru.color = 'black';
        fru.font = "18px 'PixelMplus10'";
    }
    // Wingのラベル
    function Wing(){
        var wing = new Label("Wing");
        labelGroup.addChild(wing);
        wing.x = card2.x + 50 - 18 * 4 / 4;// 4文字
        wing.y = card2.y + 15;
        wing.color = 'white';
        wing.font = "18px 'PixelMplus10'";
    }
    // Muscleのラベル
    function Mus(){
        var mus = new Label("Muscle");
        labelGroup.addChild(mus);
        mus.x = card2.x + 50 - 18 * 6 / 4;// ６文字なので
        mus.y = card2.y + 15;
        mus.color = 'white';
        mus.font = "18px 'PixelMplus10'";
    }
    */

    // カウント（３，２，１）
    var count = 3;
    var countLabel = new Label(count);
    countLabel.color = 'white';
    countLabel.font = "64px 'PixelMplus10'";
    countLabel.y = 130;
    countLabel.width = 320;
    countLabel.textAlign = "center";
    scene.addChild(countLabel);
    countLabel.tl.setTimeBased();
    countLabel.tl.delay(1000);
    countLabel.tl.then(function() {
        count -= 1;
        countLabel.text = count;
        // ０になったら
        if(count <= 0){
            countLabel.remove();
            // ゲームスタート
            Game();
            // キャラをタッチしたら不正解（functionに入れると何度も判定が起こってしまうので入れない）
            charaGroup.addEventListener('touchstart',function(e){
                console.log("不正解");
                // 音
                var sound1 = core.assets["sounds/incorrect1.mp3"].clone();
                sound1.play();
                // 不正解ならゲームオーバー
                core.end(score, '得点：' + score);
                // ゲームオーバーのSprite
                var over = new Sprite(189, 97);
                over.image = core.assets["images/gameoverao.png"];
                over.x = scene.width / 2 - over.width / 2;
                over.y = scene.height / 2 - over.height / 2;
                scene.addChild(over);
            });
            // 時間のスタート
            Time();
            // スタートのラベル
            var sta = new Label("start");
            scene.addChild(sta);
            sta.x = 160 - 55// ５文字なので
            sta.y = 150;
            sta.color = 'white';
            sta.font = "48px 'PixelMplus10'";
            sta.tl.delay(5).then(function(){
                sta.remove();
            })
        }
    });
    countLabel.tl.loop();

    // ゲームスタート
    //ランダムで左はVegetableかFruit,右はWingかMuscleのラベルを出す
    function Game(){
        //ランダムで左はVegetableかFruit
        var vorf = getRandom(0,1);
        if(vorf == 0){
            // ０のときはVegetableと出す
            VorF("Vegetable<br> やさい",card1.x + 50 - 18 * 9 / 4);
        }else{
            // それ以外（１のとき）はFruitと出す
            VorF("  Fruit<br>くだもの", card1.x + 50 - 18 * 5 / 4 - 18);
        }
        console.log("vorf",vorf);
        //ランダムで右はWingかMuscle
        var worm = getRandom(0,1);
        if(worm == 0){
            // ０のときはWingと出す
            WorM("  Wing<br> つばさ", card2.x + 50 - 18 * 4 / 4 - 18);
        }else{
            // それ以外（１のとき）はMusと出す
            WorM(" Muscle<br>きんにく", card2.x + 50 - 18 * 6 / 4 - 9);
        }
        console.log("worm",worm);
        // 音
        var sound = core.assets["sounds/card-turn-over1.mp3"].clone();
        sound.play();
        // 判定
        Judge(vorf, worm);
    }

    // vorf 野菜：０ 果物：１
    // worm 羽根：０ 筋肉：１
    // 判定
    function Judge(vorf, worm){
        // 判定用の四角（judge）を正解のキャラにの上にかぶせる
        var judge = new Sprite(64, 64);
        //judge.backgroundColor = "red";
        judge.y = 200;
        scene.addChild(judge);
        if(vorf == 0 && worm == 0){
            //このとき正解はにんじんなのでjudgeをにんじんの上にかぶせる
            judge.x = charaGroup.childNodes[1].x;
        }
        if(vorf == 0 && worm == 1){//同様にきゅうり
            judge.x = charaGroup.childNodes[2].x;
        }
        if(vorf == 1 && worm == 0){//同様にりんご
            judge.x = charaGroup.childNodes[0].x;
        }
        if(vorf == 1 && worm == 1){//同様にぶどう
            judge.x = charaGroup.childNodes[3].x;
        }
        // ジャッジをタッチしたら正解
        judge.addEventListener('touchstart',function(e){
            console.log("正解");
            // 正解したらちょっとジャンプ
            switch(true){
                case vorf == 0 && worm == 0:charaGroup.childNodes[1].tl.moveBy(0, -40, 2);
                charaGroup.childNodes[1].tl.moveBy(0, 40, 1);
                break;
                case vorf == 0 && worm == 1:charaGroup.childNodes[2].tl.moveBy(0, -40, 2);
                charaGroup.childNodes[2].tl.moveBy(0, 40, 1);
                break;
                case vorf == 1 && worm == 0:charaGroup.childNodes[0].tl.moveBy(0, -40, 2);
                charaGroup.childNodes[0].tl.moveBy(0, 40, 1);
                break;
                case vorf == 1 && worm == 1:charaGroup.childNodes[3].tl.moveBy(0, -40, 2);
                charaGroup.childNodes[3].tl.moveBy(0, 40, 1);
                break;
            }
            // 音
            var sound0 = core.assets["sounds/correct1.mp3"].clone();
            sound0.play();
            // スコア＋１０
            score += 10;
            scoreLabel.text = 'SCORE : ' + score;
            // 正解してジャンプが終わったら次の問題
            judge.tl.delay(3).then(function(){//
                Game();
                judge.remove();// その都度消して重複しないように
            })
        });
    }
/*
    // functionに入れると何度も判定が起こってしまうので入れない
    charaGroup.addEventListener('touchstart',function(e){
        console.log("不正解");
        // 音
        var sound1 = core.assets["sounds/incorrect1.mp3"].clone();
        sound1.play();
    });
*/
/*    // 判定（失敗：キャラを直接タッチして判定しようとすると二回目以降何回もタッチされてしまうので断念）
    function Judge(vorf, worm){
        charaTouch(chara2, vorf, worm, 0, 0, "にんじん");
        charaTouch(chara1, vorf, worm, 1, 0, "りんご");
        charaTouch(chara3, vorf, worm, 0, 1, "きゅうり");
        charaTouch(chara4, vorf, worm, 1, 1, "ぶどう");
    }

    // それぞれのキャラをタッチしたときの正解・不正解
    function charaTouch(x, vorf, worm, v, w, y){
        x.addEventListener('touchstart',function(e){
            //x.removeEventListener(Event.TOUCH_START);
            console.log("キャラにタッチ");
            console.log("vorf,worm", vorf,worm);
            console.log("v,w", v, w);
            // 正解になるのは
            if(vorf == v && worm == w ){
                console.log(y + "で正解");
                // ちょっとジャンプ
                x.tl.moveBy(0, -20, 1);
                // 音
                var sound0 = core.assets["sounds/correct1.mp3"].clone();
                sound0.play();
                // スコア＋１０
                score += 10;
                scoreLabel.text = 'SCORE : ' + score;
                // 得点のセーブ
                // 次の問題へ
                x.tl.delay(10).then(function(){
                    // 位置を戻す
                    x.tl.moveBy(0, 20, 1);
                    vorf = null;
                    worm = null;
                    Game();

                });
            // それ以外は不正解になるから
            }else{
                console.log("不正解")
                // 音
                var sound1 = core.assets["sounds/incorrect1.mp3"].clone();
                sound1.play();
            }
        });
    }

    /*↑functionを使わないならこういうの↓を４個書けばよい
    // 正解をタッチしたら
    chara2.addEventListener(Event.TOUCH_START,function(e){
        console.log("タッチ");
        console.log(vorf,worm);
        if(vorf == 0 && worm == 0){//野菜かつ翼→にんじん
            console.log("にんじんで正解");
        }else{
            console.log("不正解")
        }
    });
    */

    // 時間の表示
    var score1 = 60;// 秒
    var scoreLabel1 = new Label(60);
    scoreLabel1.color = 'red';
    scoreLabel1.font = "32px 'PixelMplus10'";
    scoreLabel1.x = 320 - 48 * 4 - 10;
    scoreLabel1.y = 5;
    scoreLabel1.width = 320;
    scoreLabel1.textAlign = "center";
    scene.addChild(scoreLabel1);
    // ６０からカウントしていく
    function Time(){
        scoreLabel1.tl.setTimeBased();
        scoreLabel1.tl.delay(100);
        scoreLabel1.tl.then(function() {
            score1 -= 0.1;
            scoreLabel1.text = score1.toFixed(1);
            // ０になったらゲーム終了
            if(score1 < 0.0){ //
                scoreLabel1.text = "0.0";// -0.0と表示されてしまうから
                scoreLabel1.tl.clear();
                // ゲームクリアのSprite
                var clear = new Sprite(230, 32);
                clear.image = core.assets["images/gameclear.png"];
                clear.x = scene.width / 2 - clear.width / 2;
                clear.y = scene.height / 2 - clear.height / 2;
                scene.addChild(clear);
                // 得点のセーブと表示
                core.end(score, '得点：' + score);
            }
        });
        scoreLabel1.tl.loop();
    }

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
    //core.onload = function(){titleStart();};
    core.onload = function(){gameStart();};
    core.start();
};
