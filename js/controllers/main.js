(function() {


  const mainController = function(
    $scope, i18n, Settings, Packages
  ) {

    //$scope.searchForm = '';
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
    };


    Settings.loadSettings()
    .then(function() {
      i18n.loadStrings(Settings.settings.language)
    })
    //.then(Packages.getInstalled)
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
      // TODO
      // $scope.appToInstall.showInMenu = ;
    };


    $scope.installApp = function() {
      alert('install')
      const pluginDir = __dirname + '/../../../.';
      Relief.lib.nxtpm.Package.install($scope.appToInstall.name, pluginDir)
      .then(function() {
        alert('well ok hmmmm')
      },
        Relief.log.error
      );
      angular.element('#modalDetails').modal('hide');
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
