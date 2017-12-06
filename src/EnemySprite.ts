// TypeScript file
/**
 * Create by hardy on 16/12/27
 * 敌人
 */
enum EnemyType { SOLDIER, GENERAL, END };
class EnemySprite extends GameUtil.BassPanel {
    private type: EnemyType;                //类型
    private dir: number;                    //出场方向
    private spframe: number[] = [4, 10];    //不同状态的总帧数
    private life: Lifesprite;               //生命值
    private sp: Animation;                  //角色
    public bdie: boolean;                   //是否死亡
    //private atttag: number = -1;            //攻击定时器标志
    private gamelevel: number;              //敌人的等级
    private anispeed: number;               //敌人动作速度
    public intervalarr: number[];
    public power: number;                  //攻击力
    public constructor() {
        super();
    }
    public init() {
        //console.log('type====', this.type);
        this.intervalarr = [];
        this.gamelevel = 1;
        this.power = 1;
        if (this.gamelevel == 8) {
            if (RandomUtils.limitInteger(0, 100) < 50) {
                this.gamelevel = RandomUtils.limitInteger(1, 7);
            }
        }
        this.bdie = false;
        /**创建角色 */
        this.anispeed = Math.max(30, 80 - GameData._i().GameLevel);
        var startpos: number[][] = [[-50, -50], [-50, this.mStageH / 2], [-50, this.mStageH - 50], [this.mStageW + 50, -50], [this.mStageW + 50, this.mStageH / 2], [this.mStageW + 50, this.mStageH - 50]];
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
    }
    /**初始配置 */
    public initdata(type: EnemyType, dir: number) {
        this.type = type;
        this.dir = dir;
    }
    /**开始移动 */
    public start() {
        var posx: number = this.mStageW / 2;
        var posy: number = this.mStageH / 2;
        var speed: number = Math.max(3000, 12000 - GameData._i().GameLevel * 250);
        egret.Tween.get(this.sp).to({ x: posx, y: posy }, speed);
        egret.Tween.get(this.life).to({ x: posx, y: posy - this.sp.height / 2 - 30 }, speed).call(this.att, this);
    }
    /**攻击动作 */
    public att() {
        var tw = egret.Tween.get(this);
        tw.to({ x: -450 }, 700).call(() => {
            var enemyname: string = 'enemyatt' + this.gamelevel;
            this.sp.switchani(enemyname, this.spframe[RoleState.ATT], 0, false, 40);
            this.sp.setendcall(this.attplayer, this);
        }, this);
    }
    /**定时攻击 */
    private attplayer() {
        var enemyname = 'enemyrun' + this.gamelevel;
        this.sp.switchani(enemyname, this.spframe[RoleState.RUN], -1, false, 300);

        var tw = egret.Tween.get(this);
        tw.to({ x: 0 }, 700);
        PlayerData._i().curlife -= this.power;
        var fighterpanel: FighterPanel = <FighterPanel>(this.parent);
        fighterpanel.mMansp.updatalife();
        fighterpanel.enemyRound();
    }
    /**被攻击 */
    public beatt(attpow: number, bpowatt: boolean = false) {
        GameData._i().gamesound[SoundName.beatt].play();
        this.life.sublife(attpow);
        if (!this.bdie && this.life.getlife() <= 0) {
            this.die(bpowatt);
        }
    }
    /**死亡 */
    private die(bpowatt: boolean) {
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
        var self: any = this;
        egret.Tween.get(this).to({ visible: false }, 100).to({ visible: true }, 100).to({ visible: false }, 100).to({ visible: true }, 100).to({ visible: false }, 100).call(function () {
            GameData._i().gamesound[SoundName.die].play();
            GameData._i().gamesound[SoundName.goal].play();
            if (self.gamelevel == 8) {
                PlayerData._i().UserInfo.killgeneral++;
            } else {
                PlayerData._i().UserInfo.killsoldier++;
            }
            if (self.gamelevel % 8 == 0) {
                PlayerData._i().UserInfo.jifen += (2 + GameData._i().GameLevel * 4);
            } else {
                PlayerData._i().UserInfo.jifen += (2 + GameData._i().GameLevel * 2);
            }
            if (!bpowatt) {
                /**玩家获得能量 */
                var attpower: number = 1;
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
    }
    /**获取敌人角色 */
    public getsp(): Animation {
        return this.sp;
    }

}