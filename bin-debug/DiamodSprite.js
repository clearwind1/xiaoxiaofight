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
 * Created by pior on 15/9/22.
 * 宝石类
 */
var DiamodSprite = (function (_super) {
    __extends(DiamodSprite, _super);
    function DiamodSprite(id, attid) {
        var _this = _super.call(this) || this;
        _this.bspuer = false; //超级宝石
        _this.attId = attid;
        _this.ID = id;
        var dianame = "diamod" + _this.attId + "_png";
        _this.texture = RES.getRes(dianame);
        _this.width = _this.texture.textureWidth;
        _this.height = _this.texture.textureHeight;
        _this.addEventListener(egret.Event.ADDED_TO_STAGE, _this.init, _this);
        return _this;
    }
    DiamodSprite.prototype.init = function (event) {
        this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.init, this);
    };
    DiamodSprite.prototype.setSuper = function () {
        this.bspuer = true;
        var dianame = "sdiamod" + this.attId + "_png";
        this.texture = RES.getRes(dianame);
    };
    //检查是否可以连线
    DiamodSprite.prototype.checkscop = function (maxrow, maxcol, id) {
        //console.log("maxrow======",maxrow);
        //console.log("maxcol======",maxcol);
        if (this.ID + maxcol == id)
            return true;
        if (this.ID - maxcol == id)
            return true;
        if ((this.ID + 1) % maxcol != 0 && this.ID + 1 == id)
            return true;
        if (this.ID % maxcol != 0 && this.ID - 1 == id)
            return true;
        if (this.ID % maxcol != 0 && this.ID - maxcol - 1 == id)
            return true;
        if ((this.ID + 1) % maxcol != 0 && this.ID - maxcol + 1 == id)
            return true;
        if (this.ID % maxcol != 0 && this.ID + maxcol - 1 == id)
            return true;
        if ((this.ID + 1) % maxcol != 0 && this.ID + maxcol + 1 == id)
            return true;
        return false;
    };
    return DiamodSprite;
}(egret.Bitmap));
__reflect(DiamodSprite.prototype, "DiamodSprite");
//# sourceMappingURL=DiamodSprite.js.map