Ext.define('MX.field.Time', {
    extend: 'Ext.field.Picker',
    requires: [
        'MX.panel.Time',
        'MX.picker.Time'
    ],
    xtype: ['timefield', 'timepickerfield'],

    config: {
        mode24: false,

        destroyPickerOnHide: false

    },

    triggers: {
        expand: {
            iconCls: 'x-fa fa-clock-o'
        }
    },

    classCls: Ext.baseCSSPrefix + 'timepickerfield',
    matchFieldWidth: false,

    floatedPicker: {
        xtype: 'timepanel',
        floated: true,
        listeners: {
            tabout: 'onTabOut',
            select: 'onPickerChange',
            scope: 'owner'
        }
    },

    edgePicker: {
        xtype: 'timepicker',
        cover: true
    },

    applyValue(value, oldValue) {
        if (!(value || value === 0)) {
            value = null;
        }

        value = this.callParent([value, oldValue]);

        if (value) {
            if (this.isConfiguring) {
                this.originalValue = value;
            }

            // The same date value may not be the same reference, so compare them by time.
            // If we have dates for both, then compare the time. If they're the same we
            // don't need to do anything.
            if (Ext.isDate(value) && Ext.isDate(oldValue) && value.getTime() === oldValue.getTime()) {
                return;
            }
        }

        return value;
    },

    updateValue(value, oldValue) {
        var picker = this._picker;

        if (picker && picker.isPicker && Ext.isDate(value)) {
            this.updatePickerValue(picker, value);
        }

        this.callParent([value, oldValue]);
    },

    getFormat() {
        return this.getMode24() ? 'H:i' : 'g:i A';
    },

    updatePickerValue(picker, value) {
        picker.setValue(value);
    },

    applyInputValue(value, oldValue) {
        if (Ext.isDate(value)) {
            value = Ext.Date.format(value, this.getFormat());
        }

        return this.callParent([value, oldValue]);
    },

    applyPicker(picker, oldPicker) {
        const me = this;

        picker = me.callParent([picker, oldPicker]);

        me.pickerType = picker.xtype === 'timepicker' ? 'edge' : 'floated';
        picker.ownerCmp = me;

        return picker;
    },

    createFloatedPicker() {
        return Ext.apply({
            value: this.getValue() || new Date()
        }, this.getFloatedPicker());
    },

    createEdgePicker() {
        const me = this;

        return Ext.merge({

        }, me.getEdgePicker());
    },

    setPickerLocation(fromKeyboard) {
        var me = this,
            pickerType = me.pickerType,
            picker = me.getPicker(),
            value = me.getValue();

        me.$ignorePickerChange = true;
        if (value != null) {
            picker.setValue(value);
        } else if (pickerType === 'edge') {
            picker.setValue(new Date());
        }
        delete me.$ignorePickerChange;

        if (pickerType === 'floated') {
            picker.el.dom.tabIndex = -1;

            picker.setMode24(me.getMode24());

            value = value || new Date();

            // Ensure the carousel is at the correct position wth no animation.
            picker.setValue(value);
        }
    },

    doValidate(value, errors, skipLazy) {
        var me = this;

        me.callParent([value, errors, skipLazy]);
    },

    /**
     * Called when the picker changes its value.
     * @param {Ext.picker.Date} picker The date picker.
     * @param {Object} value The new value from the date picker.
     * @private
     */
    onPickerChange(picker, value) {
        var me = this;

        if (me.$ignorePickerChange) {
            return;
        }

        me.forceInputChange = true;
        me.setValue(value);
        me.forceInputChange = false;
        me.fireEvent('select', me, value);

        // Focus the inputEl first and then collapse. We configure
        // the picker not to revert focus which is a normal thing to do
        // for floaters; in our case when the picker is focusable it will
        // lead to unexpected results on Tab key presses.
        // Note that this focusing might happen synchronously during Tab
        // key handling in the picker, which is the way we want it.
        me.onTabOut(picker);
    },

    onTabOut() {
        // Automatic focus reversion will move focus back to the owning field if necessary.
        this.collapse();
    },

    parseValue(value, errors) {
        var date;

        if (value) {
            date = Ext.Date.parse(value, this.getFormat());
            if (date !== null) {
                return date;
            }
        }
        return this.callParent([value, errors]);
    },

    transformValue(value) {
        if (Ext.isObject(value)) {
            var date = new Date();
            date.setHours(value.hour);
            date.setMinutes(value.minute);

            if (isNaN(value.getTime())) {
                value = null;
            }
        }

        return value;
    },

    doDestroy() {
        var picker = this._picker;

        if (picker && picker.isPicker) {
            picker.destroy();
        }

        this.callParent();
    },

    privates: {
        setShowPickerValue(picker) {
            this.updatePickerValue(picker, this.getValue() || new Date());
        }
    }


});