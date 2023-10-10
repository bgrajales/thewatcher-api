const userModel = require('../thewatcher-api/src/models/user').userModel;

module.exports = function updateDatabase() {
    userModel.updateMany(
        {}, 
        { $set: { "series.$[].seriesStatus": "Canceled" } },
        { arrayFilters: [], multi: true },
        function(err, res) {
          if (err) throw err;
          console.log(res.nModified + " documentos actualizados");
        }
      );
};