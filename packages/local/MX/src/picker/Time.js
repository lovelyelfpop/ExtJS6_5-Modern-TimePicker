Ext.define('MX.picker.Time', {
    extend: 'Ext.picker.Picker',
    xtype: 'timepicker',
    alternateClassName: 'Ext.TimePicker',
    requires: ['Ext.util.InputBlocker'],

    /**
     * @event change
     * Fired when the value of this picker has changed and the done button is pressed.
     * @param {Ext.picker.Date} this This Picker
     * @param {Date} value The date value
     */

    config: {

        /**
         * @cfg {String} hourText
         * The label to show for the hour column.
         * @accessor
         */
        hourText: 'Hour',

        /**
         * @cfg {String} minuteText
         * The label to show for the minute column.
         * @accessor
         */
        minuteText: 'Minute',

        /**
         * @cfg {Array} slotOrder
         * An array of strings that specifies the order of the slots.
         * @accessor
         */
        slotOrder: ['hour', 'minute'],

        /**
         * @cfg {Object/Date} value
         * Default value for the field and the internal {@link Ext.picker.Date} component. Accepts an object of 'year',
         * 'month' and 'day' values, all of which should be numbers, or a {@link Date}.
         *
         * Examples:
         *
         * - `{year: 1989, day: 1, month: 5}` = 1st May 1989
         * - `new Date()` = current date
         * @accessor
         */

        /**
         * @cfg {Array} slots
         * @hide
         * @accessor
         */

        /**
         * @cfg {String/Mixed} doneButton
         * Can be either:
         *
         * - A {String} text to be used on the Done button.
         * - An {Object} as config for {@link Ext.Button}.
         * - `false` or `null` to hide it.
         * @accessor
         */
        doneButton: true
    },

    initialize() {
        var me = this;

        me.callParent();

        me.on({
            scope: me,
            show: me.onSlotPick
        });
    },

    setValue(value, animated) {
        var me = this;

        if (Ext.isDate(value)) {
            value = {
                year: value.getFullYear(),
                month: value.getMonth(),
                day: value.getDate(),
                hour: value.getHours(),
                minute: value.getMinutes()
            };
        }

        me.callParent([value, animated]);
        if (me.rendered) {
            me.onSlotPick();
        }

        return me;
    },

    getValue(useDom) {
        var values = {},
            items = this.getItems().items,
            ln = items.length,
            hour, minute, item, i;

        for (i = 0; i < ln; i++) {
            item = items[i];
            if (item.isSlot) {
                values[item.getName()] = item.getValue(useDom);
            }
        }

        //if all the slots return null, we should not return a date
        if (values.hour === null && values.minute === null) {
            return null;
        }

        hour = Ext.isNumber(values.hour) ? values.hour : 0;
        minute = Ext.isNumber(values.minute) ? values.minute : 1;

        var oldValue = this._value,
            now = new Date(),
            year, month, day;
        if (oldValue && Ext.isNumber(oldValue.year)) year = oldValue.year;
        else year = now.getFullYear();
        if (oldValue && Ext.isNumber(oldValue.month)) month = oldValue.month;
        else month = now.getMonth();
        if (oldValue && Ext.isNumber(oldValue.day)) day = oldValue.day;
        else day = now.getDate();

        return new Date(year, month, day, hour, minute);
    },

    /**
     * Updates the minuteText configuration
     */
    updateMinuteText(newMinuteText, oldMinuteText) {
        var innerItems = this.getInnerItems,
            ln = innerItems.length,
            item, i;

        //loop through each of the current items and set the title on the correct slice
        if (this.initialized) {
            for (i = 0; i < ln; i++) {
                item = innerItems[i];

                if ((typeof item.title == 'string' && item.title == oldMinuteText) || (item.title.html == oldMinuteText)) {
                    item.setTitle(newMinuteText);
                }
            }
        }
    },

    /**
     * Updates the hourText configuration
     */
    updateHourText(hourText, oldHourText) {
        var innerItems = this.getInnerItems,
            ln = innerItems.length,
            item, i;

        //loop through each of the current items and set the title on the correct slice
        if (this.initialized) {
            for (i = 0; i < ln; i++) {
                item = innerItems[i];

                if ((typeof item.title == 'string' && item.title == oldHourText) || (item.title.html == oldHourText)) {
                    item.setTitle(hourText);
                }
            }
        }
    },

    /**
     * @private
     */
    constructor() {
        this.callParent(arguments);
        this.createSlots();
    },

    /**
     * Generates all slots for all years specified by this component, and then sets them on the component
     * @private
     */
    createSlots() {
        var me = this,
            slotOrder = me.getSlotOrder(),
            hours = [],
            minutes = [],
            slots = [],
            ln, i;

        for (i = 0, ln = 24; i < ln; i++) {
            hours.push({
                text: i,
                value: i
            });
        }

        for (i = 0, ln = 60; i < ln; i = i + 5) {
            minutes.push({
                text: Ext.String.leftPad(i, 2, '0'),
                value: i
            });
        }

        slotOrder.forEach(function (item) {
            slots.push(me.createSlot(item, hours, minutes));
        });

        me.setSlots(slots);
    },

    /**
     * Returns a slot config for a specified date.
     * @private
     */
    createSlot(name, hours, minutes) {
        var me = this,
            result;

        switch (name) {
            case 'hour':
                result = {
                    name: name,
                    align: 'right',
                    data: hours,
                    title: me.getHourText(),
                    flex: 1
                };
                break;
            case 'minute':
                result = {
                    name: name,
                    align: 'left',
                    data: minutes,
                    title: me.getMinuteText(),
                    flex: 1
                };
        }
        if (me._value) {
            result.value = me._value[name];
        }

        return result;
    },

    onDoneButtonTap() {
        var me = this,
            oldValue = me._value,
            newValue = me.getValue(true),
            testValue = newValue;

        if (Ext.isDate(newValue)) {
            testValue = newValue.toDateString();
        }
        if (Ext.isDate(oldValue)) {
            oldValue = oldValue.toDateString();
        }

        if (testValue != oldValue) {
            me.ownerField.onPickerChange(me, newValue);
            me.fireEvent('change', me, newValue);
        }

        me.hide();
        Ext.util.InputBlocker.unblockInputs();
    }
});