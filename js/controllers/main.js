(function() {


  const mainController = function(
    $scope, i18n, Settings, Packages
  ) {

    $scope.forms = {
      search: '',
    };
    $scope.installedPlugins = {};
    $scope.featuredApps = [];
    $scope.searchResults = [];
    $scope.appToEdit = {
      showInMenu: true,
    };
    $scope.appToInstall = {
      responsibilityTaken: false,
      error: '',
    };


    Settings.loadSettings()
    .then(function() {
      for (let k in Settings.userData.installedPlugins) {
        const settings = Settings.userData.installedPlugins[k];
        const manifest = Relief.plugin.loadPlugin(k);
        Settings.pluginMap.set(manifest, settings);
        $scope.installedPlugins = [...Settings.pluginMap.keys()];
      }
      return i18n.loadStrings(Settings.settings.language)
    })
    .then(Packages.getFeatured)
    .then(function(data) {
      $scope.featuredApps = data;
      $scope.$apply();
    },
      // Error handler
      Relief.log.error
    );


    $scope.launchApp = function() {
      alert('launch')
    };


    $scope.setAppToEdit = function($event, app) {
      $event.stopPropagation();
      $scope.appToEdit = {
        manifest: app,
        settings: Settings.pluginMap.get(app),
      };
      angular.element('#modalDetailsInstalled').modal('show');
    };


    $scope.updateEditedApp = function() {
      Settings.updateInstalledApp(
        $scope.appToEdit.manifest.name,
        $scope.appToEdit.settings
      )
      .then(function() {
        Settings.pluginMap.set(
          $scope.appToEdit.manifest,
          $scope.appToEdit.settings
        );
        $scope.$apply();
        angular.element('#modalDetailsInstalled').modal('hide');
      },
        Relief.log.error
      );
    };


    $scope.uninstallApp = function() {
      Settings.removeInstalledApp(
        $scope.appToEdit.manifest.name
      )
      .then(function() {
        Settings.pluginMap.delete($scope.appToEdit.manifest);
        $scope.installedPlugins = [...Settings.pluginMap.keys()];
        $scope.$apply();
        angular.element('#modalDetailsInstalled').modal('hide');
      },
        Relief.log.error
      );
    };


    $scope.setAppToInstall = function(app) {
      $scope.appToInstall = app;
    };


    $scope.installApp = function() {
      Relief.plugin.install($scope.appToInstall.name)
      .then(function() {
        return Settings.addInstalledApp($scope.appToInstall);
      })
      .then(function() {


        angular.element('#modalDetails').modal('hide');

      }, function(err) {
        Relief.log.error(err);
        $scope.appToInstall.error = err.message;
        $scope.$apply();
      });
    };


    $scope.submitSearchForm = function() {
      Packages.getSearchResults($scope.forms.search)
      .then(function(data) {
        $scope.searchResults = data;
        $scope.$apply();
      },
        // Error handler
        Relief.log.error
      );
    };


    $scope.clearSearchResults = function() {
      $scope.searchResults = [];
    };

  };


  app.controller(
    'MainCtrl',
    [
      '$scope',
      'i18n',
      'Settings',
      'Packages',
      mainController,
    ]
  );


})();
