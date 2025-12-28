const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("TodoList", () => {
  let todoList;
  let owner;
  let addr1;

  beforeEach(async () => {
    [owner, addr1] = await ethers.getSigners();
    const TodoList = await ethers.getContractFactory("TodoList");
    todoList = await TodoList.deploy();
    await todoList.waitForDeployment();
  });

  // Test Contract Deployment
  describe("Deployment", () => {
    it("Should deploy successfully", async () => {
      expect(todoList.target).to.be.a("string");
      expect(todoList.target).to.not.be.empty;
    });

    it("Should initialize with empty task array", async () => {
      const tasks = await todoList.getAllTasks();
      expect(tasks.length).to.equal(0);
    });
  });

  // Test Creating Tasks
  describe("createTask", () => {
    it("Should create a task with correct properties", async () => {
      const tx = await todoList.createTask("Buy groceries", "Milk, eggs, bread");
      const receipt = await tx.wait();

      const tasks = await todoList.getAllTasks();
      expect(tasks.length).to.equal(1);
      expect(tasks[0][0]).to.equal(1n);
      expect(tasks[0][1]).to.equal("Buy groceries");
      expect(tasks[0][2]).to.equal("Milk, eggs, bread");
      expect(tasks[0][3]).to.equal(false);
    });

    it("Should emit TaskCreated event with correct data", async () => {
      await expect(todoList.createTask("Study Solidity", "Learn smart contracts"))
        .to.emit(todoList, "TaskCreated")
        .withArgs(1, "Study Solidity", "Learn smart contracts");
    });

    it("Should increment task ID for each new task", async () => {
      await todoList.createTask("Task 1", "Description 1");
      await todoList.createTask("Task 2", "Description 2");
      await todoList.createTask("Task 3", "Description 3");

      const tasks = await todoList.getAllTasks();
      expect(tasks[0][0]).to.equal(1n);
      expect(tasks[1][0]).to.equal(2n);
      expect(tasks[2][0]).to.equal(3n);
    });

    it("Should allow multiple users to create tasks", async () => {
      await todoList.connect(owner).createTask("Owner task", "Description");
      await todoList.connect(addr1).createTask("Addr1 task", "Description");

      const tasks = await todoList.getAllTasks();
      expect(tasks.length).to.equal(2);
      expect(tasks[0][1]).to.equal("Owner task");
      expect(tasks[1][1]).to.equal("Addr1 task");
    });

    it("Should handle empty title and description", async () => {
      await todoList.createTask("", "");
      const tasks = await todoList.getAllTasks();
      expect(tasks[0][1]).to.equal("");
      expect(tasks[0][2]).to.equal("");
    });
  });

  // Test Getting Single Task
  describe("getTask", () => {
    beforeEach(async () => {
      await todoList.createTask("Test Task", "Test Description");
    });

    it("Should retrieve task by ID with correct data", async () => {
      const [id, title, description, completed] = await todoList.getTask(1);
      expect(id).to.equal(1n);
      expect(title).to.equal("Test Task");
      expect(description).to.equal("Test Description");
      expect(completed).to.equal(false);
    });

    it("Should revert when task ID does not exist", async () => {
      await expect(todoList.getTask(999)).to.be.revertedWith("Task not found");
    });

    it("Should revert when task ID is 0", async () => {
      await expect(todoList.getTask(0)).to.be.revertedWith("Task does not exist.");
    });
  });

  // Test Toggle Task Completion
  describe("toggleTaskCompletion", () => {
    beforeEach(async () => {
      await todoList.createTask("Complete me", "This task needs completion");
    });

    it("Should toggle task completion from false to true", async () => {
      await todoList.toggleTaskCompletion(1);
      const [, , , completed] = await todoList.getTask(1);
      expect(completed).to.equal(true);
    });

    it("Should toggle task completion from true back to false", async () => {
      await todoList.toggleTaskCompletion(1);
      await todoList.toggleTaskCompletion(1);
      const [, , , completed] = await todoList.getTask(1);
      expect(completed).to.equal(false);
    });

    it("Should emit TaskCompleted event with correct data", async () => {
      await expect(todoList.toggleTaskCompletion(1))
        .to.emit(todoList, "TaskCompleted")
        .withArgs(1, true);
    });

    it("Should revert when task ID does not exist", async () => {
      await expect(todoList.toggleTaskCompletion(999)).to.be.revertedWith(
        "Task does not exist."
      );
    });

    it("Should allow multiple toggles", async () => {
      await todoList.toggleTaskCompletion(1);
      await todoList.toggleTaskCompletion(1);
      await todoList.toggleTaskCompletion(1);
      const [, , , completed] = await todoList.getTask(1);
      expect(completed).to.equal(true);
    });
  });

  // Test Delete Task
  describe("deleteTask", () => {
    beforeEach(async () => {
      await todoList.createTask("Task 1", "Description 1");
      await todoList.createTask("Task 2", "Description 2");
      await todoList.createTask("Task 3", "Description 3");
    });

    it("Should delete a task by ID", async () => {
      await todoList.deleteTask(2);
      const tasks = await todoList.getAllTasks();
      expect(tasks.length).to.equal(2);
    });

    it("Should emit TaskDeleted event", async () => {
      await expect(todoList.deleteTask(2))
        .to.emit(todoList, "TaskDeleted")
        .withArgs(2);
    });

    it("Should revert when deleting non-existent task", async () => {
      await expect(todoList.deleteTask(999)).to.be.revertedWith(
        "Task does not exist."
      );
    });

    it("Should maintain remaining tasks after deletion", async () => {
      await todoList.deleteTask(1);
      const tasks = await todoList.getAllTasks();
      
      // Find tasks 2 and 3 in the remaining array
      const task2 = tasks.find(t => t[0] === 2n);
      const task3 = tasks.find(t => t[0] === 3n);
      
      expect(task2).to.exist;
      expect(task3).to.exist;
    });

    it("Should handle deletion of last task", async () => {
      await todoList.deleteTask(3);
      const tasks = await todoList.getAllTasks();
      expect(tasks.length).to.equal(2);
    });

    it("Should handle deletion of first task", async () => {
      await todoList.deleteTask(1);
      const tasks = await todoList.getAllTasks();
      expect(tasks.length).to.equal(2);
    });
  });

  // Test Get All Tasks
  describe("getAllTasks", () => {
    it("Should return empty array when no tasks exist", async () => {
      const tasks = await todoList.getAllTasks();
      expect(tasks).to.be.an("array");
      expect(tasks.length).to.equal(0);
    });

    it("Should return all created tasks", async () => {
      await todoList.createTask("Task 1", "Description 1");
      await todoList.createTask("Task 2", "Description 2");
      await todoList.createTask("Task 3", "Description 3");

      const tasks = await todoList.getAllTasks();
      expect(tasks.length).to.equal(3);
    });

    it("Should return tasks with correct structure", async () => {
      await todoList.createTask("Sample", "Sample Description");
      const tasks = await todoList.getAllTasks();
      
      const task = tasks[0];
      expect(task[0]).to.be.a("bigint"); // id
      expect(task[1]).to.be.a("string"); // title
      expect(task[2]).to.be.a("string"); // description
      expect(task[3]).to.be.a("boolean"); // completed
    });

    it("Should reflect task status changes", async () => {
      await todoList.createTask("Task to complete", "Description");
      await todoList.toggleTaskCompletion(1);

      const tasks = await todoList.getAllTasks();
      expect(tasks[0][3]).to.equal(true);
    });
  });

  // Integration Tests
  describe("Integration Tests", () => {
    it("Should handle complete workflow: create, complete, retrieve all", async () => {
      // Create tasks
      await todoList.createTask("Buy groceries", "Milk and eggs");
      await todoList.createTask("Exercise", "30 minutes run");

      // Complete first task
      await todoList.toggleTaskCompletion(1);

      // Retrieve all tasks
      const tasks = await todoList.getAllTasks();
      
      expect(tasks.length).to.equal(2);
      expect(tasks[0][3]).to.equal(true);
      expect(tasks[1][3]).to.equal(false);
    });

    it("Should handle create, complete, and delete workflow", async () => {
      await todoList.createTask("Temporary task", "To be deleted");
      await todoList.createTask("Permanent task", "Stays");

      await todoList.toggleTaskCompletion(1);
      await todoList.deleteTask(1);

      const tasks = await todoList.getAllTasks();
      expect(tasks.length).to.equal(1);
      expect(tasks[0][0]).to.equal(2n);
      expect(tasks[0][1]).to.equal("Permanent task");
    });

    it("Should maintain data integrity with multiple operations", async () => {
      // Create multiple tasks
      for (let i = 1; i <= 5; i++) {
        await todoList.createTask(`Task ${i}`, `Description ${i}`);
      }

      // Perform various operations
      await todoList.toggleTaskCompletion(2);
      await todoList.toggleTaskCompletion(4);
      await todoList.deleteTask(3);

      const tasks = await todoList.getAllTasks();
      expect(tasks.length).to.equal(4);

      // Verify remaining tasks
      const task2 = tasks.find(t => t[0] === 2n);
      expect(task2[3]).to.equal(true);
    });
  });

  // Edge Cases
  describe("Edge Cases", () => {
    it("Should handle very long task titles and descriptions", async () => {
      const longTitle = "a".repeat(256);
      const longDescription = "b".repeat(512);
      
      await todoList.createTask(longTitle, longDescription);
      const [, title, description] = await todoList.getTask(1);
      
      expect(title).to.equal(longTitle);
      expect(description).to.equal(longDescription);
    });

    it("Should handle rapid task creation", async () => {
      const promises = [];
      for (let i = 0; i < 10; i++) {
        promises.push(todoList.createTask(`Task ${i}`, `Description ${i}`));
      }
      await Promise.all(promises);

      const tasks = await todoList.getAllTasks();
      expect(tasks.length).to.equal(10);
    });

    it("Should handle special characters in task data", async () => {
      const specialChars = "!@#$%^&*()_+-=[]{}|;:',.<>?/";
      await todoList.createTask(specialChars, specialChars);
      
      const [, title, description] = await todoList.getTask(1);
      expect(title).to.equal(specialChars);
      expect(description).to.equal(specialChars);
    });
  });
});
