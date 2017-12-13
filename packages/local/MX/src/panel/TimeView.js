Ext.define('MX.panel.TimeView', {
    extend: 'Ext.Widget',
    xtype: 'timeview',

    config: {
        mode24: false,
        hour: null,
        minute: null,
        hourActive: true
    },

    element: {
        reference: 'element'
    },

    updateMode24(b) {
        const me = this,
            hourCells = [];
        let i;
        if (b) {
            for (i = 1; i <= 24; i++) {
                hourCells.push({
                    cls: `time-cell cell-rotate-${5 * i}`,
                    children: [{
                        tag: 'span',
                        html: (i == 24 ? 0 : i) + ''
                    }]
                });
            }
        } else {
            for (i = 1; i <= 12; i++) {
                hourCells.push({
                    cls: `time-cell cell-rotate-${10 * i}`,
                    children: [{
                        tag: 'span',
                        html: i + ''
                    }]
                });
            }
        }

        const pNode = me.hourView.dom;
        while (pNode.firstChild) {
            pNode.removeChild(pNode.firstChild);
        }
        me.hourView.appendChild(hourCells);
    },

    updateMinute(minute) {
        const me = this;
        if (!me.getHourActive()) {
            me.rotateNeedleByMinute(minute);
        }
    },

    updateHour(hour) {
        const me = this;
        if (me.getHourActive()) {
            me.rotateNeedleByHour(hour);
        }
    },

    updateHourActive(active) {
        const me = this;
        me.hourView[active ? 'show' : 'hide']();
        me.minuteView[active ? 'hide' : 'show']();

        if (active) {
            me.rotateNeedleByHour(me.getHour());
        } else {
            me.rotateNeedleByMinute(me.getMinute());
        }
    },

    constructor(config) {
        this.callParent([config]);
    },

    getTemplate() {
        const me = this;

        const minuteCells = [];
        let i;
        let minute;
        for (i = 1; i <= 12; i++) {
            minute = 5 * i;
            if (minute == 60) minute = 0;
            minuteCells.push({
                cls: `time-cell cell-rotate-${10 * i}`,
                children: [{
                    tag: 'span',
                    html: Ext.String.leftPad(minute, 2, '0')
                }]
            });
        }

        return [{
            reference: 'needle',
            cls: 'time-needle',
            children: [{
                reference: 'needleDot',
                tag: 'span',
                cls: 'dot'
            }, {
                tag: 'span',
                cls: 'line'
            }, {
                reference: 'needleCircle',
                tag: 'span',
                cls: 'circle'
            }]
        }, {
            reference: 'minuteView',
            cls: 'time-minuteview time-circularView',
            children: minuteCells
        }, {
            reference: 'hourView',
            cls: 'time-hourview time-circularView'
        }, {
            reference: 'fakeNeedle',
            cls: 'circle-fake'
        }];
    },

    initElement() {
        const me = this;

        me.callParent();

        me.fakeNeedleDragSource = new Ext.drag.Source({
            element: me.fakeNeedle,
            constrain: {
                element: true
            },
            listeners: {
                scope: me,
                dragstart: 'onFakeNeedleDragStart',
                dragmove: 'onFakeNeedleDragMove',
                dragend: 'onFakeNeedleDragEnd'
            }
        });

        me.minuteView.on({
            delegate: '.time-cell > span',
            tap: 'onTapMinuteCell',
            scope: me
        });

        me.hourView.on({
            delegate: '.time-cell > span',
            tap: 'onTapHourCell',
            scope: me
        });

        me.needle.on({
            transitionend: 'alignFakeNeedlePosition',
            scope: me
        });
    },

    onFakeNeedleDragStart(source, info) {
        const me = this,
            offset = me.element.getOffsetsTo(document.body);
        me.regionOffsetX = offset[0];
        me.regionOffsetY = offset[1];

        me.needle.addCls('needle-quick');
    },

    onFakeNeedleDragMove(source, info) {
        const me = this,
            pos = info.element.current,
            deltaY = pos.x - me.regionOffsetX + 16 - 125,
            deltaX = pos.y - me.regionOffsetY + 16 - 125,
            angleInDegrees = 90 - Math.atan2(deltaY, deltaX) * (180 / Math.PI);

        const result = me.isRotate(angleInDegrees, me.needle.angle || 0);
        if (result.isRotate) {
            const degree = result.degree;

            if (me.getHourActive()) {
                const hour = degree;
                me.dragHour = hour;

                me.rotateNeedleByHour(hour);
            } else {
                let minute = degree;
                if (minute == 60) minute = 0;
                me.dragMinute = minute;

                me.rotateNeedleByMinute(minute);
            }
        }
    },

    /**
     * This check will make sure the knob will only rotate when the knob meets a sector point.
     * @param {Number} angle
     * @param {Number} prevAngle
     */
    isRotate(angle, prevAngle) {
        const me = this,
            sectorCount = me.getHourActive() ? (me.getMode24() ? 24 : 12) : 60,
            quadAngle = 360 / sectorCount,
            quadCenterAngle = quadAngle / 2,
            threshold = quadCenterAngle;

        for (var i = 0; i < sectorCount; i++) {
            const sectorAngle = quadAngle * i - 90,
                minAngle = sectorAngle - threshold,
                maxAngle = sectorAngle + threshold;

            if (angle >= minAngle && angle <= maxAngle) {
                if (sectorAngle === prevAngle) {
                    return {
                        isRotate: false
                    };
                }

                return {
                    isRotate: true,
                    angle: sectorAngle,
                    degree: i
                };
            }
        }

        return {
            isRotate: false
        };
    },

    rotateNeedle(angle) {
        const me = this;
        me.needle.angle = angle;

        me.needle.setStyle({
            transform: `rotate(${angle}deg)`
        });
        me.needleDot.setStyle({
            transform: `rotate(${-angle}deg)`
        });
        me.needleCircle.setStyle({
            transform: `rotate(${-angle}deg)`
        });
    },

    onRender() {
        const me = this;
        me.callParent(arguments);

        me.alignFakeNeedlePosition();
    },

    rotateNeedleByMinute(minute) {
        const me = this;
        if (!Ext.isNumber(minute)) return;

        let degree = minute;
        if (degree == 0) degree = 60;
        me.rotateNeedle(6 * degree - 90);

        var oldSelected = me.minuteView.child('.cell-selected');
        if (oldSelected) {
            oldSelected.removeCls('cell-selected');
        }
        if (degree % 5 == 0) {
            var newSelected = me.minuteView.child(`.cell-rotate-${degree * 2}`);
            if (newSelected) {
                newSelected.addCls('cell-selected');
            }
        }
    },

    rotateNeedleByHour(hour) {
        const me = this;
        if (!Ext.isNumber(hour)) return;

        const interval = me.getMode24() ? 2.5 : 5;

        let degree = hour * interval;
        if (degree == 0) degree = 60;
        me.rotateNeedle(6 * degree - 90);

        var oldSelected = me.hourView.child('.cell-selected');
        if (oldSelected) {
            oldSelected.removeCls('cell-selected');
        }
        if (degree % interval == 0) {
            var newSelected = me.hourView.child(`.cell-rotate-${degree * 2}`);
            if (newSelected) {
                newSelected.addCls('cell-selected');
            }
        }
    },

    onFakeNeedleDragEnd(source) {
        const me = this;

        if (me.getHourActive()) {
            const hour = me.dragHour;
            me.setHour(hour);
            me.fireEvent('hourchange', hour);
            delete me.dragHour;
        } else {
            const minute = me.dragMinute;
            me.setMinute(minute);
            me.fireEvent('minutechange', minute);
            delete me.dragMinute;
        }

        me.alignFakeNeedlePosition();

        me.needle.removeCls('needle-quick');
    },

    /**
     * 把 FakeNeedle 和 真实的 Needle 对齐
     */
    alignFakeNeedlePosition() {
        const me = this,
            hOffset = me.element.dom.getBoundingClientRect(),
            cOffset = me.needleCircle.dom.getBoundingClientRect();

        me.fakeNeedle.setStyle({
            left: (cOffset.left - hOffset.left) + 'px',
            top: (cOffset.top - hOffset.top) + 'px'
        });
    },

    onTapMinuteCell(e, target) {
        const me = this,
            text = target.textContent || target.innerText,
            minute = parseInt(text, 10);

        me.setMinute(minute);
        me.fireEvent('minutechange', minute);
    },

    onTapHourCell(e, target) {
        const me = this,
            text = target.textContent || target.innerText,
            hour = parseInt(text, 10);

        me.setHour(hour);
        me.fireEvent('hourchange', hour);
    },

    destroy() {
        const me = this;
        Ext.destroy(me.fakeNeedleDragSource);
    }
});