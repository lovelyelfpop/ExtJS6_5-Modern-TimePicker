Ext.define('AIO.view.main.Main', {
    extend: 'Ext.form.Panel',
    requires: [
        'Ext.plugin.Responsive',
        'Ext.field.Text',
        'Ext.field.Date',
        'MX.field.Time'
    ],
    xtype: 'main',

    bodyPadding: 20,
    items: [{
        xtype: 'container',
        responsiveConfig: {
            tall: {
                width: '100%'
            },
            wide: {
                width: '50%'
            }
        },
        plugins: ['responsive'],
        items: [{
            xtype: 'textfield',
            label: 'Text',
            name: 'txt'
        }, {
            xtype: 'datefield',
            label: 'Date1'
        }, {
            xtype: 'datefield',
            label: 'Date2'
        }, {
            xtype: 'timefield',
            label: 'Time'
        }, {
            xtype: 'timefield',
            mode24: true,
            label: 'Time(Mode24)'
        }]
    }]
});