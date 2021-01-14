UPDATE tasks
SET archived=false
WHERE userId=$1 AND id=$2;