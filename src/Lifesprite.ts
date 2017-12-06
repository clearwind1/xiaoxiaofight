/**
 * Create by hardy on 16/12/22
 * 血量类
 */
class Lifesprite extends GameUtil.BassPanel
{
    private lifebar: MyBitmap;
    private lifecount: number;
    private life: number;
    private lifemask: MyBitmap;
    public constructor(lifecount:number)
    {
        super([lifecount]);
    }
    public init(params:any[])
    {
        this.lifecount = params[0];
        this.life = params[0];

        var lifeframe: MyBitmap = new MyBitmap(RES.getRes('lifeframe_png'));
        this.addChild(lifeframe);
        this.lifebar = new MyBitmap(RES.getRes('lifebar_png'));
        this.lifebar.setanchorOff(0, 0.5);
        this.addChild(this.lifebar);
        GameUtil.relativepos(this.lifebar, lifeframe, 42, 18);

        this.lifemask = new MyBitmap(this.lifebar.texture, this.lifebar.x, this.lifebar.y);
        this.lifemask.setanchorOff(0, 0.5);
        this.addChild(this.lifemask);
        this.lifebar.mask = this.lifemask;
    }
 
    public addlife(value: number)
    {
        var life = this.lifecount + value;
        this.lifecount = Math.min(life,this.life);
        this.updatalifebar();
    }
    public sublife(value: number)
    {
        var life = this.lifecount - value;
        this.lifecount = Math.max(life,0);
        this.updatalifebar();
    }
    private updatalifebar()
    {
        this.lifemask.width = this.lifebar.width*(this.lifecount / this.life); 
        this.lifebar.mask = this.lifemask;
    }

    public getlife(): number
    {
        return this.lifecount;
    }
    public setlife(value: number)
    {
        this.lifecount = value;
        this.updatalifebar();
    }
}    
