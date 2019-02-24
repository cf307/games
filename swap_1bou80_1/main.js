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

    //シャッフル用ボタン
    var button = new ExSprite( 62 / 1, 110 / 2);
    button.image = core.assets["images/b_red.png"];
    scene.addChild(button);

    button.x = (scene.width - button.width) * 0.5;
    button.y = scene.height - button.height - 20.0;

    //ボタンを押した時
    button.addEventListener(Event.TOUCH_START, function() {
        //shuffle();
        shuffleBar();
        //shuffleBar2();//上の段一緒にやったのでいらなかった
    });

    // たくさんでやってみたい
    // barグループ
    var barGroup = new Group();
    scene.addChild(barGroup);
    // bar
    var bars = new Array();
    for (var i=0; i<80; i++){
      // bar
      var bar = new ExSprite(1, 64);
      bar.y = 240 - 32;
      bar.x = 0 + ((i % 80) * 4); // ~個を~~の間隔で
      bar.backgroundColor = "blue";
      barGroup.addChild(bar);
      bars.push(bar);
    }

    // barのシャッフル
    function shuffleBar() {
        // barグループの一番最後の添え字
        var last = barGroup.childNodes.length - 1;
        // 繰り返し処理
        // for(初期化; 繰り返し条件; 後処理){処理}
        for(var i=last; i>=0; i--){
          //scene.tl.delay(10);ここじゃだめだった覚えとして残しておく
            console.log("bari", i);
            // 添え字を使ってbarを呼び出す
            var bar1 = barGroup.childNodes[i];
            // ランダムで添え字を作る
            var br = getRandom(0, i);
            console.log("br", br);
            // 添え字を使ってbarを呼び出す
            var bar2 = barGroup.childNodes[br];
            // 交換処理
            barswap(bar1, bar2);
            //bars[i].backgroundColor = "red";ここじゃあかん
            // 順序を上書きする(9/14加筆)配列と同じやり方にするため
            var tmp = barGroup.childNodes[i];
            barGroup.childNodes[i] = barGroup.childNodes[br];
            barGroup.childNodes[br] = tmp;
            // 同じ動きにする為に上の段のもここに入れる
            console.log("bar2i", i);
            // 添え字を使ってbarを呼び出す
            var bar12 = bar2Group.childNodes[i];
            // ランダムで添え字を作る
            //var br = getRandom(0, i);
            console.log("br2", br);
            // 添え字を使ってbarを呼び出す
            var bar22 = bar2Group.childNodes[br];
            // 交換処理
            barswap2(bar12, bar22);
            // 順序を上書きする(9/14加筆)配列と同じやり方にするため
            var tmp2 = bar2Group.childNodes[i];
            bar2Group.childNodes[i] = bar2Group.childNodes[br];
            bar2Group.childNodes[br] = tmp2;
        }
    }

    // bar1とbar2を入れ替える
    function barswap(bar2, bar1) {// 逆にしたほうがわかりやすい
        //scene.tl.delay(20); //ここにしないといけなかった
        scene.tl.then(function() {
            // card2の位置をtmpとして記録しておきます・・①
            var tmpX = bar2.x;
            var tmpY = bar2.y;
            // card2の位置をcard1の座標にする(この時点でcard2の座標がcard1の座標に上書きされてしまうので、①が必要でした)
            //card2.x = card1.x;
            //card2.y = card1.y;
            // 動きをつけて入れ替える
            bar2.tl.moveTo(bar1.x, bar1.y, 4);
            // 上下にも動かしたい
            bar2.tl.and().moveBy(0, -20, 4);
            bar2.tl.then(function(){
                bar2.tl.moveTo(bar2.x, 240 - 32, 2); // card1.xにしたらダメ
                //bar2.backgroundColor = "red";//入れ替えたことによりここもこちらに変更
            });
            // card1は、忘れないように記憶しておいた、tmpです
            //card1.x = tmpX;
            //card1.y = tmpY;
            // 動きをつけて入れ替える
            bar2.tl.then(function(){
                bar1.tl.moveTo(tmpX, tmpY, 4);
                // 上下にも動かしたい
                bar1.tl.and();
                bar1.tl.moveBy(0, -20, 4);
                bar1.tl.then(function(){
                    bar1.tl.moveTo(bar1.x, 240 - 32, 2);
                    // 入れ替わったら色を変える
                    bar1.backgroundColor = "red";
                });
            });
        });
        scene.tl.delay(10); //ここにしないといけなかった
    }

    // もういっちょ！ばらけ具合を観察したい
    // bar2グループ
    var bar2Group = new Group();
    scene.addChild(bar2Group);
    // bar
    var bars2 = new Array();
    for (var i=0; i<80; i++){
      // bar
      var bar = new ExSprite(1, 64);
      bar.y = 120 - 32;
      bar.x = 0 + ((i % 80) * 4); // ~個を~~の間隔で
      //bar.backgroundColor = "#990000";
      bar2Group.addChild(bar);
      bars2.push(bar);
      if(i<10){
          bars2[i].backgroundColor = "#ff0000";
      }else if(i<20){
          bars2[i].backgroundColor = "#ffa500";
      }else if(i<30){
          bars2[i].backgroundColor = "#ffff00";
      }else if(i<40){
          bars2[i].backgroundColor = "#008000";
      }else if(i<50){
          bars2[i].backgroundColor = "#00ffff";
      }else if(i<60){
          bars2[i].backgroundColor = "#0000ff";
      }else if(i<70){
          bars2[i].backgroundColor = "#800080";
      }else if(i<80){
          bars2[i].backgroundColor = "white";
      }
    }

    // bar1とbar2を入れ替える
    function barswap2(bar22, bar12) {// ここも逆にすることで後ろから交換
        button.tl.then(function() {
            // card2の位置をtmpとして記録しておきます・・①
            var tmpX2 = bar22.x;
            var tmpY2 = bar22.y;
            // card2の位置をcard1の座標にする(この時点でcard2の座標がcard1の座標に上書きされてしまうので、①が必要でした)
            //card2.x = card1.x;
            //card2.y = card1.y;
            // 動きをつけて入れ替える
            bar22.tl.moveTo(bar12.x, bar12.y, 4);
            // 上下にも動かしたい
            bar22.tl.and().moveBy(0, -20, 4);
            bar22.tl.then(function(){
                bar22.tl.moveTo(bar22.x, 120 - 32, 2); // card1.xにしたらダメ
            });
            // card1は、忘れないように記憶しておいた、tmpです
            //card1.x = tmpX;
            //card1.y = tmpY;
            // 動きをつけて入れ替える
            bar22.tl.then(function(){
                bar12.tl.moveTo(tmpX2, tmpY2, 4);
                // 上下にも動かしたい
                bar12.tl.and();
                bar12.tl.moveBy(0, -20, 4);
                bar12.tl.then(function(){
                    bar12.tl.moveTo(bar12.x, 120 - 32, 2);
                    // 入れ替わったら色を変える
                    //bar12.backgroundColor = "red";
                });
            });
        });
        button.tl.delay(10); //ここにしないといけなかった
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
