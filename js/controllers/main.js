(function() {


  const mainController = function(
    $scope, i18n, Settings, Packages, User
  ) {

    $scope.forms = {
      search: '',
    };
    $scope.installedApps = {};
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
    .then(User.loadSettings)
    .then(function() {
      $scope.installedApps = [...User.pluginMap.keys()];
      return i18n.loadStrings(Settings.data.language)
    })
    .then(Packages.getFeatured)
    .then(function(data) {
      $scope.featuredApps = data;
      $scope.$apply();
    },
      // Error handler
      Relief.log.error
    );


    $scope.launchApp = function(plugin) {
      Relief.emit('webview.open', plugin);
    };


    $scope.setAppToEdit = function($event, app) {
      $event.stopPropagation();
      $scope.appToEdit = {
        manifest: app,
        settings: User.pluginMap.get(app),
      };
      angular.element('#modalDetailsInstalled').modal('show');
    };


    $scope.updateEditedApp = function() {
      User.updatePlugin(
        $scope.appToEdit.manifest,
        $scope.appToEdit.settings
      )
      .then(function() {
        angular.element('#modalDetailsInstalled').modal('hide');
        Relief.emit('updateAppMenu');
      },
      function(err) {
        // TODO
      });
    };


    $scope.uninstallApp = function() {
      User.removePlugin(
        $scope.appToEdit.manifest
      )
      .then(function() {
        $scope.installedApps = [...User.pluginMap.keys()];
        $scope.$apply();
        angular.element('#modalDetailsInstalled').modal('hide');
        Relief.emit('updateAppMenu');
      },
      function(err) {
        // TODO
      });
    };


    $scope.setAppToInstall = function(app) {
      $scope.appToInstall = app;
    };


    $scope.installApp = function() {
      Relief.plugin.install($scope.appToInstall.name)
      .then(function() {
        return User.addPlugin($scope.appToInstall);
      })
      .then(function() {
        $scope.installedApps = [...User.pluginMap.keys()];
        $scope.$apply();
        angular.element('#modalDetails').modal('hide');
        Relief.emit('updateAppMenu');
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
      'User',
      mainController,
    ]
  );


})();
