UPDATE tasks
SET status=$3
WHERE userId=$1 AND id=$2;