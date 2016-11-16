(function() {

  app.service('Settings', function() {
    let service = {

      data: {},

      loadSettings: function() {
        return Relief.db.app.getDoc().then(function(data) {
          service.data = data;
        });
      },

    };

    return service;

  });

})();
