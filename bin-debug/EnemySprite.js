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
// TypeScript file
/**
 * Create by hardy on 16/12/27
 * 敌人
 */
var EnemyType;
(function (EnemyType) {
    EnemyType[EnemyType["SOLDIER"] = 0] = "SOLDIER";
    EnemyType[EnemyType["GENERAL"] = 1] = "GENERAL";
    EnemyType[EnemyType["END"] = 2] = "END";
})(EnemyType || (EnemyType = {}));
;
var EnemySprite = (function (_super) {
    __extends(EnemySprite, _super);
    function EnemySprite() {
        var _this = _super.call(this) || this;
        _this.spframe = [4, 10]; //不同状态的总帧数
        return _this;
    }
    EnemySprite.prototype.init = function () {
        //console.log('type====', this.type);
        this.intervalarr = [];
        this.gamelevel = GameData._i().GameLevel;
        this.power = 1;
        this.bdie = false;
        /**创建角色 */
        this.anispeed = Math.max(30, 80 - GameData._i().GameLevel);
        var startpos = [[-50, -50], [-50, this.mStageH / 2], [-50, this.mStageH - 50], [this.mStageW + 50, -50], [this.mStageW + 50, this.mStageH / 2], [this.mStageW + 50, this.mStageH - 50]];
        var enemyname = 'enemyrun' + this.gamelevel;
        this.sp = new Animation(enemyname, this.spframe[RoleState.RUN], this.anispeed, this.mStageW / 2 + 230, 300);
        // var sc: number = this.dir > 2 ? 1 : -1;
        // this.sp.$setScaleX(sc);
        this.addChild(this.sp);
        this.sp.setLoop(-1);
        this.sp.play();
        /**创建生命条 */
        this.life = new Lifesprite(10);
        this.life.$setScaleX(0.7);
        this.life.$setScaleY(0.7);
        this.life.x = this.sp.x;
        this.life.y = this.sp.y - this.sp.height / 2 - 30;
        this.addChild(this.life);
    };
    /**初始配置 */
    EnemySprite.prototype.initdata = function (type, dir) {
        this.type = type;
        this.dir = dir;
    };
    /**开始移动 */
    EnemySprite.prototype.start = function () {
        var posx = this.mStageW / 2;
        var posy = this.mStageH / 2;
        var speed = Math.max(3000, 12000 - GameData._i().GameLevel * 250);
        egret.Tween.get(this.sp).to({ x: posx, y: posy }, speed);
        egret.Tween.get(this.life).to({ x: posx, y: posy - this.sp.height / 2 - 30 }, speed).call(this.att, this);
    };
    /**攻击动作 */
    EnemySprite.prototype.att = function () {
        var _this = this;
        var tw = egret.Tween.get(this);
        tw.to({ x: -450 }, 700).call(function () {
            var enemyname = 'enemyatt' + _this.gamelevel;
            _this.sp.switchani(enemyname, _this.spframe[RoleState.ATT], 0, false, 40);
            _this.sp.setendcall(_this.attplayer, _this);
        }, this);
    };
    /**定时攻击 */
    EnemySprite.prototype.attplayer = function () {
        var enemyname = 'enemyrun' + this.gamelevel;
        this.sp.switchani(enemyname, this.spframe[RoleState.RUN], -1, false, 300);
        var tw = egret.Tween.get(this);
        tw.to({ x: 0 }, 700);
        PlayerData._i().curlife -= this.power;
        var fighterpanel = (this.parent);
        fighterpanel.mMansp.updatalife();
        fighterpanel.enemyRound();
    };
    /**被攻击 */
    EnemySprite.prototype.beatt = function (attpow, bpowatt) {
        if (bpowatt === void 0) { bpowatt = false; }
        GameData._i().gamesound[SoundName.beatt].play();
        this.life.sublife(attpow);
        if (!this.bdie && this.life.getlife() <= 0) {
            this.die(bpowatt);
        }
    };
    /**死亡 */
    EnemySprite.prototype.die = function (bpowatt) {
        this.bdie = true;
        this.sp.stop();
        // if (this.atttag != -1) {
        //     //console.log('clear===');
        //     egret.clearInterval(this.atttag);
        // }
        //GameUtil.clearinterval(this.intervalarr);
        /**移除动作 */
        egret.Tween.removeTweens(this.sp);
        egret.Tween.removeTweens(this.life);
        /**死亡效果 */
        var self = this;
        egret.Tween.get(this).to({ visible: false }, 100).to({ visible: true }, 100).to({ visible: false }, 100).to({ visible: true }, 100).to({ visible: false }, 100).call(function () {
            GameData._i().gamesound[SoundName.die].play();
            GameData._i().gamesound[SoundName.goal].play();
            if (self.gamelevel == 8) {
                PlayerData._i().UserInfo.killgeneral++;
            }
            else {
                PlayerData._i().UserInfo.killsoldier++;
            }
            if (self.gamelevel % 8 == 0) {
                PlayerData._i().UserInfo.jifen += (2 + GameData._i().GameLevel * 4);
            }
            else {
                PlayerData._i().UserInfo.jifen += (2 + GameData._i().GameLevel * 2);
            }
            if (!bpowatt) {
                /**玩家获得能量 */
                var attpower = 1;
                PlayerData._i().curenergy = PlayerData._i().curenergy + attpower;
                if (PlayerData._i().curenergy > GameConfig.PLAYERENERGY) {
                    PlayerData._i().curenergy = GameConfig.PLAYERENERGY;
                }
                else {
                    // var fighterpanel: FighterPanel = <FighterPanel>(this.parent);
                    // fighterpanel.mMansp.updataenergy(attpower);
                }
            }
            self.parent.removeChild(self);
        }, this);
    };
    /**获取敌人角色 */
    EnemySprite.prototype.getsp = function () {
        return this.sp;
    };
    return EnemySprite;
}(GameUtil.BassPanel));
__reflect(EnemySprite.prototype, "EnemySprite");
//# sourceMappingURL=EnemySprite.js.map