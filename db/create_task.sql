INSERT INTO tasks (id, userId, taskName, taskLabel, assignee, tags, startDate, endDate, status, custom, advice, notes, pintrest, blog, blogUrl, moneyTip, imageName, imageUrl, archived)
VALUES
($1, $2, $3, $4, $5, $6, $7, $8, 'not-started', true, '', '', '', '', '', '', '', '', false)
RETURNING *;