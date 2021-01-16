UPDATE tasks
SET sub=true
WHERE userId=$1 AND id=$2;