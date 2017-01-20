var touchAlive = {};
var tagAlive = {};
var widgets = [];

/**
     * tuioObject class
     * Mother class for all TUIO Object
     */
class TUIOObject {
    //constructor
    constructor(id, x, y) {
        this._id = id;
        this._x = x;
        this._y = y;
        this._subList = [];
    }

    //functions
    moveTo(x, y){
        this._x = x;
        this._y = y;
    }

    addSub(newSub){
        this._subList.push(newSub);
    }

    updateSub(){}

    //Getters and Setters
    get id () {return this._id};
    set id (newId) {this._id = newId};
    get x () {return this._x};
    set x (newX) {this._x = newX};
    get y () {return this._y};
    set y (newY) {this._y = newY};
    get subList () {return this._subList};
}

/**
     * tuioTouch class
     */
class TUIOTouch extends TUIOObject {

    //overwrite
    updateSub(){
        /*var event = new CustomEvent("TUIOTouchEvent", {
            detail: {
                id: this.id,
                x: this.x,
                y: this.y
            },
            bubbles: true,
            cancelable: true
        });*/
        
        var event = {id : this.id,
                    x : this.x,
                    y: this.y};

        for (var i = 0; i < this.subList.length; i++){
            this.subList[i].onTouchEvent(event);
        }
    }
}

/**
     * tuioTag class
     */
class TUIOTag extends TUIOObject {
    //constructor
    constructor(id, tagId, x, y, angle) {
        super(id, x, y);
        this._tagId = tagId;
        this._angle = angle;
    }

    //functions
    rotate(angle){
        this.rotateTo(this._angle + angle);
        //this._angle += angle;
    }
    
    //Getters and Setters
    get tagId () {return this._tagId};
    set tagId (newTagId) {this._tagId = newTagId};
    get angle () {return this._angle};
    set angle (newAngle) {this._angle = newAngle};
}

/**
     * tuioWidget class
     */
class TUIOWidget {
    //constructor
    constructor(domElem, x, y, width, height, touchCallBack, tagCallBack) {
        this._domElem = domElem;
        this._x = x;
        this._y = y;
        this._width = width;
        this._height = height;

        this._tuioTouchCallBack = touchCallBack;
        this._tuioTagCallBack = tagCallBack;

        widgets.push(this);
    }

    //functions
    isTouched(theX, theY){
        return (theX >= this._x && theX <= this._x + this._width && theY >= this._y && theY <= this._y + this._height);
    }
    
    onTouchEvent(event){
        this._x=event.x;
        this._y=event.y;
        this._tuioTouchCallBack(this._domElem,event);
    }

    //Getters and Setters
    get domElem () {return this._domElem};
    set domElem (newDomElem) {this._domElem = newDomElem};
}

// Used to get the data from the socket
var socketData = null;

// TEST ===================================================

/*socketData = {"
        type: "touch", //tag
        id: "12345",
        tagId: "",
        x: 0,
        y: 0,
        angle: 0
    };

    touchAlive[socketData.id] = new TUIOTouch(socketData.id, socketData.x, socketData.y);
    console.log(touchAlive);
    console.log(touchAlive[socketData.id].getid());*/

// ==========================================================

function createTUIO(socketData){

    switch(socketData.type) {
        case "touch":
            // add new touch to the alive "list"
            touchAlive[socketData.id] = new TUIOTouch(socketData.id, socketData.x, socketData.y);
            console.log("touch");
            // if widget, add event
            for (var i = 0; i < widgets.length; i++){
                if (widgets[i].isTouched(socketData.x, socketData.y)){
                    touchAlive[socketData.id].addSub(widgets[i]);
                    //widgets[i].domElem.addEventListener("TUIOTouchEvent", widgets[i].tuioTouchCallBack, false);
                }
            }
            break;
        case "tag":
            // add new tag to the alive "list"
            //TODO: 
            tagAlive[socketData.id] = new TUIOTag(socketData.id, socketData.tagId, socketData.x, socketData.y, socketData.angle);
            break;
        default:
            break;
    }

}

function updateTUIO(socketData){
    switch(socketData.type) {
        case "touch":
            // add new touch to the alive "list"
            touchAlive[socketData.id].x = socketData.x;
            touchAlive[socketData.id].y = socketData.y;

            //
            touchAlive[socketData.id].updateSub();

            break;
        case "tag":
            //TODO: 
            break;
        default:
            break;
    }
}

function deleteTUIO(socketData){
    //not yet implemented
}
