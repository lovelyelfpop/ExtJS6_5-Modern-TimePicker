Ext.define('AIO.view.pages.ErrorBase', {
    extend: 'Ext.Sheet',

    requires: [
        'Ext.layout.VBox'
    ],

    destroyOnHide: true,

    modal: false,
    centered: true,
    stretchX: true,
    stretchY: true,
    left: 0,
    bottom: 0,

    layout: {
        type: 'vbox',
        align: 'center',
        pack: 'center'
    },

    cls: 'error-page-container',

    defaults: {
        xtype: 'label'
    }
});