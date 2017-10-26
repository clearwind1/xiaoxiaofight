
enum DisType { NULL, TopTDown, DownTTop, LeftTRight, RightTLeft, Alpha, End };
class GameMenus extends GameUtil.BassPanel {
	private showtype: DisType;
	public constructor(showtype: DisType) {
		super([showtype]);
	}
	public init(showtype) {
		this.showtype = showtype;
		this.show();
	}
	private show() {
		var posx = this.mStageW / 2;
		var posy = this.mStageH / 2;
		//菜单背景色
		var shap: egret.Shape = GameUtil.createRect(posx, posy, this.mStageW * 2 / 3, this.mStageH / 2.5, 0.8, 0x69c898);
		shap.$setAnchorOffsetX(shap.width / 2);
		shap.$setAnchorOffsetY(shap.height / 2);
		this.addChild(shap);
		//菜单背景图
		var menubgimg = new MyBitmap(RES.getRes(''), posx, posy);
		this.addChild(menubgimg);

		let btnfun: Function[] = [this.startgame, this.howtoplay, this.setting, this.about];
		let btnName: string[] = ['开      始', '玩      法', '设      置', '关      于'];
		for (let i: number = 0; i < 4; i++) {
			var btnname = btnName[i];
			var fun = btnfun[i];
			var btn = new GameUtil.Menu(this, '', '', fun);
			btn.setScaleMode();
			btn.addButtonShap(GameUtil.createRect(0, 0, 300, 60, 1, 0x3399fe, 40, 50), -150, -30);
			btn.addButtonText(btnname, 30);
			this.addChild(btn);
			btn.x = posx;
			btn.y = 50 + posy + (i - 2) * 100;
		}

		do {
			if (this.showtype == DisType.NULL) {
				this.y = 0;
				break;
			} else if (this.showtype == DisType.TopTDown) {
				this.y = -this.mStageH;
				egret.Tween.get(this).to({ y: 0 }, 1500, egret.Ease.bounceOut);
				break;
			} else if (this.showtype == DisType.DownTTop) {
				this.y = this.mStageH;
				egret.Tween.get(this).to({ y: 0 }, 1500, egret.Ease.bounceOut);
				break;
			} else if (this.showtype == DisType.LeftTRight) {
				this.x = -this.mStageW;
				egret.Tween.get(this).to({ x: 0 }, 1500, egret.Ease.bounceOut);
				break;
			} else if (this.showtype == DisType.RightTLeft) {
				this.x = this.mStageW;
				egret.Tween.get(this).to({ x: 0 }, 1500, egret.Ease.bounceOut);
				break;
			} else if (this.showtype == DisType.Alpha) {
				this.alpha = 0;
				egret.Tween.get(this).to({ alpha: 1 }, 500);
				break;
			}
		} while (false);

	}
	private startgame() {
		GameUtil.GameScene.runscene(new GameScene());
	}
	private howtoplay() {
		this.createMask();
		var posx = this.mStageW / 2;
		var posy = this.mStageH / 2;
		var text = new GameUtil.MyTextField(50, 50, 30, 0, 0.5);
		text.setText('玩法介绍:');
		text.textColor = 0xcbeaa0;
		text.width = this.mStageW - 100;
		this.maskscene.addChild(text);
	}
	private setting() {
		this.createMask();
		var posx = this.mStageW / 2;
		var posy = this.mStageH / 2;
		var text = new GameUtil.MyTextField(50, 50, 30, 0, 0.5);
		text.setText('游戏设置:');
		text.textColor = 0xcbeaa0;
		text.width = this.mStageW - 100;
		this.maskscene.addChild(text);
	}
	private about() {
		this.createMask();
		var posx = this.mStageW / 2;
		var posy = this.mStageH / 2;
		var text = new GameUtil.MyTextField(50, 50, 30, 0, 0.5);
		text.setText('关于游戏:');
		text.textColor = 0xcbeaa0;
		text.width = this.mStageW - 100;
		this.maskscene.addChild(text);
	}
	private maskscene: egret.DisplayObjectContainer;
	private createMask() {
		this.maskscene = new egret.DisplayObjectContainer();
		this.addChild(this.maskscene);
		this.maskscene.$setTouchEnabled(true);

		var shap: egret.Shape = GameUtil.createRect(0, 0, this.mStageW, this.mStageH, 1, 0x000000);
		this.maskscene.addChild(shap);

		var posx = this.mStageW / 2;
		var posy = this.mStageH / 2;
		var btnname = '返        回';
		var fun = () => {
			this.removeChild(this.maskscene);
		};
		var btn = new GameUtil.Menu(this, '', '', fun);
		btn.setScaleMode();
		btn.addButtonShap(GameUtil.createRect(0, 0, 300, 60, 1, 0x3399fe, 40, 50), -150, -30);
		btn.addButtonText(btnname, 30);
		this.maskscene.addChild(btn);
		btn.x = posx;
		btn.y = this.mStageH - 100;
	}
}