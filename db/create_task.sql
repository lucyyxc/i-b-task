INSERT INTO tasks (id, userId, taskName, taskLabel, assignee, tags, startDate, endDate, status, custom, advice, notes, pintrest, blog, blogUrl, moneyTip, imageName, imageUrl, archived)
VALUES
($1, $2, $3, $4, $5, '', $6, $7, $8, true, 'Your task, your rules! Add any notes or links in the notes section below.', $9, '', '', '', '', '', '', false)
RETURNING *;