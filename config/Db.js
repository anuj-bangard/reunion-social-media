require("dotenv").config();
const { Pool } = require('pg')
const connectionString = process.env.DATABASE_URL

const pool = new Pool({
    connectionString,
    ssl: {
        rejectUnauthorized: false,
    },
})

pool.connect((err) => {
    if (err) {
        return console.error(err);
    }
    console.log("PostgreSQL DATABASE CONNECTED");
});

/*
CREATE TABLE AND INSERT DUMMY DATA FOR FIRST TIME
*/

const text = `CREATE TABLE IF NOT EXISTS users(
    user_id SERIAL PRIMARY KEY,
    email VARCHAR(255),
    name VARCHAR(255),
    password VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS posts(
    post_id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    description VARCHAR(255),
    created_at TIMESTAMPTZ,
    user_id INTEGER
);

CREATE TABLE IF NOT EXISTS comments(
    comment_id SERIAL PRIMARY KEY,
    comment VARCHAR(255),
    post_id INTEGER,
    user_id INTEGER
);


CREATE TABLE IF NOT EXISTS likes(
    user_id INTEGER,
    post_id INTEGER
);

CREATE TABLE IF NOT EXISTS follow_list(
    user_id INTEGER,
    following_user_id INTEGER
);

INSERT INTO USERS(user_id, email, name, password) VALUES(1,'demo@gmail.com','demo','demopassword') ON CONFLICT(user_id) DO NOTHING;
INSERT INTO USERS(user_id, email, name, password) VALUES(2,'demo2@gmail.com','demo2','demopassword') ON CONFLICT(user_id) DO NOTHING;
INSERT INTO USERS(user_id, email, name, password) VALUES(3,'demo3@gmail.com','demo3','demopassword') ON CONFLICT(user_id) DO NOTHING;
`

pool.query(text, (err, res) => {
    if (err) {
        console.log(err.stack)
    }
})

module.exports = {
    pool
}