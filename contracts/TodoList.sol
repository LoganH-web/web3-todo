// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title TodoList
 * @dev A simple on-chain todo list with gas optimization considerations
 * 
 * Gas Optimization Strategies Implemented:
 * 1. Use memory for function parameters (strings) instead of storage
 * 2. Use uint256 consistently (uint is alias for uint256, no gas difference)
 * 3. Delete by swap-and-pop pattern to avoid expensive array shifting
 * 4. Pack struct efficiently (uint256, strings, bool)
 * 5. Short-circuit validation with early require statements
 * 6. Use memory for temporary struct copies in loops
 */
contract TodoList {

    struct Task {
        uint id;              // Gas: Using uint256 for consistency
        string title;         // Gas: Stored in storage, unavoidable for dynamic data
        string description;   // Gas: Stored in storage
        bool completed;       // Gas: Boolean is efficient (1 byte)
        uint dueDate;         // Unix timestamp for due date (0 = no due date)
        address owner;        // Task owner (creator)
    }

    Task[] public tasks;      // Gas: Dynamic array in storage
    uint private nextTaskId = 1;

    event TaskCreated(uint id, string title, string description, uint dueDate, address owner);
    event TaskCompleted(uint id, bool completed);
    event TaskDeleted(uint id);

    function createTask(string memory _title, string memory _description, uint _dueDate) public {
        // Security: Validate input - prevent empty task titles
        require(bytes(_title).length > 0, "Task title cannot be empty");
        require(bytes(_title).length <= 200, "Task title too long (max 200 characters)");
        require(bytes(_description).length <= 1000, "Task description too long (max 1000 characters)");
        // Allow dueDate to be 0 (no due date) or a future timestamp
        if (_dueDate > 0) {
            require(_dueDate >= block.timestamp, "Due date must be in the future");
        }
        
        tasks.push(Task(nextTaskId, _title, _description, false, _dueDate, msg.sender));
        emit TaskCreated(nextTaskId, _title, _description, _dueDate, msg.sender);
        nextTaskId++;
    }

    function toggleTaskCompletion(uint _id) public {
        // Security: Validate task ID is within valid range
        require(_id > 0, "Invalid task ID: must be greater than 0");
        require(_id < nextTaskId, "Invalid task ID: task does not exist");
        
        // Find and toggle the task
        for (uint i = 0; i < tasks.length; i++) {
            if (tasks[i].id == _id) {
                // Ownership: Only task owner can modify task
                require(tasks[i].owner == msg.sender, "Only task owner can modify this task");
                tasks[i].completed = !tasks[i].completed;
                emit TaskCompleted(_id, tasks[i].completed);
                return;
            }
        }
        revert("Task not found: task may have been deleted");
    }

    function getTask(uint _id) public view returns (uint, string memory, string memory, bool, uint, address) {
        // Security: Validate task ID
        require(_id > 0, "Invalid task ID: must be greater than 0");
        require(_id < nextTaskId, "Invalid task ID: task does not exist");
        
        for (uint i = 0; i < tasks.length; i++) {
            if (tasks[i].id == _id) {
                Task memory task = tasks[i];
                return (task.id, task.title, task.description, task.completed, task.dueDate, task.owner);
            }
        }
        revert("Task not found: task may have been deleted");
    }

    function deleteTask(uint _id) public {
        // Security: Validate task ID
        require(_id > 0, "Invalid task ID: must be greater than 0");
        require(_id < nextTaskId, "Invalid task ID: task does not exist");
        require(tasks.length > 0, "No tasks to delete");
        
        for (uint i = 0; i < tasks.length; i++) {
            if (tasks[i].id == _id) {
                // Ownership: Only task owner can delete task
                require(tasks[i].owner == msg.sender, "Only task owner can delete this task");
                // Gas optimization: Move last element to deleted position, then pop
                tasks[i] = tasks[tasks.length - 1];
                tasks.pop();
                emit TaskDeleted(_id);
                return;
            }
        }
        revert("Task not found: task may have already been deleted");
    }

    function getAllTasks() public view returns (Task[] memory) {
        return tasks;
    }

    // Get tasks owned by a specific address
    function getUserTasks(address _user) public view returns (Task[] memory) {
        // First, count how many tasks belong to the user
        uint count = 0;
        for (uint i = 0; i < tasks.length; i++) {
            if (tasks[i].owner == _user) {
                count++;
            }
        }
        
        // Create array of appropriate size
        Task[] memory userTasks = new Task[](count);
        uint index = 0;
        
        // Populate array with user's tasks
        for (uint i = 0; i < tasks.length; i++) {
            if (tasks[i].owner == _user) {
                userTasks[index] = tasks[i];
                index++;
            }
        }
        
        return userTasks;
    }

    // Get tasks owned by the caller
    function getMyTasks() public view returns (Task[] memory) {
        return getUserTasks(msg.sender);
    }

}