(function() {

  app.service('Settings', function() {
    let service = {

      settings: {},
      userData: {},
      pluginMap: new Map(),


      loadSettings: function() {
        return Relief.db.app.getDoc().then(function(data) {
          service.settings = data;
          return Relief.db.user.getDoc();
        })
        .then(function(data) {
          service.userData = data;
        });
      },


      addInstalledApp: function(app) {
        let plugins = angular.copy(service.userData.installedPlugins);
        plugins[app.name] = {
          showInMenu: true,
        };
        return Relief.db.user.update({
          installedPlugins: plugins,
        });
      },


      updateInstalledApp: function(name, settings) {
        let plugins = angular.copy(service.userData.installedPlugins);
        plugins[name] = settings;
        return Relief.db.user.update({
          installedPlugins: plugins,
        });
      },


      removeInstalledApp: function(name) {
        let plugins = angular.copy(service.userData.installedPlugins);
        delete plugins[name];
        return Relief.db.user.update({
          installedPlugins: plugins,
        });
      },


    };
    return service;
  });

})();
