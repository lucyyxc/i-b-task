CREATE TABLE IF NOT EXISTS tasks(
    id INT PRIMARY KEY,
    userId TEXT,
    taskName VARCHAR(180),
    taskLabel VARCHAR(180),
    assignee VARCHAR(10),
    tags VARCHAR(180),
    startDate VARCHAR(180),
    endDate VARCHAR(180),
    status VARCHAR(180),
    custom bool,
    advice VARCHAR(180),
    notes VARCHAR(180),
    pintrest VARCHAR(180),
    blog VARCHAR(180),
    moneyTip VARCHAR(180),
    archived bool
);