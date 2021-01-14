UPDATE tasks
SET startDate=$3
WHERE userId=$1 AND id=$2;