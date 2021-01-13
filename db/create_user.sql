INSERT INTO users
(name, email, emailAgree, assignee, weddingDate, birthday, collabAdded, collabID, sub, timeSelected, auth_id)
VALUES
( $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
RETURNING *;