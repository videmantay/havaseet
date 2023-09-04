/**
 * Represent Object on the classroom that have dimensions
 * @author Lee ViDemantay
 */

class FloorObject {
    constructor(h, w, x, y, r){
        this.h = h;
        this.w = w;
        this.x = x;
        this.y = y;
        this.r = r;
/**  maniuplate color */
		this.bg = "";
		this.boarder = "";
    }
}

class Furniture extends FloorObject {
	constructor(h,w,x,y,r,t,k,bg,boarder){
		super(h,w,x,y,r);
		/** type = [functional | decorative]  */
		this.type = t;
		/** describes the type func = singleDesk | decor = bookshelf  */
		this.kind = k;
		this.bg = bg;
		this.boarder = boarder;
	}
};
class Desk extends Furniture{
	constructor(h,w,x,y,r,k,bg,boarder, seatNum){
		super(h,w,x,y,r,"functional",k,bg,boarder);
		this.seats = [seatNum];
	}	
};

class SingleDesk extends Desk{
	constructor(h,w,x,y,r,bg,boarder){
		super(h,w,x,y,r,t,"single",bg,boarder, 1);
	}
};
class DoubleDesk extends Desk{
	constructor(h,w,x,y,r,bg,boarder){
		super(h,w,x,y,r,t,"double",bg,boarder,2);
	}
}
class Station extends FloorObject {};
class Path extends FloorObject{};