/**
 * Create by hardy on 16/12/22
 * 玩家类
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
/**方向 */
var Direction;
(function (Direction) {
    Direction[Direction["UP"] = 0] = "UP";
    Direction[Direction["RIGHT"] = 1] = "RIGHT";
    Direction[Direction["DOWN"] = 2] = "DOWN";
    Direction[Direction["LEFT"] = 3] = "LEFT";
    Direction[Direction["END"] = 4] = "END";
})(Direction || (Direction = {}));
;
/**状态：跑动/攻击 */
var RoleState;
(function (RoleState) {
    RoleState[RoleState["RUN"] = 0] = "RUN";
    RoleState[RoleState["ATT"] = 1] = "ATT";
})(RoleState || (RoleState = {}));
;
/**武器类型：弓箭，枪 */
var Weapon;
(function (Weapon) {
    Weapon[Weapon["SPEAR"] = 0] = "SPEAR";
    Weapon[Weapon["BOW"] = 1] = "BOW";
    Weapon[Weapon["END"] = 2] = "END";
})(Weapon || (Weapon = {}));
;
var Player = (function (_super) {
    __extends(Player, _super);
    function Player() {
        var _this = _super.call(this) || this;
        _this.zyaniname = [['spearrun', 'spearatt'], ['bowrun', 'bowatt']];
        _this.zyaniframe = [[8, 10], [8, 5]];
        return _this;
    }
    Player.prototype.init = function () {
        this.batting = false;
        /**赵云 */
        var aniname = this.zyaniname[Weapon.SPEAR][RoleState.RUN];
        var aniframe = this.zyaniframe[Weapon.SPEAR][RoleState.RUN];
        this.zhaoyunrole = new Animation(aniname, aniframe, 80, this.mStageW / 2 - 300, 300);
        this.zhaoyunrole.setanchorOff(0.3, 0.5);
        this.addChild(this.zhaoyunrole);
        this.zhaoyunrole.setLoop(-1);
        this.zhaoyunrole.play();
        /**玩家生命 */
        this.life = new Lifesprite(GameConfig.PLAYERLIFE);
        this.life.x = this.zhaoyunrole.x;
        this.life.y = this.zhaoyunrole.y - this.zhaoyunrole.height / 2 - 30;
        this.addChild(this.life);
        /**玩家能量 */
        //this.createEnergy();
    };
    /**切换武器 */
    Player.prototype.switchweapon = function () {
        if (this.batting) {
            return;
        }
        var aniname = this.zyaniname[PlayerData._i().curweapon][RoleState.RUN];
        var aniframe = this.zyaniframe[PlayerData._i().curweapon][RoleState.RUN];
        this.zhaoyunrole.switchani(aniname, aniframe);
    };
    /**攻击 */
    Player.prototype.att = function () {
        var _this = this;
        if (this.batting) {
            return;
        }
        this.batting = true;
        var aniname = this.zyaniname[PlayerData._i().curweapon][RoleState.ATT];
        var aniframe = this.zyaniframe[PlayerData._i().curweapon][RoleState.ATT];
        if (PlayerData._i().curweapon == Weapon.SPEAR) {
            var tw = egret.Tween.get(this);
            tw.to({ x: 450 }, 700).call(function () {
                _this.zhaoyunrole.switchani(aniname, aniframe, 0, false, 20);
                _this.zhaoyunrole.setendcall(_this.endatt, _this);
                GameData._i().gamesound[SoundName.spearatt].play();
            }, this);
        }
        else {
            this.zhaoyunrole.switchani(aniname, aniframe, 0, false, 20);
            this.zhaoyunrole.setendcall(this.endatt, this);
            GameData._i().gamesound[SoundName.bowatt].play();
        }
    };
    Player.prototype.endatt = function () {
        var _this = this;
        var aniname = this.zyaniname[PlayerData._i().curweapon][RoleState.RUN];
        var aniframe = this.zyaniframe[PlayerData._i().curweapon][RoleState.RUN];
        this.zhaoyunrole.switchani(aniname, aniframe, -1, false, 80);
        var fighterpanel = (this.parent);
        var enemysp = fighterpanel.mEnemysp;
        if (PlayerData._i().curweapon == Weapon.SPEAR) {
            enemysp.beatt(GameConfig.PLAYERSPEARPOW);
            var tw = egret.Tween.get(this);
            tw.to({ x: 0 }, 700).call(function () {
                _this.checkattenemy();
            }, this);
        }
        else {
            var boweffect = new MyBitmap(RES.getRes('boweffect_png'), this.zhaoyunrole.x + 50 * this.zhaoyunrole.$getScaleX(), this.zhaoyunrole.y - 20);
            this.parent.addChild(boweffect);
            // var rot = Math.atan((enemysp.getsp().y - this.zhaoyunrole.y) / (enemysp.getsp().x - this.zhaoyunrole.x)) * 180 / Math.PI;
            // if (enemysp.getsp().x < this.zhaoyunrole.x) {
            //     rot += 180;
            // }
            //console.log('rot=====', rot);
            //boweffect.$setRotation(rot);
            egret.Tween.get(boweffect).to({ x: enemysp.getsp().x, y: enemysp.getsp().y }, 200).call(function () {
                boweffect.parent.removeChild(boweffect);
                if (enemysp.parent != null) {
                    enemysp.beatt(GameConfig.PLAYERBOWPOW);
                }
                this.checkattenemy();
            }, this);
            //enemysp.beatt(1);
        }
    };
    /**检测攻击结果 */
    Player.prototype.checkattenemy = function () {
        this.batting = false;
        this.parent.heroRuound();
    };
    /**移动 */
    Player.prototype.moving = function () {
    };
    Player.prototype.getzytouchpoint = function () {
        return this.zhaoyunrole.y + 90;
    };
    Player.prototype.createEnergy = function () {
        var energybottle = new MyBitmap(RES.getRes('energyBottle_png'), 180, 88);
        this.addChild(energybottle);
        this.energy = new GameUtil.Menu(this, 'energy_png', 'energy_png', this.powatt);
        this.energy.x = 180;
        this.energy.y = 106;
        this.addChild(this.energy);
        this.energymask = GameUtil.createRect(146, 150, this.energy.width, this.energy.height);
        this.addChild(this.energymask);
        this.energy.mask = this.energymask;
        this.updataenergy(0);
    };
    /**能量满，放技能*/
    Player.prototype.powatt = function () {
        if (PlayerData._i().curenergy >= GameConfig.PLAYERENERGY) {
            var poweffect = new Animation('poweffect', 18, 100, this.mStageW / 2, this.mStageH / 2);
            this.addChild(poweffect);
            poweffect.play();
            var fighterpanel = (this.parent);
            var enemycontain = fighterpanel.enemyContain;
            for (var i = 0; i < enemycontain.numChildren; i++) {
                var enemysp = enemycontain.getChildAt(i);
                if (enemysp.bdie) {
                    continue;
                }
                enemysp.beatt(10000, true);
            }
            PlayerData._i().curenergy = 0;
            egret.Tween.removeTweens(this.energy);
            this.energy.scaleX = 1;
            this.energy.scaleY = 1;
            this.energymask.y = 150;
        }
    };
    /**更新玩家生命 */
    Player.prototype.updatalife = function () {
        if (GameData._i().GameOver) {
            return;
        }
        if (PlayerData._i().curlife <= 0) {
            this.parent.gameover();
            GameData._i().gamesound[SoundName.fail].play();
            return;
        }
        this.life.setlife(PlayerData._i().curlife);
    };
    /**更新玩家能量 */
    Player.prototype.updataenergy = function (value) {
        this.energymask.y -= this.energy.height * (value / GameConfig.PLAYERENERGY);
        if (PlayerData._i().curenergy == GameConfig.PLAYERENERGY) {
            egret.Tween.get(this.energy, { loop: true }).to({ scaleX: 1.1, scaleY: 1.1 }, 500).to({ scaleX: 1, scaleY: 1 }, 500);
        }
    };
    /**重置 */
    Player.prototype.reset = function () {
        this.energymask.y = 150;
        this.updatalife();
    };
    return Player;
}(GameUtil.BassPanel));
__reflect(Player.prototype, "Player");
//# sourceMappingURL=Player.js.map