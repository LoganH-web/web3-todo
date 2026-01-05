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
      const tx = await todoList.createTask("Buy groceries", "Milk, eggs, bread", 0);
      const receipt = await tx.wait();

      const tasks = await todoList.getAllTasks();
      expect(tasks.length).to.equal(1);
      expect(tasks[0][0]).to.equal(1n);
      expect(tasks[0][1]).to.equal("Buy groceries");
      expect(tasks[0][2]).to.equal("Milk, eggs, bread");
      expect(tasks[0][3]).to.equal(false);
      expect(tasks[0][4]).to.equal(0n); // dueDate
      expect(tasks[0][5]).to.equal(owner.address); // owner
    });

    it("Should emit TaskCreated event with correct data", async () => {
      await expect(todoList.createTask("Study Solidity", "Learn smart contracts", 0))
        .to.emit(todoList, "TaskCreated")
        .withArgs(1, "Study Solidity", "Learn smart contracts", 0, owner.address);
    });

    it("Should increment task ID for each new task", async () => {
      await todoList.createTask("Task 1", "Description 1", 0);
      await todoList.createTask("Task 2", "Description 2", 0);
      await todoList.createTask("Task 3", "Description 3", 0);

      const tasks = await todoList.getAllTasks();
      expect(tasks[0][0]).to.equal(1n);
      expect(tasks[1][0]).to.equal(2n);
      expect(tasks[2][0]).to.equal(3n);
    });

    it("Should allow multiple users to create tasks", async () => {
      await todoList.connect(owner).createTask("Owner task", "Description", 0);
      await todoList.connect(addr1).createTask("Addr1 task", "Description", 0);

      const tasks = await todoList.getAllTasks();
      expect(tasks.length).to.equal(2);
      expect(tasks[0][1]).to.equal("Owner task");
      expect(tasks[0][5]).to.equal(owner.address);
      expect(tasks[1][1]).to.equal("Addr1 task");
      expect(tasks[1][5]).to.equal(addr1.address);
    });

    it("Should revert when creating task with empty title", async () => {
      await expect(
        todoList.createTask("", "Description", 0)
      ).to.be.revertedWith("Task title cannot be empty");
    });

    it("Should allow empty description", async () => {
      await todoList.createTask("Valid Title", "", 0);
      const tasks = await todoList.getAllTasks();
      expect(tasks[0][1]).to.equal("Valid Title");
      expect(tasks[0][2]).to.equal("");
    });
  });

  // Test Getting Single Task
  describe("getTask", () => {
    beforeEach(async () => {
      await todoList.createTask("Test Task", "Test Description", 0);
    });

    it("Should retrieve task by ID with correct data", async () => {
      const [id, title, description, completed, dueDate, taskOwner] = await todoList.getTask(1);
      expect(id).to.equal(1n);
      expect(title).to.equal("Test Task");
      expect(description).to.equal("Test Description");
      expect(completed).to.equal(false);
      expect(dueDate).to.equal(0n);
      expect(taskOwner).to.equal(owner.address);
    });

    it("Should revert when task ID does not exist", async () => {
      await expect(todoList.getTask(999)).to.be.revertedWith("Invalid task ID: task does not exist");
    });

    it("Should revert when task ID is 0", async () => {
      await expect(todoList.getTask(0)).to.be.revertedWith("Invalid task ID: must be greater than 0");
    });
  });

  // Test Toggle Task Completion
  describe("toggleTaskCompletion", () => {
    beforeEach(async () => {
      await todoList.createTask("Complete me", "This task needs completion", 0);
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
        "Invalid task ID: task does not exist"
      );
    });

    it("Should allow multiple toggles by owner", async () => {
      await todoList.toggleTaskCompletion(1);
      await todoList.toggleTaskCompletion(1);
      await todoList.toggleTaskCompletion(1);
      const [, , , completed] = await todoList.getTask(1);
      expect(completed).to.equal(true);
    });

    it("Should revert when non-owner tries to toggle task", async () => {
      // Owner creates task
      await todoList.connect(owner).createTask("Owner's task", "Description", 0);
      
      // addr1 tries to toggle owner's task
      await expect(
        todoList.connect(addr1).toggleTaskCompletion(2)
      ).to.be.revertedWith("Only task owner can modify this task");
    });

    it("Should allow owner to toggle their own task", async () => {
      // addr1 creates their own task
      await todoList.connect(addr1).createTask("Addr1 task", "Description", 0);
      
      // addr1 can toggle their own task
      await todoList.connect(addr1).toggleTaskCompletion(2);
      const [, , , completed] = await todoList.getTask(2);
      expect(completed).to.equal(true);
    });
  });

  // Test Delete Task
  describe("deleteTask", () => {
    beforeEach(async () => {
      await todoList.createTask("Task 1", "Description 1", 0);
      await todoList.createTask("Task 2", "Description 2", 0);
      await todoList.createTask("Task 3", "Description 3", 0);
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
        "Invalid task ID: task does not exist"
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

    it("Should revert when non-owner tries to delete task", async () => {
      // Owner creates task
      await todoList.connect(owner).createTask("Owner's task", "Description", 0);
      
      // addr1 tries to delete owner's task
      await expect(
        todoList.connect(addr1).deleteTask(4)
      ).to.be.revertedWith("Only task owner can delete this task");
    });

    it("Should allow owner to delete their own task", async () => {
      // addr1 creates their own task
      await todoList.connect(addr1).createTask("Addr1 task", "Description", 0);
      
      // addr1 can delete their own task
      await todoList.connect(addr1).deleteTask(4);
      const tasks = await todoList.getAllTasks();
      expect(tasks.length).to.equal(3);
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
      await todoList.createTask("Task 1", "Description 1", 0);
      await todoList.createTask("Task 2", "Description 2", 0);
      await todoList.createTask("Task 3", "Description 3", 0);

      const tasks = await todoList.getAllTasks();
      expect(tasks.length).to.equal(3);
    });

    it("Should return tasks with correct structure", async () => {
      await todoList.createTask("Sample", "Sample Description", 0);
      const tasks = await todoList.getAllTasks();
      
      const task = tasks[0];
      expect(task[0]).to.be.a("bigint"); // id
      expect(task[1]).to.be.a("string"); // title
      expect(task[2]).to.be.a("string"); // description
      expect(task[3]).to.be.a("boolean"); // completed
      expect(task[4]).to.be.a("bigint"); // dueDate
      expect(task[5]).to.be.a("string"); // owner
    });

    it("Should reflect task status changes", async () => {
      await todoList.createTask("Task to complete", "Description", 0);
      await todoList.toggleTaskCompletion(1);

      const tasks = await todoList.getAllTasks();
      expect(tasks[0][3]).to.equal(true);
    });
  });

  // Integration Tests
  describe("Integration Tests", () => {
    it("Should handle complete workflow: create, complete, retrieve all", async () => {
      // Create tasks
      await todoList.createTask("Buy groceries", "Milk and eggs", 0);
      await todoList.createTask("Exercise", "30 minutes run", 0);

      // Complete first task
      await todoList.toggleTaskCompletion(1);

      // Retrieve all tasks
      const tasks = await todoList.getAllTasks();
      
      expect(tasks.length).to.equal(2);
      expect(tasks[0][3]).to.equal(true);
      expect(tasks[1][3]).to.equal(false);
    });

    it("Should handle create, complete, and delete workflow", async () => {
      await todoList.createTask("Temporary task", "To be deleted", 0);
      await todoList.createTask("Permanent task", "Stays", 0);

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
        await todoList.createTask(`Task ${i}`, `Description ${i}`, 0);
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
    it("Should handle long task titles and descriptions within limits", async () => {
      const longTitle = "a".repeat(200); // Max 200 characters
      const longDescription = "b".repeat(1000); // Max 1000 characters
      
      await todoList.createTask(longTitle, longDescription, 0);
      const [, title, description] = await todoList.getTask(1);
      
      expect(title).to.equal(longTitle);
      expect(description).to.equal(longDescription);
    });

    it("Should revert when title exceeds 200 characters", async () => {
      const tooLongTitle = "a".repeat(201);
      
      await expect(
        todoList.createTask(tooLongTitle, "Description", 0)
      ).to.be.revertedWith("Task title too long (max 200 characters)");
    });

    it("Should revert when description exceeds 1000 characters", async () => {
      const tooLongDescription = "b".repeat(1001);
      
      await expect(
        todoList.createTask("Title", tooLongDescription, 0)
      ).to.be.revertedWith("Task description too long (max 1000 characters)");
    });

    it("Should handle rapid task creation", async () => {
      const promises = [];
      for (let i = 0; i < 10; i++) {
        promises.push(todoList.createTask(`Task ${i}`, `Description ${i}`, 0));
      }
      await Promise.all(promises);

      const tasks = await todoList.getAllTasks();
      expect(tasks.length).to.equal(10);
    });

    it("Should handle special characters in task data", async () => {
      const specialChars = "!@#$%^&*()_+-=[]{}|;:',.<>?/";
      await todoList.createTask(specialChars, specialChars, 0);
      
      const [, title, description] = await todoList.getTask(1);
      expect(title).to.equal(specialChars);
      expect(description).to.equal(specialChars);
    });
  });

  // Test Ownership Features
  describe("Ownership Features", () => {
    describe("getUserTasks", () => {
      it("Should return only tasks owned by specified user", async () => {
        // Owner creates 2 tasks
        await todoList.connect(owner).createTask("Owner Task 1", "Description", 0);
        await todoList.connect(owner).createTask("Owner Task 2", "Description", 0);
        
        // addr1 creates 1 task
        await todoList.connect(addr1).createTask("Addr1 Task", "Description", 0);
        
        // Get owner's tasks
        const ownerTasks = await todoList.getUserTasks(owner.address);
        expect(ownerTasks.length).to.equal(2);
        expect(ownerTasks[0][5]).to.equal(owner.address);
        expect(ownerTasks[1][5]).to.equal(owner.address);
        
        // Get addr1's tasks
        const addr1Tasks = await todoList.getUserTasks(addr1.address);
        expect(addr1Tasks.length).to.equal(1);
        expect(addr1Tasks[0][5]).to.equal(addr1.address);
      });

      it("Should return empty array if user has no tasks", async () => {
        await todoList.connect(owner).createTask("Owner Task", "Description", 0);
        
        const addr1Tasks = await todoList.getUserTasks(addr1.address);
        expect(addr1Tasks).to.be.an("array");
        expect(addr1Tasks.length).to.equal(0);
      });

      it("Should update when user's task is deleted", async () => {
        await todoList.connect(owner).createTask("Task 1", "Description", 0);
        await todoList.connect(owner).createTask("Task 2", "Description", 0);
        
        let ownerTasks = await todoList.getUserTasks(owner.address);
        expect(ownerTasks.length).to.equal(2);
        
        await todoList.connect(owner).deleteTask(1);
        
        ownerTasks = await todoList.getUserTasks(owner.address);
        expect(ownerTasks.length).to.equal(1);
      });
    });

    describe("getMyTasks", () => {
      it("Should return tasks owned by caller", async () => {
        // Owner creates tasks
        await todoList.connect(owner).createTask("Owner Task 1", "Description", 0);
        await todoList.connect(owner).createTask("Owner Task 2", "Description", 0);
        
        // addr1 creates tasks
        await todoList.connect(addr1).createTask("Addr1 Task", "Description", 0);
        
        // Owner calls getMyTasks
        const ownerTasks = await todoList.connect(owner).getMyTasks();
        expect(ownerTasks.length).to.equal(2);
        
        // addr1 calls getMyTasks
        const addr1Tasks = await todoList.connect(addr1).getMyTasks();
        expect(addr1Tasks.length).to.equal(1);
      });

      it("Should return empty array if caller has no tasks", async () => {
        const tasks = await todoList.connect(addr1).getMyTasks();
        expect(tasks).to.be.an("array");
        expect(tasks.length).to.equal(0);
      });
    });

    describe("Multi-user scenarios", () => {
      it("Should maintain separate task ownership across users", async () => {
        // Multiple users create tasks
        await todoList.connect(owner).createTask("Owner Task", "Owner", 0);
        await todoList.connect(addr1).createTask("Addr1 Task", "Addr1", 0);
        
        // Verify total tasks
        const allTasks = await todoList.getAllTasks();
        expect(allTasks.length).to.equal(2);
        
        // Verify ownership
        expect(allTasks[0][5]).to.equal(owner.address);
        expect(allTasks[1][5]).to.equal(addr1.address);
        
        // Verify getUserTasks returns correct tasks
        const ownerTasks = await todoList.getUserTasks(owner.address);
        const addr1Tasks = await todoList.getUserTasks(addr1.address);
        
        expect(ownerTasks.length).to.equal(1);
        expect(addr1Tasks.length).to.equal(1);
        expect(ownerTasks[0][1]).to.equal("Owner Task");
        expect(addr1Tasks[0][1]).to.equal("Addr1 Task");
      });
    });
  });
});
