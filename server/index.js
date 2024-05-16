try {
  require('../env');
}
catch(ex){
  console.log(`
  If running locally add env.js file to root directory
  set process.env.GOOGLE_API
  `);
}

const {
  seed,
  client,
} = require('./db');
const app = require('./app');

const init = async()=> {
  await client.connect();
  console.log('connected to database');
  const SQL = `
    DROP TABLE IF EXISTS projects;
    CREATE TABLE projects (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100)
    );
    INSERT INTO projects(name) VALUES ('The Black Market');
    INSERT INTO projects(name) VALUES ('Giovanni Paladino');
    INSERT INTO projects(name) VALUES ('Stinky Poo Poo');
  `;
  await client.query(SQL);

  if(process.env.SYNC){
    await seed();
    console.log('create your tables and seed data');
  }

  const port = process.env.PORT || 3000;
  app.listen(port, ()=> {
    console.log(`listening on port ${port}`);
  });
}

init();
