UPDATE users
SET name=$2, assignee=$3
WHERE auth_id=$1;