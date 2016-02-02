/**
 * Created by pux19 on 2/1/2016.
 */

var DoorControl = {
    _isDoorOpen: false,

    toggleDoor: function () {
        this._isDoorOpen = !this._isDoorOpen;
    },

    isDoorOpen: function() {
        return this._isDoorOpen;
    }
};

module.exports = DoorControl;
