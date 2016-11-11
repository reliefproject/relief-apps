(function() {

  app.service('Packages', function() {
    let service = {

      installed: {},
      features: {},
      searchResults: {},


      getInstalled: function() {
        return Relief.db.user.getDoc().then(function(data) {

        });
      },


      getFeatured: function() {
        const featuredApps = ["test5", "test5"];
        let promises = [];
        for (let i in featuredApps) {
          const app = featuredApps[i];
          promises.push(
            Relief.plugin.getPackageInfo(app)
          );
        }
        return Promise.all(promises);
      },


      getSearchResults: function(query) {
        return Relief.nxt.request({
          requestType: 'searchTaggedData',
          query: query,
          // channel: '',
          includeData: true,
        })
        .then(function(result) {
          return new Promise(function(resolve, reject) {
            if (!result.data.data) {
              return reject(result.data.err);
            }
            resolve(result.data.data);
          });
        });
        // TODO check if alias === name
      },


    };
    return service;
  });

})();
