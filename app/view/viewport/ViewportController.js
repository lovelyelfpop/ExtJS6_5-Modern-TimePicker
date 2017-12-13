Ext.define('AIO.view.viewport.ViewportController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.viewport',

    requires: [
        'AIO.view.pages.Error404',
        'AIO.view.main.Main'
    ],

    listen: {
        global: {
            beforeroute: 'onBeforeRoute',
            unmatchedroute: 'handleUnmatchedRoute'
        }
    },

    routes: {
        'main': 'showMain'
    },

    onLaunch() {
        Ext.getBody().removeCls('launching');
    },

    showView(xtype) {
        var view = this.lookup(xtype),
            viewport = this.getView();

        if (!view) {
            viewport.removeAll(true);
            view = viewport.add({
                xtype: xtype,
                reference: xtype
            });

            var token = Ext.History.getToken();
            if (!Ext.isEmpty(token)) {
                this.redirectTo(token, {
                    force: true
                });
            }
        }

        viewport.setActiveItem(view);
    },

    showMain() {
        this.showView('main');
    },

    // ROUTING

    // 全局路由的 before 事件处理
    onBeforeRoute(action, route) {
        const me = this,
            lastView = me.lastView;

        if (lastView) {
            if (lastView instanceof Ext.Sheet) { // 如果上次的view是Ext.Sheet，就隐藏
                lastView.hide();
            }
        }
    },

    /**
     * 未匹配到路由
     *
     * @param {String} token
     */
    handleUnmatchedRoute(token) {
        var me = this;
        me.show404Page();
    },

    /**
     * 显示 404 界面
     *
     * @param {String} token
     */
    show404Page(token) {
        var me = this;
        var errPage = Ext.Viewport.add({
            xtype: 'page404'
        });
        me.lastView = errPage;
        errPage.on({
            destroy() {
                delete this.lastView;
            },
            scope: me
        });
        errPage.show();
    }
});