(function() {

  app.service('Settings', function() {
    let service = {

      settings: {},
      userData: {},


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
        service.userData.installedPlugins[app.name] = {
          showInMenu: true,
          settings: {},
        };
        return Relief.db.user.update({
          installedPlugins: service.userData.installedPlugins,
        });
      },


      updateInstalledApp: function(app) {

      },


      removeInstalledApp: function(name) {
        delete service.userData.installedPlugins[name];
        return Relief.db.user.update({
          installedPlugins: service.userData.installedPlugins,
        });
      },


    };
    return service;
  });

})();
