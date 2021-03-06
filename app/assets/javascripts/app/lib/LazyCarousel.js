//
// Taken directly from: http://www.couchcommerce.com/blog/2013/3/27/going-lazyor-how-to-create-a-lazycarousel-for-sencha-touch
//

Ext.define('Proximity.lib.LazyCarousel', {
    extend: 'Ext.carousel.Carousel',

    xtype: 'lazycarousel',

    initialize: function(){
        var me = this;

        me.callParent(arguments);

        me.on('activeitemchange', function(){

            var direction = me.animationDirection;

            if (direction === -1){
                me.deleteFrom('tail');
                me.fireEvent('movedforward', me);
                me._raiseIfHeadNeeded();
            }
            else {
                me.deleteFrom('head');
                me.fireEvent('movedbackward', me);
                me._raiseIfTailNeeded();
            }
        });
    },

    deleteFrom: function(tailOrHead){
        var me = this;
        if (me.innerItems.length < 2){
            return null;
        }

        var activeIndex = me.getActiveIndex();

        //don't remove items if the active item is too close to the start/end
        //Todo make that configureable
        if (tailOrHead === 'tail' && activeIndex === 1 ||
            tailOrHead === 'head' && activeIndex === me.innerItems.length - 2){
            return;
        }

        var item = tailOrHead === 'tail' ?
            me.innerItems[0] : me.innerItems[me.innerItems.length - 1];

        if (item){
            me.remove(item);
            me.fireEvent('itemremoved', me, tailOrHead, item);
        }

        return item;
    },

    insertHead: function(item){
        var me = this;
        me.insert(me.innerItems.length + 1, item);
    },

    insertTail: function(item){
        var me = this;
        me.insert(0, item);
    },

    _raiseIfHeadNeeded: function(){
        var me = this;
        var activeIndex = me.getActiveIndex();
        var headMostIndex = me.innerItems.length - 1;

        var offset = headMostIndex - activeIndex;

        if (offset < 1) {
            me.fireEvent('headneeded', me);
        }
    },

    _raiseIfTailNeeded: function(){
        var me = this;
        var activeIndex = me.getActiveIndex();

        if (activeIndex <= 1) {
            me.fireEvent('tailneeded', me);
        }
    }
});