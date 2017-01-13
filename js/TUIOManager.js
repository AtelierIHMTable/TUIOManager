/**
 * Created by user on 13/01/2017.
 */
var touchArray;
var tagArray;

class TUIO {
    constructor(id, x, y) {
        this.id = id;
        this.x = x;
        this.y = y;
    }
}

class tuioTouch extends TUIO {}

class tuioTag extends TUIO {
    constructor(id, tagId, x, y, angle) {
        super(id, x, y);
        this.tagId = tagId;
        this.angle = angle;
    }
}

function createTUIO(tuio){
    if (tuio.type==="TOUCH"){
        var touch = new tuioTouch(tuio.id,tuio.x,tuio.y);
        touchArray.push(touch);
    }
    else if (tuio.type==="TAG"){
        var tag = new tuioTag(tuio.id,tuio.tagId,tuio.x,tuio.y,tuio.angle);
        tagArray.push(tag);
    }
}

function updateTUIO(tuio){
    if (tuio.type==="TOUCH"){
        for (var touch in touchArray){
            if(tuio.id == touch.id){
                touch.setX(tuio.x);
                touch.setY(tuio.y)
            }
        }
    }
}

function deleteTUIO(tuio){

}