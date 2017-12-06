/**
 * 玩家信息
 * Created by pior on 16/12/15.
 */
var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var PlayerData = (function () {
    function PlayerData() {
        this.UserInfo = {
            ID: '',
            nickname: '',
            openid: '',
            jifen: 0,
            killsoldier: 0,
            killgeneral: 0,
            shareopenid: '',
        };
        this.curweapon = Weapon.END; //当前武器
        this.initdata();
    }
    PlayerData.prototype.initdata = function () {
        this.UserInfo.jifen = 0;
        this.UserInfo.killsoldier = 0;
        this.UserInfo.killgeneral = 0;
        this.speed = 20;
        this.curweapon = (this.curweapon == Weapon.END) ? Weapon.SPEAR : this.curweapon;
        this.curDir = Direction.END;
        this.curlife = GameConfig.PLAYERLIFE;
        this.curenergy = 0;
    };
    PlayerData._i = function () {
        return (this._inst = (this._inst == null ? new PlayerData() : this._inst));
    };
    PlayerData._inst = null;
    return PlayerData;
}());
__reflect(PlayerData.prototype, "PlayerData");
//# sourceMappingURL=PlayerData.js.map