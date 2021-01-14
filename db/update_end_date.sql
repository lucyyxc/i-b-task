UPDATE tasks
SET endDate=$3
WHERE userId=$1 AND id=$2;