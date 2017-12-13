/**
 * bug fix: 解决路由处理函数内的异常被吞，无法抛出
 * 改进：增加 afterroute 全局事件
 */
Ext.define(null, { //'MX.override.route.Route'
    override : 'Ext.route.Route',

    execute : function (token, argConfig) {
        var me = this,
            promise = this.callParent([ token, argConfig ]);

        return promise
            .then(function(p){
                Ext.fireEvent('afterroute', me, token); 
                return p;
            })
            .catch(Ext.bind(this.onRouteReject, this));
    },

    onRouteReject : function (error) {
        Ext.fireEvent('routereject', this);

        if (error instanceof Error) {
            console.error(error);
        }
    }
});