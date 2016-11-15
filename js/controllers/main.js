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
      Relief.log.info(Settings.userData.installedPlugins)
      for (let k in Settings.userData.installedPlugins) {
        const pluginName = Settings.userData.installedPlugins[k];
        $scope.installedPlugins[pluginName] = Relief.plugin.loadPlugin(pluginName);
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


    $scope.setAppToEdit = function($event) {
      alert('set to edit')
      $event.stopPropagation();
      angular.element('#modalDetailsInstalled').modal('show');
    };


    $scope.updateEditedApp = function() {
      alert('update')
      angular.element('#modalDetailsInstalled').modal('hide');
    };


    $scope.uninstallApp = function() {
      alert('uninstall')
      angular.element('#modalDetailsInstalled').modal('hide');
    };


    $scope.setAppToInstall = function(app) {
      $scope.appToInstall = app;
    };


    $scope.installApp = function() {
      Relief.plugin.install($scope.appToInstall.name)
      .then(function() {
        return Settings.addInstalledApp($scope.appToInstall)
        .then(function() {
          angular.element('#modalDetails').modal('hide');
        });
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
