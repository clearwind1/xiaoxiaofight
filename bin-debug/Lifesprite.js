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
 * Create by hardy on 16/12/22
 * 血量类
 */
var Lifesprite = (function (_super) {
    __extends(Lifesprite, _super);
    function Lifesprite(lifecount) {
        return _super.call(this, [lifecount]) || this;
    }
    Lifesprite.prototype.init = function (params) {
        this.lifecount = params[0];
        this.life = params[0];
        var lifeframe = new MyBitmap(RES.getRes('lifeframe_png'));
        this.addChild(lifeframe);
        this.lifebar = new MyBitmap(RES.getRes('lifebar_png'));
        this.lifebar.setanchorOff(0, 0.5);
        this.addChild(this.lifebar);
        GameUtil.relativepos(this.lifebar, lifeframe, 42, 18);
        this.lifemask = new MyBitmap(this.lifebar.texture, this.lifebar.x, this.lifebar.y);
        this.lifemask.setanchorOff(0, 0.5);
        this.addChild(this.lifemask);
        this.lifebar.mask = this.lifemask;
    };
    Lifesprite.prototype.addlife = function (value) {
        var life = this.lifecount + value;
        this.lifecount = Math.min(life, this.life);
        this.updatalifebar();
    };
    Lifesprite.prototype.sublife = function (value) {
        var life = this.lifecount - value;
        this.lifecount = Math.max(life, 0);
        this.updatalifebar();
    };
    Lifesprite.prototype.updatalifebar = function () {
        this.lifemask.width = this.lifebar.width * (this.lifecount / this.life);
        this.lifebar.mask = this.lifemask;
    };
    Lifesprite.prototype.getlife = function () {
        return this.lifecount;
    };
    Lifesprite.prototype.setlife = function (value) {
        this.lifecount = value;
        this.updatalifebar();
    };
    return Lifesprite;
}(GameUtil.BassPanel));
__reflect(Lifesprite.prototype, "Lifesprite");
//# sourceMappingURL=Lifesprite.js.map