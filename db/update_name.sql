UPDATE tasks
SET taskLabel=$3
WHERE userId=$1 AND id=$2;