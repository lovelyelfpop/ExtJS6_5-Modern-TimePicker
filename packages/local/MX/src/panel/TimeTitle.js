/**
 * @private
 */
Ext.define('MX.panel.TimeTitle', {
    extend: 'Ext.panel.Title',
    xtype: 'timetitle',

    classCls: Ext.baseCSSPrefix + 'timetitle',

    template: [{
        reference: 'bodyElement',
        cls: Ext.baseCSSPrefix + 'body-el',

        children: [{
            cls: 'time-title',
            children: [{
                reference: 'textElement',
                cls: Ext.baseCSSPrefix + 'text-el'
            }, {
                reference: 'hourElement',
                cls: 'time-hour'
            }, {
                cls: 'time-dotspan',
                html: ':'
            }, {
                reference: 'minuteElement',
                cls: 'time-minute'
            }]
        }, {
            reference: 'subTitle',
            cls: 'time-subtitle',
            children: [{
                reference: 'amElement',
                cls: 'time-am',
                html: 'am'
            }, {
                reference: 'pmElement',
                cls: 'time-pm',
                html: 'pm'
            }]
        }]
    }],

    config: {
        hour: null,
        minute: null,
        hourActive: {
            cached: true,
            $value: true
        },
        amActive: true
    },

    updateHour(hour) {
        const me = this;
        if(Ext.isNumber(hour)) {
            me.hourElement.setHtml(hour);
        }
    },

    updateMinute(minute) {
        if(Ext.isNumber(minute)) {
            this.minuteElement.setHtml(Ext.String.leftPad(minute, 2, '0'));
        }
    },

    initialize() {
        var me = this;

        me.callParent();
        me.hourElement.on('tap', 'onHourTap', me);
        me.minuteElement.on('tap', 'onMinuteTap', me);
        me.amElement.on('tap', 'onAmTap', me);
        me.pmElement.on('tap', 'onPmTap', me);
    },

    updateHourActive(active) {
        var cls = Ext.baseCSSPrefix + 'active';

        this.hourElement.toggleCls(cls, active);
        this.minuteElement.toggleCls(cls, !active);
    },

    updateAmActive(active) {
        var cls = Ext.baseCSSPrefix + 'active';

        this.amElement.toggleCls(cls, active);
        this.pmElement.toggleCls(cls, !active);
    },

    privates: {
        onHourTap(e) {
            this.setHourActive(true);
            this.fireEvent('hourtap', this, e);
        },

        onMinuteTap(e) {
            this.setHourActive(false);
            this.fireEvent('minutetap', this, e);
        },

        onAmTap(e) {
            this.setAmActive(true);
            this.fireEvent('amtap', this, e);
        },

        onPmTap(e) {
            this.setAmActive(false);
            this.fireEvent('pmtap', this, e);
        }
    }
});