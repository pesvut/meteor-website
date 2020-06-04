const dateformat = require('dateformat')
const Sequelize = require('sequelize');
const creds = require('../credentials/mysql.json')
const sequelize = new Sequelize(creds.database, creds.user, creds.password, {
  dialect: 'mysql',
  timestamps: false
})

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })                                                                                                                                                                                                                               
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  }); 

const Image = sequelize.define('image', {
  //folder, file, path: folderPath(folder), date, camera}
  filePath: {
    type: Sequelize.STRING,
    primaryKey: true,
    allowNull: false,
  },
  date: {
    type: Sequelize.DATE(6),
    allowNull: false,
  },
  camera: {
    type: Sequelize.STRING,
  }
}, {
  // in aditional options, we index date for quick lookup
  indexes:[
    {
      unique: true,
      fields:['filePath']
    },{
      unique: false,
      fields:['date']
    }
  ]
});

Image.findByClosestTime = async function (date, number = 5) {
  try {
    //make date MySQL friendly
    const sqlDate = dateformat(date, "yyyy-mm-dd HH:MM:ss")

    const query = 
    `SELECT * FROM (
      ( SELECT *, TIMESTAMPDIFF(SECOND, '${sqlDate}', date) AS diff
          FROM images WHERE date >= '${sqlDate}'
          ORDER BY date ASC LIMIT ${number}
      ) UNION ( 
        SELECT *, TIMESTAMPDIFF(SECOND, '${sqlDate}', date) AS diff
          FROM images where date < '${sqlDate}'
          ORDER BY date DESC LIMIT ${number}
      )
    ) foo
    ORDER BY ABS(diff)
    LIMIT ${number-0+1};`

    let array = await sequelize.query(query)
    return array;

  } catch (err) {
    console.log("\nError getting closest events : \n", err.message)
    return null
  }
}

module.exports = Image