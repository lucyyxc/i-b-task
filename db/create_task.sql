INSERT INTO tasks
(id, userId, taskName, taskLabel, assignee, tags, startDate, endDate, status, custom, advice, notes, pintrest, blog, blogUrl, moneyTip, archived)
VALUES
($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
RETURNING *;