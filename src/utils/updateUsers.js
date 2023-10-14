const { userModel } = require('../models/user')

module.exports = async function updateUsers() {  
    // Actualiza todos los documentos de usuarios que tienen "settings" como array

    const users = await userModel.find();

    for (const user of users) {
       
          if (!user.settings.leng) {
            console.log("no tiene settings")
            user.settings = {
              leng: "en-US",
              verifyCode: null,
              newAccount: true,
              dateCreated: Date.now()
            }
          } else {
            user.settings.dateCreated = Date.now()
          }
          
          console.log(user.email)
          // Actualiza el documento del usuario con el nuevo objeto "settings"
          user.dateCreated ? delete user.dateCreated : null

          
          user.series.forEach(serie => {
            serie.dateAdded = Date.now();
            serie.dateModified = Date.now();
          });

          user.movies.forEach(movie => {
            movie.dateAdded = Date.now();
          });

          await user.save();
        
      }


}