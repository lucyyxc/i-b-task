UPDATE tasks
SET notes=$3
WHERE userId=$1 AND id=$2;