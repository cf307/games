/*
    // 目的:
    // シャッフルに挑戦
*/

// Main
console.log("Hello EnchantJS!!");

var assets = [
    "images/gacha_1.png",
    "images/gacha_2.png",
    "images/gacha_3.png",
    "images/gacha_4.png",
    "images/gacha_5.png",
    "images/title.png",// タイトル
    "images/b_red.png",
];

function gameStart(){// ゲーム画面
    scene = gameManager.createGameScene();
    core.replaceScene(scene); core.resume();

    //==========
    // ここから
    //==========

    scene.backgroundColor = "darkgray";

    //カード用のグループ
    var cardGroup = new Group();
    scene.addChild(cardGroup);

    //カードの作成
    makeCard(64 * 0, 100 + 80 * 0, "images/gacha_1.png", 50);
    makeCard(64 * 1, 100 + 80 * 0, "images/gacha_2.png", 50);
    makeCard(64 * 2, 100 + 80 * 0, "images/gacha_3.png", 50);
    makeCard(64 * 3, 100 + 80 * 0, "images/gacha_4.png", 50);
    makeCard(64 * 4, 100 + 80 * 0, "images/gacha_5.png", 50);

    //カード作成用 ファンクション
    function makeCard(x, y, path, point){
        // カード
        var card = new ExSprite(28, 28);
        //card.image = core.assets["images/card_base.png"];
        card.image = core.assets[path];
        card.x = x;
        card.y = y;
        cardGroup.addChild(card);
        card.scale(64 / 28, 64 / 28);
        card.originX = 0;
    }

    //シャッフル用ボタン
    var button = new ExSprite( 62 / 1, 110 / 2);
    button.image = core.assets["images/b_red.png"];
    scene.addChild(button);

    button.x = (scene.width - button.width) * 0.5;
    button.y = scene.height - button.height - 20.0;

    //ボタンを押した時
    button.addEventListener(Event.TOUCH_START, function() {
        shuffle();
    });

    //シャッフル
    function shuffle() {
        // カードグループの一番最後の添え字
        var last = cardGroup.childNodes.length - 1;

        // 繰り返し処理
        // for(初期化; 繰り返し条件; 後処理){処理}
        for(var i=last; i>0; i--){
          //scene.tl.delay(10);ここじゃだめだった覚えとして残しておく
            console.log("i", i);

            // 添え字を使ってカードを呼び出す
            var card1 = cardGroup.childNodes[i];

            // ランダムで添え字を作る
            var r = getRandom(0, i);
            console.log("r", r);
            // 添え字を使ってカードを呼び出す
            var card2 = cardGroup.childNodes[r];

            // 交換処理
            swap(card1, card2);
        }
    }

/*
    // カードを定義
    //例：5枚
    var cards = [];
    for (var i = 0; i < 5; i++) {
          cards[i] = i;//cards[0]からcards[4]
    }
    // Fisher-Yatesアルゴリズムでシャッフルする
    var n = cards.length;// n=5
    for (var i = (n-1); i > 0; i--) { // 4から1まで
        var r = Math.floor(Math.random()*(i+1)); // ---(*1) // この部分は0からi
(0~10で得たい場合は、*11と指定するらしい）
        var tmp = cards[i];
        cards[i] = cards[r];
        cards[r] = tmp;
    }
*/

    //二つのカードの位置(x, y)を入れ替える
    function swap(card2, card1) {
        //scene.tl.delay(20); //ここにしないといけなかった
        scene.tl.then(function() {
            // card2の位置をtmpとして記録しておきます・・①
            var tmpX = card2.x;
            var tmpY = card2.y;

            // card2の位置をcard1の座標にする(この時点でcard2の座標がcard1の座標に上書きされてしまうので、①が必要でした)
            //card2.x = card1.x;
            //card2.y = card1.y;
            // 動きをつけて入れ替える
            card2.tl.moveTo(card1.x, card1.y, 8);
            // 上下にも動かしたい
            card2.tl.and().moveBy(0, -20, 8);
            card2.tl.then(function(){
                card2.tl.moveTo(card2.x, 100, 4); // card1.xにしたらダメ
            });

            // card1は、忘れないように記憶しておいた、tmpです
            //card1.x = tmpX;
            //card1.y = tmpY;
            //　動きをつけて入れ替える
            card2.tl.then(function(){
                card1.tl.moveTo(tmpX, tmpY, 8);
                // 上下にも動かしたい
                card1.tl.and();
                card1.tl.moveBy(0, -20, 8);
                card1.tl.then(function(){
                    card1.tl.moveTo(card1.x, 100, 4);
                });
            });
        });
        scene.tl.delay(24); //ここにしないといけなかった
    }
    
    //==========
    // ここまで
    //==========
}

function getRandom(start, end) {
    return start + Math.floor( Math.random() * (end - start + 1));
}

function titleStart(){// タイトル画面
    var scene = gameManager.createTitleScene();
    core.replaceScene(scene); core.pause();
    scene.on(enchant.Event.TOUCH_START, function(){gameStart();});
}

//==========
// EnchantJS
enchant();
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
