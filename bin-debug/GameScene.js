var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * Create by hardy on 16/12/21
 * 主游戏场景
 */
var GameScene = (function (_super) {
    __extends(GameScene, _super);
    function GameScene() {
        var _this = _super.call(this) || this;
        _this.btouch = false;
        return _this;
    }
    GameScene.prototype.init = function () {
        BGMPlayer._i().play(SoundName.gamebgm); //背景音乐
        this.intervalarr = [];
        this.initdata();
        this.showbg();
        this.addtouch();
        this.bindkeyboard();
        this.gameinterval();
        this.addfightscene();
    };
    /**
     * 初始化数据
     */
    GameScene.prototype.initdata = function () {
        GameData._i().GameOver = false;
        GameData._i().GameScore = 0;
        GameData._i().GameLevel = 1;
    };
    /**
     * 显示背景
     */
    GameScene.prototype.showbg = function () {
        var gamebg = new MyBitmap(RES.getRes('endBG_png'), 0, 0);
        gamebg.setanchorOff(0, 0);
        gamebg.width = this.mStageW;
        gamebg.height = this.mStageH;
        this.addChild(gamebg);
        var gamebg = new MyBitmap(RES.getRes('topgamebg_png'), 0, 150);
        gamebg.setanchorOff(0, 0);
        gamebg.width = this.mStageW;
        gamebg.height = this.mStageH / 4;
        this.addChild(gamebg);
        //this.addChild(GameScore._i());
    };
    GameScene.prototype.addfightscene = function () {
        this.diamondfightscene = new DiamodFightScene();
        this.addChild(this.diamondfightscene);
        this.fighterpanel = new FighterPanel();
        this.addChild(this.fighterpanel);
    };
    /**
     * 游戏定时器
     */
    GameScene.prototype.gameinterval = function () {
        GameUtil.trace('interval');
    };
    /**
     * 绑定键盘事件
     */
    GameScene.prototype.bindkeyboard = function () {
        if (!GameConfig.IsBindKeyboard) {
            return;
        }
        KeyBoard._i().bindfun(this, this.keyup, KEYCODE.UP);
        KeyBoard._i().bindfun(this, this.keydown, KEYCODE.DOWN);
        KeyBoard._i().bindfun(this, this.keyleft, KEYCODE.LEFT);
        KeyBoard._i().bindfun(this, this.keyright, KEYCODE.RIGHT);
        KeyBoard._i().bindfun(this, this.keyspace, KEYCODE.SPACE);
    };
    /**
     * 检查游戏是否结束
     */
    GameScene.prototype.checkgameover = function () {
        var bgameover = false;
        if (bgameover) {
            this.gameover();
        }
    };
    /**
     * 触摸层
     */
    GameScene.prototype.addtouch = function () {
        var touchshap = GameUtil.createRect(0, 0, this.mStageW, this.mStageH, 0);
        this.addChild(touchshap);
        touchshap.$setTouchEnabled(true);
        // touchshap.addEventListener(egret.TouchEvent.TOUCH_TAP, (e: egret.TouchEvent) => {
        //     if (GameData._i().GameOver) {
        //         return;
        //     }
        // }, this);
        // touchshap.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.touchbegin, this);
        // touchshap.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.touchmove, this);
        // touchshap.addEventListener(egret.TouchEvent.TOUCH_END, this.touchend, this);
        // touchshap.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.touchout, this);
    };
    GameScene.prototype.touchbegin = function (e) {
        if (GameData._i().GameOver) {
            return;
        }
        this.btouch = true;
    };
    GameScene.prototype.touchmove = function (e) {
        if (this.btouch) {
        }
    };
    GameScene.prototype.touchend = function (e) {
        if (this.btouch) {
            this.btouch = false;
        }
    };
    GameScene.prototype.touchout = function (e) {
        if (this.btouch) {
            this.btouch = false;
        }
    };
    /**
     * 游戏结束
     */
    GameScene.prototype.gameover = function () {
        console.log("GameOver");
        this.clearinter();
        GameData._i().GameOver = true;
        this.addChild(new GameOverPageShow());
    };
    /**
     *下一关
     */
    GameScene.prototype.nextlevelgame = function () {
    };
    /**
     * 重置游戏数据
     */
    GameScene.prototype.reset = function () {
        this.gameinterval();
        this.restart();
    };
    /**
     * 清除定时器
     */
    GameScene.prototype.clearinter = function () {
        GameUtil.clearinterval(this.intervalarr);
    };
    /**
     * 退出游戏，回到开始界面
     */
    GameScene.prototype.exitgame = function () {
        GameUtil.GameScene.runscene(new StartGameScene());
    };
    /**
     * 重新开始游戏
     */
    GameScene.prototype.restart = function () {
    };
    /**
     * 需要绑定的键盘事件
     */
    GameScene.prototype.keydown = function () {
    };
    GameScene.prototype.keyleft = function () {
    };
    GameScene.prototype.keyright = function () {
    };
    GameScene.prototype.keyup = function () {
    };
    GameScene.prototype.keyspace = function () {
        //GameData._i().GamePause = !GameData._i().GamePause;
    };
    return GameScene;
}(GameUtil.BassPanel));
__reflect(GameScene.prototype, "GameScene");
//# sourceMappingURL=GameScene.js.map