// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TodoList {

    struct Task {
        string content;
        bool completed;
    }

    Task[] public tasks; 

    event TaskCreated(string content);
    event TaskCompleted(uint index, bool completed);

    function createTask(string memory _content) public {
        tasks.push(Task(_content, false));
        emit TaskCreated(_content);
    }

    function toggleTaskCompletion(uint _index) public {
        require(_index < tasks.length, "Task does not exist.");
        tasks[_index].completed = !tasks[_index].completed;
        emit TaskCompleted(_index, tasks[_index].completed);
    }

    function getTask(uint _index) public view returns (string memory, bool) {
        require(_index < tasks.length, "Task does not exist.");
        Task memory task = tasks[_index];
        return (task.content, task.completed);
    }

}