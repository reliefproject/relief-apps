(function() {

  app.service('Settings', function() {
    let service = {

      data: {},

      loadSettings: () => {
        return Relief.db.app.getDoc().then(data => {
          service.data = data;
        });
      },

    };

    return service;

  });

})();
