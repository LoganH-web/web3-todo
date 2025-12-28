// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TodoList {

    struct Task {
        uint id;
        string title;
        string description;
        bool completed;
    }

    Task[] public tasks;
    uint private nextTaskId = 1;

    event TaskCreated(uint id, string title, string description);
    event TaskCompleted(uint id, bool completed);
    event TaskDeleted(uint id);

    function createTask(string memory _title, string memory _description) public {
        tasks.push(Task(nextTaskId, _title, _description, false));
        emit TaskCreated(nextTaskId, _title, _description);
        nextTaskId++;
    }

    function toggleTaskCompletion(uint _id) public {
        require(_id > 0 && _id < nextTaskId, "Task does not exist.");
        for (uint i = 0; i < tasks.length; i++) {
            if (tasks[i].id == _id) {
                tasks[i].completed = !tasks[i].completed;
                emit TaskCompleted(_id, tasks[i].completed);
                return;
            }
        }
        revert("Task not found");
    }

    function getTask(uint _id) public view returns (uint, string memory, string memory, bool) {
        require(_id > 0, "Task does not exist.");
        for (uint i = 0; i < tasks.length; i++) {
            if (tasks[i].id == _id) {
                Task memory task = tasks[i];
                return (task.id, task.title, task.description, task.completed);
            }
        }
        revert("Task not found");
    }

    function deleteTask(uint _id) public {
        require(_id > 0 && _id < nextTaskId, "Task does not exist.");
        for (uint i = 0; i < tasks.length; i++) {
            if (tasks[i].id == _id) {
                tasks[i] = tasks[tasks.length - 1];
                tasks.pop();
                emit TaskDeleted(_id);
                return;
            }
        }
        revert("Task not found");
    }

    function getAllTasks() public view returns (Task[] memory) {
        return tasks;
    }

}