var assets = [
    "images/title.png",// タイトル
];

function gameStart(){
    var scene = new Scene();
    core.replaceScene(scene); core.resume();

    //==========
    // ここから
    //==========

    // 背景
    scene.backgroundColor = "green";

    // 日付データの取得
    var now = new Date();
    console.log(now);
    var hour = now.getHours();
    console.log(hour);
    var minute = now.getMinutes();
    console.log(minute);
    var second = now.getSeconds();
    var centerX = scene.width  / 2;
    var centerY = scene.height / 2;

    // 目盛りのクラス
    for(var i = 0; i <= 60; i++){
        var Dials = Class.create(Sprite, {
            initialize: function (height, Bcolor) {
               Sprite.call(this, 2,height);
               this.backgroundColor = Bcolor;
               this.x = centerX + 2 / 2;
               this.y = centerY - 30;
               this.originX = 1;
               this.originY = 30;
               scene.addChild(this);
            }
        });
        var dials1 = new Dials(140, "red");
        dials1.backgroundColor = i % 5 == 0 ? "red" : "black";
        var dials2 = new Dials(120, "green");
        dials1.tl.rotateTo(i * 6, 64);
        dials2.tl.rotateTo(i * 6, 64);
        console.log(i*6);
        //var razian = i * 6 /180 * Math.PI;
        //console.log(Math.sin(razian),  Math.cos(razian));
        //dial.moveBy(this.height * Math.cos(razian), this.height * Math.sin(razian), 32)
        }

    //針のクラス
    var Hands = Class.create(Sprite, {
        initialize: function(length, thick, unit){
            Sprite.call(this, thick,length);
            this.x = centerX + this.width / 2;
            this.y = centerY - this.height;
            this.originY = this.height;
            this.originX = this.width / 2;
            //取得した時間に合わせて角度を初期化
            if(unit == hour){
                this.rotate(unit * 30 + 30 / 60 * minute);// 分×30/60だけ分針も進める
                console.log(unit, this.rotation, hour);
                if(unit >= 12){
                    this.unit = unit - 12;
                }
            }else{
                if(unit == minute){
                    this.rotate(unit * 6 + second * 6 / 60);
                }else{
                    this.rotate(unit * 6);
                    this.unit =  unit;
                    console.log(this.unit);
                }
            }
            this.backgroundColor = "black";
            scene.addChild(this);
        },
        move:function(speed){
            var angle = 6 / speed;
            //針をすすめる
            this.tl.rotateBy(angle, 0);
        }
            //今の時刻に合わせて角度を初期化
            /*
            this.rotate(unit * speed);
            this.tl.then(function(){
                console.log(unit, minute);
            });
            this.tl.rotateTo(unit * speed, 0);
            this.tl.delay(16);
            this.tl.loop();
            */
    });

    //var Mhand = new Hands(60,5,minute,60);
    //console.log(Mhand.x);

    var Shand = new Hands(100,2,second);
    var Mhand = new Hands(70,2,minute);
    var Hhand = new Hands(50,2,hour);

    //デジタル時計（時間）
    var Hlabel = new Label(hour + ":");
    Hlabel.color = 'black';
    Hlabel.font = "30px 'PixelMplus10'";
    Hlabel.x = 125;
    Hlabel.y = 400;
    scene.addChild(Hlabel);

    var Mlabel = new Label(minute);
    Mlabel.color = 'black';
    Mlabel.font = "30px 'PixelMplus10'";
    Mlabel.x = 170;
    Mlabel.y = 400;
    scene.addChild(Mlabel);

    setInterval(function(){
        var now = new Date();
        var second = now.getSeconds();
        var hour = now.getHours();
        var minute = now.getMinutes();
        Shand.move(1);
        Mhand.move(60);
        Hhand.move(3600 / 5);
        //デジタル時計の表示も更新
        Hlabel.text = hour + ":";
        if(minute < 10){
            Mlabel.text = "0" + minute;
        }else{
            Mlabel.text = minute;
        }
        console.log(minute);
    },1000);

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
