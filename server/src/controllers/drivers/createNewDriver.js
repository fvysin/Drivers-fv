const { Driver, Team } = require('../../db');

const postDriver = async (forename, surname, description, image, nationality, dob, arrTeams) => {
    //primero busca a ver si ya existe el piloto, busca por nombre y apellido. Si existe lanza error
  const conductorExist = await Driver.findOne({
        where: {
          forename,
          surname,
        },
      });
    


      
      if (conductorExist) {
        throw new Error('El piloto ya existe en la base de datos.');
      }
    //si no existe lo crea. Luego se fija si exite el equipo, sino lo crea 
    const newDriver = await Driver.create({
        forename,
        surname,
        description,
        image,
        nationality,
        dob
    })

    for (const teamName of arrTeams) {
      const [team, created] = await Team.findOrCreate({
        where: { name: teamName },
      });
      await newDriver.addTeam(team);
    }

      return newDriver;
}

module.exports = postDriver;