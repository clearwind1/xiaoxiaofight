/**
 * 玩家信息
 * Created by pior on 16/12/15.
 */

class PlayerData {

    public UserInfo: any = {
        ID: '',
        nickname: '',
        openid: '',
        jifen: 0,           //积分
        killsoldier: 0,     //杀敌数
        killgeneral: 0,     //杀将数
        shareopenid: '',    //分享者的openid
    };

    public curweapon: Weapon = Weapon.END;      //当前武器
    public speed: number;                       //速度
    public curDir: Direction;                   //当前方向
    public curlife: number;                     //当前生命
    public curenergy: number;                   //当前能量

    public constructor() {
        this.initdata();
    }
    public initdata() {
        this.UserInfo.jifen = 0;
        this.UserInfo.killsoldier = 0;
        this.UserInfo.killgeneral = 0;

        this.speed = 20;
        this.curweapon = (this.curweapon == Weapon.END) ? Weapon.SPEAR : this.curweapon;
        this.curDir = Direction.END;
        this.curlife = GameConfig.PLAYERLIFE;
        this.curenergy = 0;
    }

    private static _inst: PlayerData = null;

    public static _i(): PlayerData {
        return (this._inst = (this._inst == null ? new PlayerData() : this._inst));
    }
}

