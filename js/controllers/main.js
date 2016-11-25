(function() {


  const mainController = function(
    $scope, i18n, Settings, Packages, User
  ) {

    $scope.strings = {};
    $scope.forms = {
      search: '',
    };
    $scope.installedApps = [];
    $scope.featuredApps = [];
    $scope.searchResults = [];
    $scope.appToEdit = {
      showInMenu: true,
    };
    $scope.appToInstall = {
      responsibilityTaken: false,
      error: '',
    };
    $scope.modal = {
      selectedTab: 'details',
    };


    Settings.loadSettings()
    .then(User.loadSettings)
    .then(() => {
      $scope.installedApps = [...User.pluginMap.keys()];
      i18n.load(Settings.data.language, ['common', 'apps']);
      $scope.strings = i18n.strings;
      $scope.$apply();
      return Packages.getFeatured();
    })
    .then(data => {
      $scope.featuredApps = data;
      $scope.$apply();
    }, err => {
      Relief.log.error(err.stack || err);
    });


    $scope.launchApp = plugin => {
      Relief.emit('webview.open', plugin);
    };


    $scope.isInstalled = app => {
      if (!app || !app.transaction) { return false; }
      for (let installed of $scope.installedApps) {
        if (installed.name === app.transaction.name) {
          return true;
        }
      }
      return false;
    };


    $scope.isDeprecated = app => {
      if (!app || !app.manifest) { return; }
      if (!app.manifest.relief ||
          !Relief.lib.semver.valid(app.manifest.relief) ||
          Relief.lib.semver.lt(app.manifest.relief, Relief.env.version)
      ) {
        return true;
      }
      return false;
    };


    $scope.isDefaultPlugin = app => {
      if (!app || !app.manifest) { return false; }
      return Relief.env.defaultPlugins.indexOf(app.manifest.name) !== -1;
    };


    $scope.setAppToEdit = ($event, app) => {
      $event.stopPropagation();
      $scope.appToEdit = {
        manifest: app,
        settings: User.pluginMap.get(app),
      };
      $scope.modal.selectedTab = 'details';
      angular.element('#modalDetailsInstalled').modal('show');
    };


    $scope.updateEditedApp = () => {
      User.updatePlugin(
        $scope.appToEdit.manifest,
        $scope.appToEdit.settings
      )
      .then(() => {
        angular.element('#modalDetailsInstalled').modal('hide');
        Relief.emit('updateAppMenu');
      }, err => {
        Relief.log.error(err.stack || err);
      });
    };


    $scope.uninstallApp = () => {
      User.removePlugin(
        $scope.appToEdit.manifest
      )
      .then(() => {
        $scope.installedApps = [...User.pluginMap.keys()];
        $scope.$apply();
        angular.element('#modalDetailsInstalled').modal('hide');
        Relief.emit('updateAppMenu');
      }, err => {
        Relief.log.error(err.stack || err);
      });
    };


    $scope.setAppToInstall = app => {
      $scope.modal.selectedTab = 'details';
      $scope.appToInstall = app;
    };


    $scope.installApp = () => {
      Relief.plugin.install($scope.appToInstall.transaction.name)
      .then(User.addPlugin($scope.appToInstall))
      .then(() => {
        $scope.installedApps = [...User.pluginMap.keys()];
        $scope.$apply();
        angular.element('#modalDetails').modal('hide');
        Relief.emit('updateAppMenu');
      }, err => {
        Relief.log.error(err.stack || err);
        $scope.appToInstall.error = err.message || err;
        $scope.$apply();
      });
    };


    $scope.submitSearchForm = () => {
      Packages.getSearchResults($scope.forms.search)
      .then(data => {
        $scope.searchResults = data;
        $scope.$apply();
      }, err => {
        Relief.log.error(err.stack || err);
      });
    };


    $scope.clearSearchResults = () => $scope.searchResults = [];


  };


  app.controller(
    'MainCtrl',
    [
      '$scope',
      'i18n',
      'Settings',
      'Packages',
      'User',
      mainController,
    ]
  );


})();
