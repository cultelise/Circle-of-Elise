const bcrypt = require('bcrypt');
const { CONNECTION_STRING } = require('../utils/config');
const Sequelize = require('sequelize');
const sequelize = new Sequelize(CONNECTION_STRING, {
	dialect: 'postgres',
	dialectOptions: {
		ssl: {
			rejectUnauthorized: false,
		},
	},
});

module.exports = {
	seed: async (req, res) => {
		const saltRounds = 10;
		const passwordHash = await bcrypt.hash('test', saltRounds);
		const query = `

  DROP TABLE if exists post_tags;
  DROP TABLE if exists posts;
  DROP TABLE if exists tags;
  DROP TABLE if exists users;
  DROP TABLE if exists comments;
  DROP TABLE if exists user_comments;
  DROP TABLE if exists post_comments;


  CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(30),
    date DATE default CURRENT_DATE,
    time TIMESTAMP default CURRENT_TIMESTAMP,
    preview TEXT,
    content TEXT
  );
  
  CREATE TABLE tags (
    id SERIAL PRIMARY KEY,
    name VARCHAR(20)
  );
  
  CREATE TABLE post_tags (
    id SERIAL PRIMARY KEY,
    posts_id INT REFERENCES posts(id),
    tags_id INT REFERENCES tags(id)
  );		

  CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50),
    password VARCHAR(100),
    email VARCHAR(50)
  );

  CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    content TEXT,
  )

  CREATE TABLE user_comments (
    id SERIAL PRIMARY KEY,
    posts_id INT REFERENCES posts(id),
    users_id INT REFERENCES users(id)
  )

  CREATE TABLE post_comments (
    id SERIAL PRIMARY KEY,
    users_id INT REFERENCES user(id),
    comments_id INT REFERENCES comments(id)
  )
  
  INSERT INTO posts (title, preview, content)
  VALUES  ('test post', 'preview', 'This is a test post. blah blah blah blah blah blah blah');
  
  INSERT INTO tags (name)
  VALUES	('test');

  INSERT INTO users (username, password, email)
  VALUES  ('elise', '${passwordHash}', 'elise@test.com');
  `;
		sequelize
			.query(query)
			.then((dbRes) => res.status(200).send(dbRes[0]))
			.catch((err) => console.log(err));
	},
};
