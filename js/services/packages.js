(function() {

  app.service('Packages', function() {
    let service = {


      featured: {},
      searchResults: {},


      getFeatured: () => {
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


      getSearchResults: query => {
        let aliasData;
        return Relief.nxt.request('getAlias', {
          aliasName: query,
        })
        .then(result => {
          if (result.data.aliasURI) {
            aliasData = result.data.aliasURI;
          }
          return Relief.nxt.request('searchTaggedData', {
            query: query,
            // Channel: '',
            includeData: true,
          });
        })
        .then(result => {
          const packages = result.data.data;
          let returnVal = {
            query: query,
            package: {},
            similarPackages: [],
          };
          for (let transaction of packages) {
            if (!transaction.data) {
              continue;
            }
            let manifest = transaction.isText
              ? transaction.data
              : Buffer.from(transaction.data, 'hex').toString();
            manifest = JSON.parse(manifest);

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
          return returnVal;
        });
      },


    };

    return service;

  });

})();
