/**
 * Created by pior on 15/9/30.
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
var DiamodFightScene = (function (_super) {
    __extends(DiamodFightScene, _super);
    function DiamodFightScene() {
        var _this = _super.call(this) || this;
        _this.offX = (_this.mStageW - 700) / 2;
        _this.offY = 200 + _this.mStageH / 4;
        _this.MaxRow = 7; //宝石列数
        _this.MaxCol = 7; //宝石行数
        _this.MaxDiamod = _this.MaxCol * _this.MaxRow; //宝石总数
        _this.diamod = []; //宝石数组
        _this.selectdiamod = []; //选取的宝石数组
        _this.bPause = false;
        return _this;
    }
    DiamodFightScene.prototype.init = function () {
        //初始化
        console.log('init');
        for (var i = 0; i < this.MaxRow; i++) {
            for (var j = 0; j < this.MaxCol; j++) {
                var num = 1 + (Math.ceil(Math.random() * 100)) % 6;
                var tdiamod = new DiamodSprite(i * this.MaxCol + j, num);
                this.addChild(tdiamod);
                tdiamod.$setAnchorOffsetX(tdiamod.width / 2);
                tdiamod.$setAnchorOffsetY(tdiamod.height / 2);
                tdiamod.x = this.offX + tdiamod.width * i;
                tdiamod.y = this.offY + tdiamod.height * j;
                this.diamod.push(tdiamod);
            }
        }
        this.touchEnabled = true;
        this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchbegin, this);
        this.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.onTouchmove, this);
        this.addEventListener(egret.TouchEvent.TOUCH_END, this.onTouchend, this);
        this.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.onTouchcancel, this);
    };
    DiamodFightScene.prototype.enternframe = function () {
        this.downDiamod(); //宝石下落
        //egret.setTimeout(this.setGameState, this, 400);
    };
    DiamodFightScene.prototype.setGameState = function () {
        this.bPause = false;
        this.touchEnabled = true;
    };
    DiamodFightScene.prototype.onTouchbegin = function (event) {
        var px = event.localX;
        var py = event.localY;
        for (var i = 0; i < this.MaxDiamod; i++) {
            var tdiamod = this.diamod[i];
            var p = tdiamod.globalToLocal(px - tdiamod.width / 2, py - tdiamod.height / 2);
            if (tdiamod.getBounds().containsPoint(p)) {
                //console.log("touchid============",tdiamod.ID);
                this.chosediamod = tdiamod;
                this.selectdiamod.push(tdiamod);
                tdiamod.scaleX = tdiamod.scaleY = 1.2;
                break;
            }
        }
    };
    DiamodFightScene.prototype.onTouchmove = function (event) {
        var px = event.localX;
        var py = event.localY;
        for (var i = 0; i < this.MaxDiamod; i++) {
            var tdiamod = this.diamod[i];
            var p = tdiamod.globalToLocal(px - tdiamod.width / 2, py - tdiamod.height / 2);
            //判断当前宝石是否可以选取
            if (this.selectdiamod.indexOf(tdiamod) == -1 && tdiamod.getBounds().containsPoint(p) && tdiamod.attId == this.chosediamod.attId && this.chosediamod.checkscop(this.MaxRow, this.MaxCol, tdiamod.ID)) {
                this.chosediamod = tdiamod;
                this.selectdiamod.push(tdiamod);
                tdiamod.scaleX = tdiamod.scaleY = 1.2;
                break;
            }
            //判断当前宝石是否可以取消
            if (this.selectdiamod.length >= 2) {
                var len = this.selectdiamod.length;
                if (tdiamod.getBounds().containsPoint(p) && tdiamod.ID == this.selectdiamod[len - 2].ID) {
                    // console.log("tdiamodid=======",tdiamod.ID);
                    this.selectdiamod[len - 1].scaleX = this.selectdiamod[len - 1].scaleY = 1;
                    this.selectdiamod.pop();
                    this.chosediamod = this.selectdiamod[len - 2];
                    break;
                }
            }
        }
    };
    DiamodFightScene.prototype.onTouchend = function (event) {
        //判断是否成为超级宝石
        var tsuperdiamod = null;
        if (this.selectdiamod.length >= 8) {
            if (!this.selectdiamod[this.selectdiamod.length - 1].bspuer)
                tsuperdiamod = this.selectdiamod.pop();
        }
        //判断是否消除宝石
        if (this.selectdiamod.length >= 3) {
            this.bPause = true;
            this.touchEnabled = false;
            this.checkSuperDiamod();
            this.bombDiamod(); //播放效果
            //清理数据
            for (var i = 0; i < this.selectdiamod.length; i++) {
                var tdiamod = this.selectdiamod[i];
                this.removeChild(tdiamod);
            }
            if (tsuperdiamod != null) {
                tsuperdiamod.setSuper();
                tsuperdiamod.scaleX = tsuperdiamod.scaleY = 1.0;
            }
            this.fightPanelHandler();
            //console.log("==========================");
        }
        else {
            for (var i = 0; i < this.selectdiamod.length; i++) {
                var tdiamod = this.selectdiamod[i];
                tdiamod.scaleX = tdiamod.scaleY = 1;
            }
        }
        this.selectdiamod.splice(0);
    };
    DiamodFightScene.prototype.onTouchcancel = function (event) {
        for (var i = 0; i < this.selectdiamod.length; i++) {
            var tdiamod = this.selectdiamod[i];
            tdiamod.scaleX = tdiamod.scaleY = 1;
        }
        this.selectdiamod.splice(0);
    };
    //检查超级宝石
    DiamodFightScene.prototype.checkSuperDiamod = function () {
        for (var i = 0; i < this.selectdiamod.length; i++) {
            var tdiamod = this.selectdiamod[i];
            if (tdiamod.bspuer) {
                var tx = Math.floor(tdiamod.ID / this.MaxCol);
                var ty = tdiamod.ID % this.MaxCol;
                for (var j = 0; j < this.MaxRow; j++) {
                    var stdiamod = this.diamod[j * this.MaxCol + ty];
                    if (this.selectdiamod.indexOf(stdiamod) == -1) {
                        this.selectdiamod.push(stdiamod);
                    }
                }
                for (var j = 0; j < this.MaxCol; j++) {
                    var stdiamod = this.diamod[tx * this.MaxCol + j];
                    if (this.selectdiamod.indexOf(stdiamod) == -1) {
                        this.selectdiamod.push(stdiamod);
                    }
                }
            }
        }
    };
    //播放宝石消除效果
    DiamodFightScene.prototype.bombDiamod = function () {
        for (var i = 0; i < this.selectdiamod.length; i++) {
            var tdiamod = this.selectdiamod[i];
            this.diamod.splice(this.diamod.indexOf(tdiamod), 1, null);
            tdiamod.visible = false;
            var ami = new Animation("bomb", 6, 100, tdiamod.x, tdiamod.y);
            ami.setLoop(1);
            ami.scaleX = ami.scaleY = 0.4;
            ami.play();
            this.addChild(ami);
            if (i == this.selectdiamod.length - 1) {
                ami.setendcall(this.enternframe, this);
            }
        }
    };
    //往下掉落
    DiamodFightScene.prototype.downDiamod = function () {
        for (var i = 0; i < this.MaxRow; i++) {
            for (var j = this.MaxCol - 1; j >= 0; j--) {
                if (this.diamod[i * this.MaxCol + j] == null) {
                    var isemp = true; //判断是否需要新建宝石
                    for (var k = j - 1; k >= 0; k--) {
                        if (this.diamod[i * this.MaxCol + k] != null) {
                            var kdiamod = this.diamod[i * this.MaxCol + k];
                            var posx = this.offX + kdiamod.width * i;
                            var posy = this.offY + kdiamod.height * j;
                            var tw = egret.Tween.get(kdiamod);
                            tw.to({ x: posx, y: posy }, 400);
                            this.diamod.splice(i * this.MaxCol + j, 1, kdiamod);
                            kdiamod.ID = i * this.MaxCol + j;
                            this.diamod.splice(i * this.MaxCol + k, 1, null);
                            isemp = false;
                            break;
                        }
                    }
                    if (isemp) {
                        var num = 1 + (Math.ceil(Math.random() * 100)) % 4;
                        var tdiamod = new DiamodSprite(i * this.MaxCol + j, num);
                        var posx = this.offX + tdiamod.width * i;
                        var posy = this.offY + tdiamod.height * j;
                        tdiamod.$setAnchorOffsetX(tdiamod.width / 2);
                        tdiamod.$setAnchorOffsetY(tdiamod.height / 2);
                        tdiamod.x = posx;
                        tdiamod.y = 0;
                        var tw = egret.Tween.get(tdiamod);
                        tw.to({ x: posx, y: posy }, 400);
                        this.addChild(tdiamod);
                        this.diamod.splice(i * this.MaxCol + j, 1, tdiamod);
                    }
                }
            }
        }
    };
    //处理战斗层
    DiamodFightScene.prototype.fightPanelHandler = function () {
        var fighterpanel = (this.parent.fighterpanel);
        fighterpanel.fightHandler(this.selectdiamod.length);
    };
    return DiamodFightScene;
}(GameUtil.BassPanel));
__reflect(DiamodFightScene.prototype, "DiamodFightScene");
//# sourceMappingURL=DiamodFightScene.js.map