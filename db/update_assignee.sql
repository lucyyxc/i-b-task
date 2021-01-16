UPDATE tasks
SET assignee=$3
WHERE userId=$1 AND id=$2;