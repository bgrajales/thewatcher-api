const { userModel } = require('../models/user')

module.exports = async function updateUsers() {  
    // Actualiza todos los documentos de usuarios que tienen "settings" como array

    const users = await userModel.find({"settings": {$type: "array"}});

    console.log(users)

    for (const user of users) {
        console.log(user.settings)
        // Verifica si "settings" es un array y tiene los campos esperados
       
            console.log("in")
          // Mapea los valores existentes al nuevo objeto "settings"
          const newSettings = {
            leng: "en-US", // o user.settings.find(item => item.leng).leng si "leng" no está siempre en la primera posición
            verifyCode: null,
            newAccount: false,
            // ... otros campos necesarios
          };
    
          // Actualiza el documento del usuario con el nuevo objeto "settings"
          user.settings = newSettings;
          await user.save();
        
      }

      console.log('Migración completada');

}