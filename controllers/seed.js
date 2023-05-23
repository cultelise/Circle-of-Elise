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

  DROP TABLE if exists post_comments;
  DROP TABLE if exists user_comments;
  DROP TABLE if exists post_tags;
  DROP TABLE if exists posts;
  DROP TABLE if exists tags;
  DROP TABLE if exists users;
  DROP TABLE if exists comments;


  CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(30) NOT NULL,
    date DATE default CURRENT_DATE,
    time TIMESTAMP default CURRENT_TIMESTAMP,
    preview TEXT NOT NULL,
    content TEXT NOT NULL
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
    username VARCHAR(50) UNIQUE,
    password VARCHAR(100) NOT NULL,
    email VARCHAR(50) NOT NULL
  );

  CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    date DATE default CURRENT_DATE,
    time TIMESTAMP default CURRENT_TIMESTAMP,
    content TEXT
  );

  CREATE TABLE user_comments (
    id SERIAL PRIMARY KEY,
    comments_id INT REFERENCES comments(id),
    users_id INT REFERENCES users(id)
  );

  CREATE TABLE post_comments (
    id SERIAL PRIMARY KEY,
    posts_id INT REFERENCES posts(id),
    comments_id INT REFERENCES comments(id)
  );
  
  INSERT INTO posts (title, preview, content)
  VALUES  ('test post', 'preview', 'This is a test post. blah blah blah blah blah blah blah');
  
  INSERT INTO tags (name)
  VALUES	('test');

  INSERT INTO users (username, password, email)
  VALUES  ('elise', '${passwordHash}', 'elise@test.com');

  INSERT INTO comments (content)
  VALUES  ('test comment');

  INSERT INTO post_comments (posts_id, comments_id)
  VALUES  (1, 1);

  INSERT INTO user_comments (comments_id, users_id)
  VALUES (1, 1);
  `;
		sequelize
			.query(query)
			.then((dbRes) => res.status(200).send(dbRes[0]))
			.catch((err) => console.log(err));
	},
};
