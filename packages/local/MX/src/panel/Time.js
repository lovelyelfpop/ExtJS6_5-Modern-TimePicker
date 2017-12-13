Ext.define('MX.panel.Time', {
    extend: 'Ext.Panel',
    requires: [
        'MX.panel.TimeTitle',
        'MX.panel.TimeView'
    ],
    xtype: 'timepanel',

    defaultListenerScope: true,
    referenceHolder: true,

    layout: 'fit',

    config: {
        value: null,

        /**
         * @cfg {Boolean} [showNowButton]
         * Set to `true` to show the Now button. Location
         * will depend on {@link #showFooter} config: if the footer is shown, Now button
         * will be placed in the footer; otherwise the button will be placed in picker header.
         */
        showNowButton: null,

        mode24: false,

        hourActive: true,

        timeView: true,

        /**
         * @cfg {Function} [handler]
         * A function that will handle the change in value.
         * The function will receive the following parameters:
         *
         * @param {Ext.panel.Date} handler.this this
         * @param {Date} handler.time The selected time
         */
        handler: null
    },

    focusable: true,
    tabIndex: 0,

    border: false,

    autoSize: null,

    header: {
        title: {
            xtype: 'timetitle'
        }
    },

    buttonToolbar: {
        enableFocusableContainer: false,
        cls: Ext.baseCSSPrefix + 'datepanel-footer',
        reference: 'footer'
    },

    buttons: {
        footerNowButton: {
            text: 'Now',
            tabIndex: -1,
            hidden: true,
            weight: -20,
            handler: 'onNowButtonClick',
            reference: 'footerNowButton'
        },
        spacer: {
            xtype: 'component',
            weight: -10,
            flex: 1
        },
        ok: {
            tabIndex: -1,
            handler: 'onOkButtonClick'
        },
        cancel: {
            tabIndex: -1,
            handler: 'onCancelButtonClick'
        }
    },

    updateMode24(b) {
        const me = this,
            title = me.getHeader().getTitle(),
            timeView = me.getTimeView();

        title.subTitle[b ? 'hide' : 'show']();
        timeView.setMode24(b);

        me.updateValue(me.getValue());
    },

    updateHourActive(b) {
        const me = this,
            title = me.getHeader().getTitle(),
            timeView = me.getTimeView();

        title.setHourActive(b);
        timeView.setHourActive(b);
    },

    applyTimeView(config) {
        if (Ext.isBoolean(config)) {
            config = {};
        }

        if (!config.isWidget) {
            config = Ext.applyIf({}, config);
        }

        return Ext.factory(config, 'MX.panel.TimeView', this._timeView);
    },

    updateTimeView(view, oldView) {
        if (oldView) {
            Ext.destroy(oldView);
        } else {
            this.add(view);
        }
    },

    updateShowNowButton(showButton) {
        var footerBtn;

        this.getButtons();

        footerBtn = this.lookup('footerNowButton');

        if (footerBtn) {
            footerBtn.setHidden(!showButton);
        }
    },

    applyValue(value) {
        if (!Ext.isDate(value)) return new Date();

        return Ext.clone(value);
    },

    updateValue(value, oldValue) {
        const me = this,
            handler = me.getHandler(),
            title = me.getHeader().getTitle(),
            timeView = me.getTimeView(),
            hour = value.getHours(),
            minute = value.getMinutes(),
            isAm = hour < 12,
            mode24 = me.getMode24(),
            h = !mode24 && hour > 12 ? hour - 12 : hour;

        title.setAmActive(isAm);
        title.setHour(h);
        title.setMinute(minute);

        if(timeView.getHour() === h) {
            timeView.alignFakeNeedlePosition(); // fix when time panel is hidden, fake needle's position won't align
        }
        else {
            timeView.setHour(h);
        }
        timeView.setMinute(minute);

        if (!me.isConfiguring) {
            me.fireEvent('change', me, value, oldValue);

            if (handler) {
                Ext.callback(handler, me.scope, [me, value, oldValue]);
            }
        }
    },

    initialize() {
        const me = this;

        me.callParent(arguments);

        const timeView = me.getTimeView(),
            title = me.getHeader().getTitle();

        timeView.on({
            minutechange: 'onViewMinuteChange',
            hourChange: 'onViewHourChange',
            scope: me
        });

        title.on({
            hourtap: 'onTapTitleHour',
            minutetap: 'onTapTitleMinute',
            amtap: 'onTapTitleAm',
            pmtap: 'onTapTitlePm',
            scope: me
        });

        me.on({
            hide: 'onHide',
            scope: me
        });
    },

    onViewHourChange(hour) {
        const me = this,
            value = me.getValue(),
            title = me.getHeader().getTitle();

        let h = hour;
        if (!me.getMode24() && !title.getAmActive()) {
            h += 12;
        }

        value.setHours(h);
        me.updateValue(value);

        setTimeout(function () {
            me.setHourActive(false);
        }, 500);
    },

    onViewMinuteChange(minute) {
        const me = this,
            value = me.getValue();

        value.setMinutes(minute);
        me.updateValue(value);
    },

    onTapTitleHour() {
        this.setHourActive(true);
    },

    onTapTitleMinute() {
        this.setHourActive(false);
    },

    onTapTitleAm() {
        const me = this;
        if (!me.getMode24()) {
            const value = me.getValue(),
                hour = value.getHours();
            value.setHours(hour - 12);
            me.updateValue(value);
        }
    },

    onTapTitlePm() {
        const me = this;
        if (!me.getMode24()) {
            const value = me.getValue(),
                hour = value.getHours();
            value.setHours(hour + 12);
            me.updateValue(value);
        }
    },

    onOkButtonClick() {
        const me = this;
        me.fireEvent('select', me, Ext.Date.clone(me.getValue()));

    },

    onCancelButtonClick() {
        this.fireEventArgs('tabout', [this]);
    },

    onNowButtonClick() {
        const me = this;

        me.setValue(new Date());
    },

    onHide() {
        this.setHourActive(true);
    }
});