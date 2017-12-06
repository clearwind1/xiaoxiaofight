/**
 * Created by pior on 15/9/30.
 */
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
var FighterPanel = (function (_super) {
    __extends(FighterPanel, _super);
    function FighterPanel() {
        return _super.call(this) || this;
    }
    FighterPanel.prototype.init = function () {
        //战斗背景
        // this.mHeroCurBlood = GameConfig.gHeroTotalBlood;
        // this.mEnemyCurBlood = GameConfig.gEnemyTotalBlood;
        PlayerData._i();
        this.mScore = 0;
        this.mCurRound = 1;
        this.sdline = 0;
        //分数框
        var scoreframe = new MyBitmap(RES.getRes("scoreFrame_png"), this.mStageW / 2, 35);
        this.addChild(scoreframe);
        //分数
        this.mScoreText = new GameUtil.MyTextField(this.mStageW / 2 - 40, 35, 30, 0, 0.5);
        this.addChild(this.mScoreText);
        this.mScoreText.setText(this.mScore + "");
        //回合数
        this.mCurRoundText = new GameUtil.MyTextField(this.mStageW / 2, 60, 60, 0.5);
        this.addChild(this.mCurRoundText);
        this.mCurRoundText.setText("Round " + this.mCurRound);
        //创建角色
        this.createRole();
        //退出按钮
        //var exitbtn: GameUtil.Menu = new GameUtil.Menu(this,"btn_start_png","btn_start_png",this.exitGame);
        //exitbtn.x = 45;
        //exitbtn.y = 40;
        //exitbtn.setScaleMode();
        //this.addChild(exitbtn);
    };
    FighterPanel.prototype.createRole = function () {
        this.enemyContain = new egret.DisplayObjectContainer();
        this.addChild(this.enemyContain);
        this.mMansp = new Player();
        this.addChild(this.mMansp);
        this.mEnemysp = new EnemySprite();
        this.addChild(this.mEnemysp);
        this.mEnemysp.initdata(EnemyType.SOLDIER, 0);
    };
    //退出游戏
    FighterPanel.prototype.exitGame = function () {
    };
    //获取回合数
    FighterPanel.prototype.getRoundCount = function () {
        return this.mCurRound;
    };
    //更新玩家分数
    FighterPanel.prototype.updateScoreText = function (diamodnum) {
        this.mScore += diamodnum * 10;
        this.mScoreText.text = this.mScore + "";
    };
    //更新回合数
    FighterPanel.prototype.updateRoundCount = function () {
        this.mCurRound++;
        this.mCurRoundText.text = "Round " + this.mCurRound;
    };
    //战斗处理
    FighterPanel.prototype.fightHandler = function (sdLength) {
        this.fightcover = GameUtil.createRect(0, this.mStageH / 4 + 150, this.mStageW, this.mStageH, 0.3);
        this.addChild(this.fightcover);
        this.sdline = sdLength;
        //角色回合
        this.mMansp.att();
    };
    //玩家回合动作处理
    FighterPanel.prototype.heroRuound = function () {
        //console.log("length=====",parma);
        var roundc = this.getRoundCount();
        this.updateRoundCount();
        this.updateScoreText(this.sdline);
        this.numberUpDisp(this, this.mEnemysp.x, this.mEnemysp.y - this.mEnemysp.height / 2, 30, "-" + this.sdline, 0xFF0000);
        if (roundc % 3 == 0) {
            //敌人回合
            this.mEnemysp.att();
        }
        else {
            this.removeChild(this.fightcover);
            var diamondfightscene = (this.parent.diamondfightscene);
            diamondfightscene.setGameState();
        }
    };
    //敌人动作处理
    FighterPanel.prototype.enemyRound = function () {
        var bloodcover = GameUtil.createRect(0, 0, this.mStageW, this.mStageH, 0.3, 0xff0000);
        this.addChild(bloodcover);
        var local = this;
        egret.setTimeout(function () {
            local.removeChild(bloodcover);
        }, this, 400);
        this.numberUpDisp(this, this.mMansp.x, this.mMansp.y - this.mMansp.height / 2, 30, "-" + this.mEnemysp.power, 0xFF0000);
        //this.updateRoundCount();
        this.removeChild(this.fightcover);
        var diamondfightscene = (this.parent.diamondfightscene);
        diamondfightscene.setGameState();
    };
    FighterPanel.prototype.numberUpDisp = function (thisObj, x, y, size, number, color) {
        var textfiled = new egret.TextField();
        textfiled.x = x;
        textfiled.y = y;
        textfiled.size = size;
        textfiled.textAlign = "center";
        textfiled.textColor = color;
        textfiled.text = number;
        thisObj.addChild(textfiled);
        textfiled.anchorOffsetX = textfiled.width / 2;
        textfiled.anchorOffsetY = textfiled.height / 2;
        egret.Tween.get(textfiled).to({ y: y - 40 }, 700);
        egret.Tween.get(textfiled).to({ alpha: 0 }, 700).call(function () { thisObj.removeChild(textfiled); }, thisObj);
    };
    return FighterPanel;
}(GameUtil.BassPanel));
__reflect(FighterPanel.prototype, "FighterPanel");
//# sourceMappingURL=FighterPanel.js.map