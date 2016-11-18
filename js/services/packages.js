(function() {

  app.service('Packages', function() {
    let service = {


      featured: {},
      searchResults: {},


      getFeatured: function() {
        const featuredApps = ['test5', 'test6'];
        let promises = [];
        for (let i in featuredApps) {
          const app = featuredApps[i];
          promises.push(
            Relief.plugin.info(app)
          );
        }
        return Promise.all(promises);
      },


      getSearchResults: function(query) {
        let aliasData;
        return Relief.nxt.request('getAlias', {
          aliasName: query,
        })
        .then(function(result) {
          if (result.data.aliasURI) {
            aliasData = result.data.aliasURI;
          }
          return Relief.nxt.request('searchTaggedData', {
            query: query,
            // Channel: '',
            includeData: true,
          });
        })
        .then(function(result) {
          return new Promise(function(resolve, reject) {
            if (!result.data.data) {
              return reject(result.data.err);
            }
            const packages = result.data.data;
            let returnVal = {
              query: query,
              package: {},
              similarPackages: [],
            };
            for (let i in packages) {
              let transaction = packages[i];
              let manifest = transaction.data;
              if (!manifest) {
                continue;
              }
              if (!transaction.isText) {
                manifest = Buffer.from(manifest, 'hex').toString();
              }
              try {
                manifest = JSON.parse(manifest);
              } catch (e) {
                continue;
              }
              if (transaction.transaction === aliasData) {
                returnVal.package = {
                  transaction: transaction,
                  manifest: manifest,
                };
                continue;
              }
              returnVal.similarPackages.push({
                transaction: transaction,
                manifest: manifest,
              });
            }
            resolve(returnVal);
          });
        });
      },


    };
    return service;
  });

})();
