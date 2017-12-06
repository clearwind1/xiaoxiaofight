/**
 * Created by pior on 15/9/30.
 */

class FighterPanel extends GameUtil.BassPanel {
    public constructor() {
        super();
    }

    public mEnemysp: EnemySprite;                 //敌人
    public mMansp: Player;                   //男主角
    private mScoreText: GameUtil.MyTextField;            //分数
    private mScore: number;                         //当前分数
    private mCurRoundText: GameUtil.MyTextField;         //回合数
    private mCurRound: number;                       //当前回合数
    public enemyContain: egret.DisplayObjectContainer;
    private sdline: number;

    public init(): void {
        //战斗背景
        // this.mHeroCurBlood = GameConfig.gHeroTotalBlood;
        // this.mEnemyCurBlood = GameConfig.gEnemyTotalBlood;
        PlayerData._i();
        this.mScore = 0;
        this.mCurRound = 1;
        this.sdline = 0;
        //分数框
        var scoreframe: MyBitmap = new MyBitmap(RES.getRes("scoreFrame_png"), this.mStageW / 2, 35);
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
    }
    private createRole(): void {
        this.enemyContain = new egret.DisplayObjectContainer();
        this.addChild(this.enemyContain);
        this.mMansp = new Player();
        this.addChild(this.mMansp);

        this.mEnemysp = new EnemySprite();
        this.addChild(this.mEnemysp);
        this.mEnemysp.initdata(EnemyType.SOLDIER, 0);
    }
    //退出游戏
    private exitGame(): void {
    }
    //获取回合数
    public getRoundCount(): number {
        return this.mCurRound;
    }
    //更新玩家分数
    public updateScoreText(diamodnum: number): void {
        this.mScore += diamodnum * 10;
        this.mScoreText.text = this.mScore + "";
    }
    //更新回合数
    public updateRoundCount(): void {
        this.mCurRound++;
        this.mCurRoundText.text = "Round " + this.mCurRound;
    }
    private fightcover: egret.Shape;    //宝石区遮罩
    //战斗处理
    public fightHandler(sdLength: number): void {
        this.fightcover = GameUtil.createRect(0, this.mStageH / 4 + 150, this.mStageW, this.mStageH, 0.3);
        this.addChild(this.fightcover);
        this.sdline = sdLength;
        //角色回合
        this.mMansp.att();
    }
    //玩家回合动作处理
    public heroRuound(): void {
        //console.log("length=====",parma);
        var roundc: number = this.getRoundCount();
        this.updateRoundCount();
        this.updateScoreText(this.sdline);
        this.numberUpDisp(this, this.mEnemysp.x, this.mEnemysp.y - this.mEnemysp.height / 2, 30, "-" + this.sdline, 0xFF0000);
        if (roundc % 3 == 0) {
            //敌人回合
            this.mEnemysp.att();
        }
        else {
            this.removeChild(this.fightcover);
            let diamondfightscene = <DiamodFightScene>((<GameScene>this.parent).diamondfightscene);
            diamondfightscene.setGameState();
        }
    }
    //敌人动作处理
    public enemyRound(): void {
        var bloodcover: egret.Shape = GameUtil.createRect(0, 0, this.mStageW, this.mStageH, 0.3, 0xff0000);
        this.addChild(bloodcover);
        var local: any = this;
        egret.setTimeout(function () {
            local.removeChild(bloodcover);
        }, this, 400);
        this.numberUpDisp(this, this.mMansp.x, this.mMansp.y - this.mMansp.height / 2, 30, "-" + this.mEnemysp.power, 0xFF0000);
        //this.updateRoundCount();
        this.removeChild(this.fightcover);

        let diamondfightscene = <DiamodFightScene>((<GameScene>this.parent).diamondfightscene);
        diamondfightscene.setGameState();
    }

    private numberUpDisp(thisObj: any, x: number, y: number, size: number, number: string, color: number) {
        var textfiled: egret.TextField = new egret.TextField();
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
    }
}