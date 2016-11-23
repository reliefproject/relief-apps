(function() {

  app.service('User', function() {

    let service = {

      pluginMap: new Map(),


      loadSettings: () => {
        return Relief.db.user.getDoc()
        .then(data => {
          for (let k in data.plugins) {
            const plugin = data.plugins[k];
            const manifest = Relief.plugin.getManifest(k);
            service.pluginMap.set(manifest, plugin);
          }
        });
      },


      getPlugins: () => {
        let plugins = {};
        for (const entry of service.pluginMap.entries()) {
          const name = entry[0].name;
          plugins[name] = entry[1];
        }
        return plugins;
      },


      addPlugin: plugin => {
        let plugins = service.getPlugins();
        plugins[plugin.transaction.name] = {
          enabled: true,
          showInMenu: true,
        };
        service.pluginMap.set(plugin.manifest, plugins[plugin.transaction.name]);
        return Relief.db.user.update({
          plugins: plugins,
        });
      },


      updatePlugin: (manifest, settings) => {
        let plugins = service.getPlugins();
        plugins[manifest.name] = settings;
        service.pluginMap.set(manifest, settings);
        return Relief.db.user.update({
          plugins: plugins,
        });
      },


      removePlugin: manifest => {
        let plugins = service.getPlugins();
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
