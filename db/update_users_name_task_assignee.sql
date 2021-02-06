UPDATE tasks
SET assignee=$3
WHERE userId=$1 AND assignee=$2;