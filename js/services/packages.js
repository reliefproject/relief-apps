(function() {

  app.service('Packages', function() {
    let service = {


      featured: {},
      searchResults: {},


      getFeatured: () => {
        const featuredApps = ['test5', 'test6'];
        let promises = [];
        for (let app of featuredApps) {
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
          let promises = [];
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
            if (transaction.name === query) {
              continue;
            }
            promises.push(
              service.lookupAlias(transaction.transaction, transaction.name)
              .then(hasAlias => {
                if (!hasAlias) {
                  return;
                }
                returnVal.similarPackages.push({
                  transaction: transaction,
                  manifest: manifest,
                });
              })
            );
          }
          return Promise.all(promises).then(() => {
            return returnVal;
          });
        });
      },


      lookupAlias: (txid, aliasName) => {
        return Relief.nxt.request('getAlias', { aliasName })
        .then(result => {
          return new Promise((resolve, reject) => {
            if (!result.data || !result.data.aliasURI) {
              return resolve(false);
            }
            if (result.data.aliasURI !== txid) {
              return resolve(false);
            }
            resolve(true);
          });
        });
      },

    };

    return service;

  });

})();
