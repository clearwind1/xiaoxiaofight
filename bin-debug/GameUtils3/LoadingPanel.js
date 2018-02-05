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
/**
 * Created by pior on 15/9/29.
 */
var GameUtil;
(function (GameUtil) {
    /**
     * 加载进度界面
     * Process interface loading
     */
    var LoadingPanel = (function (_super) {
        __extends(LoadingPanel, _super);
        function LoadingPanel(fun, obj, offx, offy, isgif, gifTotal) {
            if (offx === void 0) { offx = 0; }
            if (offy === void 0) { offy = 0; }
            if (isgif === void 0) { isgif = false; }
            if (gifTotal === void 0) { gifTotal = 8; }
            var _this = _super.call(this) || this;
            _this.loadedfun = fun;
            _this.thisObj = obj;
            _this.IsGif = isgif;
            _this.gifTotalcount = gifTotal;
            _this.loadingbarOffX = offx;
            _this.loadingbarOffY = offy;
            return _this;
        }
        LoadingPanel.prototype.init = function () {
            //RES.getResByUrl(this.imageUrl,this.onComplete,this,RES.ResourceItem.TYPE_IMAGE);
            new GameUtil.LoadingLogopre(this.onComplete, this);
        };
        LoadingPanel.prototype.loadsound = function () {
            for (var i = 0; i < GameConfig.SoundName.length; i++) {
                var soundname = GameConfig.SoundName[i];
                GameData._i().gamesound[i] = new MySound(soundname);
                var soundtype = soundname.indexOf('bgm') > 0 ? egret.Sound.MUSIC : egret.Sound.EFFECT;
                GameData._i().gamesound[i].soundtype = soundtype;
            }
        };
        LoadingPanel.prototype.onComplete = function (event) {
            if (this.IsGif) {
                this.gifruncount = 0;
                this.loadingbar = new MyBitmap(RES.getRes("loadinggif0_png"), this.mStageW / 2 + this.loadingbarOffX, this.mStageH / 2 + this.loadingbarOffY);
                this.addChild(this.loadingbar);
                egret.setInterval(this.rungif, this, 150);
            }
            else {
                // var loadbgpic = new MyBitmap(RES.getRes('loadbg_jpg'), 0, 0);
                // loadbgpic.setanchorOff(0, 0);
                // this.addChild(loadbgpic);
                var loadingbgbar = new MyBitmap(RES.getRes('loadingbarbg_png'), this.loadingbarOffX, this.mStageH / 2 + this.loadingbarOffY);
                loadingbgbar.x = (this.mStageW - loadingbgbar.texture.textureWidth) / 2;
                loadingbgbar.anchorOffsetX = 0;
                this.addChild(loadingbgbar);
                this.loadingbar = new MyBitmap(RES.getRes("loadingbar_png"), this.loadingbarOffX, this.mStageH / 2 + this.loadingbarOffY);
                this.loadingbar.x = (this.mStageW - this.loadingbar.texture.textureWidth) / 2;
                this.loadingbar.anchorOffsetX = 0;
                this.addChild(this.loadingbar);
                this.loadingmask = GameUtil.createRect(this.loadingbar.x - this.loadingbar.width, this.loadingbar.y - this.loadingbar.height / 2, this.loadingbar.width, this.loadingbar.height);
                this.addChild(this.loadingmask);
                this.loadingbar.mask = this.loadingmask;
                this.gifruncount = 0;
                this.gifloadingbar = new MyBitmap(RES.getRes("gifloadingbar1_png"), this.loadingbar.x, this.loadingbar.y - 100);
                this.addChild(this.gifloadingbar);
                egret.setInterval(this.rungif, this, 150);
                var logo = new MyBitmap(RES.getRes('logo_png'), this.mStageW / 2, this.loadingbar.y + 100);
                this.addChild(logo);
                logo.alpha = 0;
                egret.Tween.get(logo).to({ alpha: 1 }, 500);
                var gametitletext = new GameUtil.MyTextField(this.mStageW / 2, 200, 100, 0.5, 0.5);
                gametitletext.setText(GameConfig.GAMENAME);
                gametitletext.italic = true;
                gametitletext.textColor = 0x75bfea;
                this.addChild(gametitletext);
            }
            //Config to load process interface
            this.loadingView = new LoadingUI();
            this.loadingView.x = this.mStageW / 2;
            this.loadingView.y = this.loadingbar.y - 10;
            this.addChild(this.loadingView);
            this.loadingView.anchorOffsetX = this.loadingView.width / 2;
            this.loadingRes();
        };
        LoadingPanel.prototype.rungif = function () {
            this.gifruncount++;
            if (this.gifruncount >= this.gifTotalcount) {
                this.gifruncount = 1;
            }
            this.gifloadingbar.setNewTexture(RES.getRes("gifloadingbar" + this.gifruncount + "_png"));
        };
        LoadingPanel.prototype.loadingRes = function () {
            //设置加载进度界面
            //初始化Resource资源加载库
            //initiate Resource loading library
            RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
            RES.loadConfig("resource/default.res.json", "resource/");
            if (GameConfig.IsLoadSound)
                this.loadsound();
        };
        /**
         * 配置文件加载完成,开始预加载preload资源组。
         * configuration file loading is completed, start to pre-load the preload resource group
         */
        LoadingPanel.prototype.onConfigComplete = function (event) {
            RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
            RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
            RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
            RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
            RES.loadGroup("preload");
        };
        /**
         * preload资源组加载完成
         * Preload resource group is loaded
         */
        LoadingPanel.prototype.onResourceLoadComplete = function (event) {
            if (event.groupName == "preload") {
                RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
                RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
                RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
                this.loadedfun.apply(this.thisObj);
            }
        };
        /**
         * 资源组加载出错
         *  The resource group loading failed
         */
        LoadingPanel.prototype.onResourceLoadError = function (event) {
            //TODO
            console.warn("Group:" + event.groupName + " has failed to load");
            //忽略加载失败的项目
            //Ignore the loading failed projects
            this.onResourceLoadComplete(event);
        };
        /**
         * preload资源组加载进度
         * Loading process of preload resource group
         */
        LoadingPanel.prototype.onResourceProgress = function (event) {
            if (event.groupName == "preload") {
                if (!this.IsGif) {
                    this.setPro(event.itemsLoaded / event.itemsTotal);
                }
                this.loadingView.setProgress(event.itemsLoaded, event.itemsTotal);
            }
        };
        LoadingPanel.prototype.setPro = function (persend) {
            var dis = this.loadingbar.texture.textureWidth * persend;
            this.loadingmask.x = this.loadingbar.x - this.loadingbar.width + dis;
            this.gifloadingbar.x = this.loadingbar.x + dis;
            //console.log("this.width=====",this.width);
        };
        LoadingPanel.prototype.getPro = function () {
            return this.loadingbar.width / this.loadingbar.texture.textureWidth;
        };
        return LoadingPanel;
    }(GameUtil.BassPanel));
    GameUtil.LoadingPanel = LoadingPanel;
    __reflect(LoadingPanel.prototype, "GameUtil.LoadingPanel");
})(GameUtil || (GameUtil = {}));
//# sourceMappingURL=LoadingPanel.js.map