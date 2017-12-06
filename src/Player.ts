/**
 * Create by hardy on 16/12/22
 * 玩家类
 */

/**方向 */
enum Direction { UP, RIGHT, DOWN, LEFT, END };
/**状态：跑动/攻击 */
enum RoleState { RUN, ATT };
/**武器类型：弓箭，枪 */
enum Weapon { SPEAR, BOW, END };

class Player extends GameUtil.BassPanel {

    private life: Lifesprite;       //生命血量
    public zhaoyunrole: Animation; //赵云 
    private zyaniname: string[][] = [['spearrun', 'spearatt'], ['bowrun', 'bowatt']];
    private zyaniframe: number[][] = [[8, 10], [8, 5]];

    private intertag: number;       //定时器标志
    private batting: boolean;       //正在攻击

    public constructor() {
        super();
    }

    public init() {
        this.batting = false;
        /**赵云 */
        var aniname: string = this.zyaniname[Weapon.SPEAR][RoleState.RUN];
        var aniframe: number = this.zyaniframe[Weapon.SPEAR][RoleState.RUN];
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
    }
    /**切换武器 */
    public switchweapon() {
        if (this.batting) {
            return;
        }
        var aniname: string = this.zyaniname[PlayerData._i().curweapon][RoleState.RUN];
        var aniframe: number = this.zyaniframe[PlayerData._i().curweapon][RoleState.RUN];
        this.zhaoyunrole.switchani(aniname, aniframe);
    }
    /**攻击 */
    public att() {

        if (this.batting) {
            return;
        }

        this.batting = true;
        var aniname: string = this.zyaniname[PlayerData._i().curweapon][RoleState.ATT];
        var aniframe: number = this.zyaniframe[PlayerData._i().curweapon][RoleState.ATT];

        if (PlayerData._i().curweapon == Weapon.SPEAR) {
            var tw = egret.Tween.get(this);
            tw.to({ x: 450 }, 700).call(() => {
                this.zhaoyunrole.switchani(aniname, aniframe, 0, false, 20);
                this.zhaoyunrole.setendcall(this.endatt, this);
                GameData._i().gamesound[SoundName.spearatt].play();
            }, this);
        } else {
            this.zhaoyunrole.switchani(aniname, aniframe, 0, false, 20);
            this.zhaoyunrole.setendcall(this.endatt, this);
            GameData._i().gamesound[SoundName.bowatt].play();
        }
    }
    private endatt() {
        var aniname: string = this.zyaniname[PlayerData._i().curweapon][RoleState.RUN];
        var aniframe: number = this.zyaniframe[PlayerData._i().curweapon][RoleState.RUN];
        this.zhaoyunrole.switchani(aniname, aniframe, -1, false, 80);
        var fighterpanel: FighterPanel = <FighterPanel>(this.parent);
        var enemysp = <EnemySprite>fighterpanel.mEnemysp;
            if (PlayerData._i().curweapon == Weapon.SPEAR) {
                enemysp.beatt(GameConfig.PLAYERSPEARPOW);
                var tw = egret.Tween.get(this);
                tw.to({ x: 0}, 700).call(() => {
                    this.checkattenemy();
                }, this);
            }
            else {
                var boweffect: MyBitmap = new MyBitmap(RES.getRes('boweffect_png'), this.zhaoyunrole.x + 50 * this.zhaoyunrole.$getScaleX(), this.zhaoyunrole.y - 20);
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
    }
    /**检测攻击结果 */
    private checkattenemy() {
        this.batting = false;
        (<FighterPanel>this.parent).heroRuound();
    }
    /**移动 */
    private moving() {

    }

    private getzytouchpoint(): number {
        return this.zhaoyunrole.y + 90;
    }
    /**玩家能量 */
    private energy: GameUtil.Menu;
    private energymask: egret.Shape;
    private createEnergy() {
        var energybottle: MyBitmap = new MyBitmap(RES.getRes('energyBottle_png'), 180, 88);
        this.addChild(energybottle);
        this.energy = new GameUtil.Menu(this, 'energy_png', 'energy_png', this.powatt);
        this.energy.x = 180;
        this.energy.y = 106;
        this.addChild(this.energy);
        this.energymask = GameUtil.createRect(146, 150, this.energy.width, this.energy.height);
        this.addChild(this.energymask);
        this.energy.mask = this.energymask;

        this.updataenergy(0);
    }
    /**能量满，放技能*/
    private powatt() {
        if (PlayerData._i().curenergy >= GameConfig.PLAYERENERGY) {

            var poweffect: Animation = new Animation('poweffect', 18, 100, this.mStageW / 2, this.mStageH / 2);
            this.addChild(poweffect);
            poweffect.play();

            var fighterpanel: FighterPanel = <FighterPanel>(this.parent);
            var enemycontain: egret.DisplayObjectContainer = fighterpanel.enemyContain;
            for (var i: number = 0; i < enemycontain.numChildren; i++) {
                var enemysp = <EnemySprite>enemycontain.getChildAt(i);
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
    }
    /**更新玩家生命 */
    public updatalife() {
        if (GameData._i().GameOver) {
            return;
        }
        if (PlayerData._i().curlife <= 0) {
            (<GameScene>this.parent).gameover();
            GameData._i().gamesound[SoundName.fail].play();
            return;
        }
        this.life.setlife(PlayerData._i().curlife);
    }
    /**更新玩家能量 */
    public updataenergy(value: number) {
        this.energymask.y -= this.energy.height * (value / GameConfig.PLAYERENERGY);
        if (PlayerData._i().curenergy == GameConfig.PLAYERENERGY) {
            egret.Tween.get(this.energy, { loop: true }).to({ scaleX: 1.1, scaleY: 1.1 }, 500).to({ scaleX: 1, scaleY: 1 }, 500);
        }
    }
    /**重置 */
    public reset() {
        this.energymask.y = 150;
        this.updatalife();
    }

}