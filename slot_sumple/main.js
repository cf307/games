var assets = [
    "sounds/bubble-burst1.mp3",
    "sounds/incorrect2.mp3",
    "sounds/trumpet1copy.mp3",
    "sounds/drum-roll1.mp3",
    "sounds/maou_chime11.mp3",
    "sounds/no.mp3",
    "images/fruits.png",
    "images/b_red.png",
    "images/po_gameclear.png",
    "images/title.png",// タイトル
];

function gameStart(){
    var scene = new Scene();
    core.replaceScene(scene); core.resume();

    //==========
    // ここから
    //==========

    scene.backgroundColor = "skyblue";

    //配列を用意する
    var nums = [0, 0, 0];

    // ドラムロール
    var drum = core.assets["sounds/drum-roll1.mp3"].clone();
    // ハズレの音
    var sin = core.assets["sounds/no.mp3"].clone();
    // ピンポン
    var pin = core.assets["sounds/maou_chime11.mp3"].clone();

    // 絵を対応させる
    //スロット左
    var slotL = new ExSprite(32,32);
    slotL.image = core.assets["images/fruits.png"];
    slotL.x = 160 - 32 - 16;
    slotL.y = 150;
    slotL.frame = nums[0];
    scene.addChild(slotL);

    //スロット中
    var slotC = new ExSprite(32,32);
    slotC.image = core.assets["images/fruits.png"];
    slotC.x = slotL.x + 32;
    slotC.y = 150;
    slotC.frame = nums[1];
    scene.addChild(slotC);

    //スロット右
    var slotR = new ExSprite(32,32);
    slotR.image = core.assets["images/fruits.png"];
    slotR.x = slotL.x + 32 * 2;
    slotR.y = 150;
    slotR.frame = nums[2];
    scene.addChild(slotR);

    // ラベル
    var label = new Label("x");
    label.x = 60;
    label.y = 240;
    label.color = "red";
    label.font = "30px 'PixelMplus10'";
    //scene.addChild(label);

    // タッチ不可用の画面
    var backi = new ExSprite(320, 480);
    //backi.backgroundColor = "red";
    scene.addChild(backi);

    // タッチでスタート
    backi.addEventListener(Event.TOUCH_START, function(){
        // タッチ不可にする
        backi.touchEnabled = false;
        // ドラムロール再生
        drum.play();
        console.log("touch");
        // 繰り返し実行されるタイマー（0.1秒毎にroll()という関数が繰り返し実行される）
        var tSlot = setInterval(function(){
            roll();
            console.log("tSlot");
        }, 100);
        // 一度だけ実行されるタイマー（2秒経ったら実行）
        setTimeout(function(){
            clearInterval(tSlot);// setIntervalを止める
            judge();
        }, 1000*2);
        // ラベルをなしに戻す
        label.remove();
        // 背景を戻す
        scene.backgroundColor = "skyblue";
    });

    // 回転の関数（1~3の間でランダムに数を３つ抽出する）
    function roll(){
        console.clear();
        for (var i=0; i<nums.length; i++){// 配列の要素の数だけ繰り返す
            nums[i] = getRandom(1, 3);// 1~3の間でランダムな数を選ぶ
        }
        console.log(nums);// 30回点滅することになる
        // 絵のフレームと対応させる
        slotL.frame = nums[0];
        slotC.frame = nums[1];
        slotR.frame = nums[2];
    }

    // 判定
    function judge(){
        // ラベルを出す
        scene.addChild(label);
        // ドラムを消す
        drum.stop();
        // 当たりの判定
        if(nums[0] == nums[1] && nums[0] == nums[2]){
            console.log("ATARI!!(^o^)");
            // 当たりのときのラベル
            label.text = "ATARI!!(^o^)";
            label.color = "red";
            label.x = 80;
            // 背景を変える
            scene.backgroundColor = "#F7D358";
            // 当たりの音を追加
            pin.play();
        }else{
            console.log("HAZURE!!(*_*;)");
            label.text = "HAZURE!!(*_*;)";
            label.color = "blue";
            //sin.play();// バグるのでなし
        }
        // タッチ可に戻す
        backi.touchEnabled = true;
    }

    //==========
    // ここまで
    //==========

};

function getRandom(start, end) {
    return start + Math.floor( Math.random() * (end - start + 1));
}

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
    core = gameManager.createCore(320, 480);
    core.preload(assets);
    core.onload = function(){titleStart();};
    core.start();
};
