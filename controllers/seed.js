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

  CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE,
    password VARCHAR(100) NOT NULL,
    email VARCHAR(50) NOT NULL
  );

  CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    author VARCHAR(30) REFERENCES users(username),
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
  
  INSERT INTO users (username, password, email)
  VALUES  ('elise', '${passwordHash}', 'elise@test.com');
  
  INSERT INTO users (username, password, email)
  VALUES  ('bob', 'bleh', 'bob@test.com');

  INSERT INTO posts (title, author, preview, content)
  VALUES  ('Et Malesuada', 'bob', '...fames ac turpis egestas integer.', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. In dictum non consectetur a. Sit amet nisl purus in mollis nunc sed. Morbi tempus iaculis urna id volutpat lacus laoreet non curabitur. 
  <br> <br>Commodo sed egestas egestas fringilla phasellus faucibus scelerisque eleifend. Interdum consectetur libero id faucibus. Pellentesque elit eget gravida cum sociis natoque penatibus. Viverra nibh cras pulvinar mattis nunc sed blandit libero volutpat. Elementum nibh tellus molestie nunc non blandit massa enim nec. Et sollicitudin ac orci phasellus egestas tellus rutrum tellus pellentesque.

  <br> <br>Elit ut aliquam purus sit amet luctus venenatis. Sed elementum tempus egestas sed sed risus. Eu non diam phasellus vestibulum lorem sed risus ultricies. Arcu cursus euismod quis viverra nibh cras pulvinar. At tellus at urna condimentum. Mi quis hendrerit dolor magna eget est lorem ipsum dolor. Massa id neque aliquam vestibulum morbi blandit cursus risus. Mauris commodo quis imperdiet massa tincidunt nunc. Adipiscing enim eu turpis egestas pretium. Interdum velit euismod in pellentesque. Id aliquet risus feugiat in. Tincidunt vitae semper quis lectus nulla at. Porta lorem mollis aliquam ut porttitor. Eu non diam phasellus vestibulum lorem sed risus ultricies. Auctor elit sed vulputate mi sit amet mauris commodo quis. Pellentesque nec nam aliquam sem et tortor. Faucibus ornare suspendisse sed nisi lacus sed viverra. Purus sit amet luctus venenatis lectus magna fringilla urna.
  
  <br> <br>Elementum pulvinar etiam non quam lacus suspendisse faucibus interdum. Mattis vulputate enim nulla aliquet porttitor. Feugiat in ante metus dictum at tempor commodo ullamcorper. At auctor urna nunc id cursus metus. Suspendisse potenti nullam ac tortor vitae purus faucibus. Integer quis auctor elit sed. Arcu risus quis varius quam quisque id diam. Tellus cras adipiscing enim eu. Sollicitudin tempor id eu nisl nunc mi ipsum faucibus. Viverra mauris in aliquam sem fringilla ut morbi. Diam maecenas ultricies mi eget. Sagittis eu volutpat odio facilisis mauris. Auctor urna nunc id cursus metus aliquam. Ac tortor dignissim convallis aenean et tortor at risus. Et malesuada fames ac turpis egestas integer. Urna duis convallis convallis tellus id. Facilisis sed odio morbi quis commodo odio aenean sed adipiscing.');
  
  INSERT INTO tags (name)
  VALUES	('test');

  INSERT INTO comments (content)
  VALUES  ('hmmm, yes. very interesting.');

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
