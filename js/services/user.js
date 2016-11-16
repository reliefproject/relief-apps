(function() {

  app.service('User', function() {

    let service = {

      pluginMap: new Map(),


      loadSettings: function() {
        return Relief.db.user.getDoc()
        .then(function(data) {
          Relief.log.info(data.plugins)
          for (let k in data.plugins) {
            const settings = data.plugins[k];
            const manifest = Relief.plugin.loadPlugin(k);
            service.pluginMap.set(manifest, settings);
          }
        });
      },


      getPlugins: function() {
        let plugins = {};
        for (const entry of service.pluginMap.entries()) {
          const name = entry[0].name;
          plugins[name] = entry[1];
        }
        return plugins;
      },


      addPlugin: function(plugin) {
        let plugins = this.getPlugins();
        plugins[plugin.manifest.name] = {
          enabled: true,
          showInMenu: true,
        };
        service.pluginMap.set(plugin.manifest, plugins[plugin.manifest.name]);
        return Relief.db.user.update({
          plugins: plugins,
        });
      },


      updatePlugin: function(manifest, settings) {
        let plugins = this.getPlugins();
        plugins[manifest.name] = settings;
        service.pluginMap.set(manifest, settings);
        return Relief.db.user.update({
          plugins: plugins,
        });
      },


      removePlugin: function(manifest) {
        let plugins = this.getPlugins();
        delete plugins[manifest.name];
        service.pluginMap.delete(manifest);
        return Relief.db.user.update({
          plugins: plugins,
        });
      },


    };
    return service;
  });

})();
