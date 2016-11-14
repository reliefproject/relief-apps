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
        let aliasData;
        return Relief.nxt.request({
          requestType: 'getAlias',
          aliasName: query
        })
        .then(function(result) {
          if (result.data.aliasURI) {
            aliasData = result.data.aliasURI;
          }
          return Relief.nxt.request({
            requestType: 'searchTaggedData',
            query: query,
            // channel: '',
            includeData: true,
          });
        })
        .then(function(result) {
          return new Promise(function(resolve, reject) {
            if (!result.data.data) {
              return reject(result.data.err);
            }
            let returnVal = {
              query: query,
              package: {},
              similarPackages: [],
            };
            for (let i in result.data.data) {
              let data = result.data.data[i];
              let manifest = data.data;
              if (!manifest) {
                continue;
              }
              if (!data.isText) {
                manifest = Buffer.from(manifest, 'hex').toString();
              }
              try {
                manifest = JSON.parse(manifest);
              } catch (e) {
                continue;
              }
              Object.assign(data, manifest);
              if (data.transaction === aliasData) {
                returnVal.package = data;
                continue;
              }
              returnVal.similarPackages.push(data);
            }
            resolve(returnVal);
          });
        });
      },


    };
    return service;
  });

})();
