/**
 * The main application class. An instance of this class is created by app.js when it
 * calls Ext.application(). This is the ideal place to handle application launch and
 * initialization details.
 */
Ext.define('AIO.Application', {
    extend: 'Ext.app.Application',

    name: 'AIO',

    requires: [
        'AIO.view.viewport.ViewportController'
    ],

    viewport: {
        controller: 'viewport'
    },

    quickTips: false,
    platformConfig: {
        desktop: {
            quickTips: true
        }
    },

    defaultToken: 'main',

    launch(profile) {
        const me = this;

        Ext.event.gesture.LongPress.instance.setMinDuration(600);

        // The viewport controller requires xtype defined by profiles, so let's perform extra
        // initialization when the application and its dependencies are fully accessible.
        Ext.Viewport.getController().onLaunch();
        me.callParent([profile]);
    },

    /**
     * 随 ajax 请求一起传递到后台的一些额外数据
     * @return {Object}
     */
    getClientInfo() {
        return null;
    },

    onAppUpdate() {
        Ext.Msg.confirm('程序升级', '本应用程序已发布新版本, 是否重新加载?',
            function (choice) {
                if (choice === 'yes') {
                    window.location.reload();
                }
            }
        );
    }
});