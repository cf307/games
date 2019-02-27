var assets = [
    "images/title.png",// タイトル
];

function gameStart(){
    var scene = new Scene();
    core.replaceScene(scene); core.resume();

    //==========
    // ここから
    //==========

    scene.backgroundColor = "pink";

    //nをはじめの数とする15個の数字のシャッフルを作る関数
    function Nums15(n){
        var nums15 = [];// 15個の配列の入れ物を用意
        for (var i=n; i<n+15; i++){
            nums15.push(i);// n~n+15までの数を[]に入れる
        }
        //console.log("nums15:", nums15);
        // シャッフル
        for (var i=nums15.length-1; 0<i; i--){
            var rdm = getRandom(0, i);
            var tmp = nums15[i];
            nums15[i] = nums15[rdm];
            nums15[rdm] = tmp;
        }
        console.log("nums15:", nums15);
        // 出来たランダムな配列nums15から5つの数字を取り出してnumsselという配列に入れていく。
        for(var i=0; i<5; i++){
            numssel.push(nums15[i]);// 最初から５つをnumsselに入れていく
        }
    }

    // 目的の配列を用意
    var numssel = [];

    // 実行。ここでnumsselが最終的に5*5で25個となる
    for(var i=1; i<76; i+=15){
        Nums15(i);
    }
    console.log("numssel:", numssel);
    console.log("numssel[12]:", numssel[12]);// 真ん中はmussel[12]
    // 真ん中はFREEにする
    numssel[12] = "free";

    // インデックス
    var index = 0;

    // ラベルグループ
    var labelGroup = new Group();
    scene.addChild(labelGroup);

    // ビンゴカードを作る
    // 二重のfor文(c0,c1,c2,c3,c4を５回繰り返す)
    for(var r=0; r<5; r++){
        console.log("r" + r);//r0~r4
        for(var c=0; c<5; c++){
            console.log("  c" + c);
            // 座標に応用
            var x = 320 / 5 * r;// 授業とはrとcが逆（列と行を逆にしたいから）
            var y = 320 / 5 * c;
            console.log(x + ", " + y);
            // ラベル
            var label = new Label();
            label.x = x + 20;
            label.y = y + 100;
            //label.text = "[" + r +","+ c +"]";// こちらも逆にする(これで[列、行]の並びになる)
            label.text = numssel[index];// ここをnumからnumsselに書き換えて
            index++;// ラベルのテキストがnums[0]からnums[24]になる
            console.log("index:",index);
            labelGroup.addChild(label);
            label.font = "24px 'PixelMplus10'";
        }
    }
/*
    // タッチイベントの試行錯誤
    for(var n=0; n<24; n++){
        labelGroup.childNodes[n].addEventListener(Event.TOUCH_START, function(e){
            console.log("タッチされました");
            labelGroup.childNodes[n].color = "red";
            console.log(labelGroup.childNodes[n].text);
        });
    }
    // これだと、labelGroup.childNodes[n]が上書きされて常にn=25となるのか、何をタッチしても２５番目の数字が赤くなってしまいました。タッチしたものだけの色を変えたいので、工夫が必要です。そこで一個でやってみます。
    // 一つでタッチイベントを作って試してみる
    labelGroup.childNodes[1].addEventListener(Event.TOUCH_START, function(e){
        console.log("タッチされました");
        labelGroup.childNodes[1].color = "red";
        console.log(labelGroup.childNodes[1].text);
    });
    //例えばこれ↑で試すとlabelGroup.childNodes[1]だけが赤くなってOKです。これをfunctionにして25個作ればうまくいくかもしれません。
*/
    function nTouch(n){
        labelGroup.childNodes[n].t = 0;// 初期値（黒）
        labelGroup.childNodes[n].addEventListener(Event.TOUCH_START, function(){
            if(labelGroup.childNodes[n].t != 1){
                labelGroup.childNodes[n].t = 1;//(１は赤）
                labelGroup.childNodes[n].color = "red";
                console.log(labelGroup.childNodes[n].text);
            }else{
                labelGroup.childNodes[n].t = 0;// 黒は０に戻す
                labelGroup.childNodes[n].color = "black";
            }
        });
    }
    // テスト用
    //nTouch(1);// 成功！
    // 成功したので２５個分作る
    for(var n=0; n<25; n++){
        nTouch(n);
    }
    //うまくいきました！すごい、天才。(さらに、再度タッチしたときに黒く戻すために、labelGroup.childNodes[n].nuというプロパティを作って、分岐させました。)

    // 説明
    var setumei = new Label();
    setumei.x = 20;
    setumei.y = 420;
    setumei.color = "blue";
    setumei.font = "18px 'PixelMplus10'";
    setumei.text = "数字をタッチすると赤くなります<br>　　　 再度タッチで戻る";
    scene.addChild(setumei);

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
    core = gameManager.createCore(320, 480);
    core.preload(assets);
    core.onload = function(){titleStart();};
    core.start();
};
