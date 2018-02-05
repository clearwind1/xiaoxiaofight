/**
 * Created by pior on 16/9/9.
 */

class StartGameScene extends GameUtil.BassPanel {

    public constructor() {
        super();
    }

    public init() {
        //BGMPlayer._i().play(SoundName.startgamebgm);
        var data: any = {
            'code': 1
        };
        this.show(data);
    }

    private show(data: any) {
        if (data['code'] == 1) {
            this.showbg();
        }
        else {
            GameUtil.trace(data['msg']);
        }
    }
    /**显示背景界面 */
    private showbg() {

        var shap: MyBitmap = new MyBitmap(RES.getRes('startgamebg_jpg'), 0, 0);
        shap.setanchorOff(0, 0);
        shap.width = this.mStageW;
        shap.height = this.mStageH;
        this.addChild(shap);

        var posx = this.mStageW / 2;
        var posy = this.mStageH / 2;

        //this.addChild(new GameMenus(RandomUtils.limitInteger(DisType.NULL, DisType.Alpha)));

        for (let i: number = 0; i < 2; i++) {
            var btnname = 'enemyrun' + (i+1) + '1_png';
            var fun = this.startgame;
            var btn = new GameUtil.Menu(this, btnname, btnname, fun, [i]);
            this.addChild(btn);
            btn.x = posx;
            btn.y = posy + 200 - i*400;
        }

    }

    /**开始游戏 */
    private startgame(id) {
        GameUtil.trace('startgame====', id);
        GameData._i().GameLevel = id + 1;
        GameUtil.GameScene.runscene(new GameScene());
    }
    /**游戏排行榜 */
    private gamerank() {
        GameUtil.trace('gamerank');
        this.addChild(new GameRankPageShow());
    }
    /**游戏帮助 */
    private gamehelp() {
        GameUtil.trace('gamehelp');
        this.addChild(new GameHelpPageShow());
    }
    /**游戏设置，音乐与音效 */
    private setting() {
        GameUtil.trace('setting');
        this.addChild(new GameSetting());
    }
    /**更多游戏 */
    private moregame() {
        //this.addChild(new MoreGamePage());
    }
}