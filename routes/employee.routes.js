const express = require('express');
const { EmployeeModel } = require('../model/employee.model')
const employeeRouter = express.Router();

// Add Employee
employeeRouter.post('/add', async (req, res) => {
    try {
        const employee = new EmployeeModel(req.body);
        console.log(req.body)
        await employee.save();
        res.status(200).json({ msg: 'new employee is added', employee: req.body })
    } catch (error) {
        res.status(400).json({ error: error })
    }
});


// get employees
employeeRouter.get('/', async (req, res) => {
    try {
        const page = req.query.page ? parseInt(req.query.page) : 1;
        const limit = 5;
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;

        const employees = await EmployeeModel.find().skip(startIndex).limit(limit);
        const totalEmployees = await EmployeeModel.countDocuments();

        const result = {
            totalEmployees: totalEmployees,
            currentPage: page,
            employees: employees,
        };

        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ error: error });
    }
});


// Filter Employees by Department
employeeRouter.get('/filter', async (req, res) => {
    try {
        const department = req.query.department;

        const employees = await EmployeeModel.find({ department: department });

        res.status(200).json(employees);
    } catch (error) {
        res.status(400).json({ error: error });
    }
});


// Sort Employees by Salary
employeeRouter.get('/sort', async (req, res) => {
    try {
        const sortBy = req.query.sortBy;
        
        const employees = await EmployeeModel.find().sort({ salary: sortBy });

        res.status(200).json(employees);
    } catch (error) {
        res.status(400).json({ error: error });
    }
});


// Search Employee by First Name
employeeRouter.get('/search', async (req, res) => {
    try {
        const firstName = req.query.firstName;

        const employees = await EmployeeModel.find({
            first_name: { $regex: firstName, $options: 'i' },
        });

        res.status(200).json(employees);
    } catch (error) {
        res.status(400).json({ error: error });
    }
});


// Delete Employee
employeeRouter.delete('/delete/:id', async (req, res) => {
    try {
        const employeeId = req.params.id;

        // Check if the employee exists
        const employee = await EmployeeModel.findById({_id: employeeId});
        if (!employee) {
            return res.status(404).json({ error: 'Employee not found' });
        }

        // Delete the employee
        await EmployeeModel.findByIdAndDelete(employeeId);

        res.status(200).json({ msg: 'Employee deleted successfully' });
    } catch (error) {
        res.status(400).json({ error: error });
    }
});


// Edit/Update Employee
employeeRouter.patch('/update/:id', async (req, res) => {
    try {
        const employeeId = req.params.id;
        const updates = req.body;

        // Check if the employee exists
        const employee = await EmployeeModel.findById({_id: employeeId});
        if (!employee) {
            return res.status(404).json({ error: 'Employee not found' });
        }

        // Update the employee
        await EmployeeModel.findByIdAndUpdate(employeeId, updates);

        res.status(200).json({ msg: 'Employee updated successfully' });
    } catch (error) {
        res.status(400).json({ error: error });
    }
});

module.exports = { employeeRouter }
