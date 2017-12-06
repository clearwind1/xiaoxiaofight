/**
 * Created by pior on 15/9/22.
 * 宝石类
 */
class DiamodSprite extends egret.Bitmap {
    
    public ID: number;          //宝石ID
    public attId: number;       //宝石属性ID
    public bspuer: boolean = false;     //超级宝石

    public constructor(id: number, attid: number) {
        super();
        this.attId = attid;
        this.ID = id;
        var dianame: string = "diamod" + this.attId + "_png";
        this.texture = RES.getRes(dianame);
        this.width = this.texture.textureWidth;
        this.height = this.texture.textureHeight;

        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.init, this);
    }

    private init(event: egret.Event): void {
        this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.init, this);
    }

    public setSuper(): void {
        this.bspuer = true;
        var dianame: string = "sdiamod" + this.attId + "_png";
        this.texture = RES.getRes(dianame);
    }

    //检查是否可以连线
    public checkscop(maxrow: number, maxcol: number, id: number): boolean {
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
    }

}