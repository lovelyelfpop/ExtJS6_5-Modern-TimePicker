Ext.define('AIO.view.pages.Error404', {
    extend: 'AIO.view.pages.ErrorBase',
    xtype: 'page404',

    items: [{
        cls: 'error-page-top-text',
        html: '404'
    }, {
        cls: 'error-page-desc',
        html: [
            '<div>Not Found!</div>',
            '<div>',
            '<a href="javascript:history.back();">&nbsp;Go back&nbsp;</a>',
            '</div>'
        ].join('')
    }]
});