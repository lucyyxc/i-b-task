UPDATE tasks
SET imageName=$3, imageUrl=$4
WHERE userId=$1 AND id=$2;