UPDATE tasks
SET archived=true
WHERE userId=$1 AND id=$2;