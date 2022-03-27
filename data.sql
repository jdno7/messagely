DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS messages;

CREATE TABLE users (
    username text PRIMARY KEY,
    password text NOT NULL,
    first_name text NOT NULL,
    last_name text NOT NULL,
    phone text NOT NULL,
    join_at timestamp without time zone NOT NULL,
    last_login_at timestamp with time zone
);

CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    from_username text NOT NULL REFERENCES users,
    to_username text NOT NULL REFERENCES users,
    body text NOT NULL,
    sent_at timestamp with time zone NOT NULL,
    read_at timestamp with time zone
);

-- INSERT INTO messages (
--     from_username, 
--     to_username, 
--     body, 
--     sent_at, 
--     read_at
-- )
-- VALUES (
--     'jdtest',
--     'dh2007',
--     'Testing Messages and User relationships and joins',
--     '2018-09-08 12:20:07-07',
--     '2018-09-08 12:20:07-07'
-- );
-- INSERT INTO users (
--     username, 
--     password, 
--     first_name, 
--     last_name, 
--     phone, 
--     join_at
-- )
-- VALUES (
--     'jdtest',
--     'password',
--     'JD',
--     'Hans',
--     763-238-7206,
--     '2018-09-08 12:20:07-07'
-- );

-- SELECT * FROM messages
-- WHERE sent_by = 'jdtest'