UPDATE tasks
SET tags=$3
WHERE userId=$1 AND id=$2;