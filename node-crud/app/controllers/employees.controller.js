const Employee = require('../models/employee');
var moment = require('moment');

module.exports = {
    showEmployees: showEmployees,
    showSingle: showSingle,
    seedEmployees: seedEmployees,
    showCreate: showCreate,
    processCreate: processCreate,
    showEdit: showEdit,
    processEdit: processEdit,
    deleteEmployee: deleteEmployee,
    designationEmployees: designationEmployees
}
/**
 * Show all employees
 */
function showEmployees(req, res) {
    // get all employees   
    Employee.find({}, (err, employees) => {
        if (err) {
            res.status(404);
            res.send('Employees not found!');
        }

        // return a view with data

        res.render('pages/employees', {
            employees: employees,
            success: req.flash('success'),
            moment: moment
        });
    });
}

/**
 * find and Display only designation of an Employee
 */
function designationEmployees(req, res) {
Employee.findOne({'employee.designation': {$elemMatch: {designation: req.body.searchDesignation}}}, function (err, success) {

        if (err){
            return done(err);
        }    

        if (success) {

        // return a view with data
        res.render('pages/designation', {
            employees: success,
            success: req.flash('success')
        });

        } else {
            res.send('Employees not found with that Designation!');
            next();

        }

    });
}


/**
 * Show a single employee
 */
function showSingle(req, res) {
    // get a single employee
    Employee.findOne({ slug: req.params.slug }, (err, employee) => {
        if (err) {
            res.status(404);
            res.send('Employee not found!');
        }

        res.render('pages/single', {
            employee: employee,
            moment: moment,
            success: req.flash('success')
        });
    });
}

/**
 * Seed the database
 */
function seedEmployees(req, res) {
    // create some employees
    const employees = [
        { name: 'David', department: 'Clerical Staff', designation: 'Staff Manager', salary: '3000', dateofjoining: '12-11-2017', city: 'Delhi' },
        { name: 'John', department: 'Support Staff', designation: 'Technical Executive', salary: '20000', dateofjoining: '05-08-2017', city: 'Bangalore' },
        { name: 'Sneha', department: 'Operations Staff', designation: 'Operations Lead', salary: '22000', dateofjoining: '15-09-2017', city: 'Delhi' },
        { name: 'Spandana', department: 'Development Staff', designation: 'Developer', salary: '12000', dateofjoining: '16-06-2018', city: 'Bangalore' },
        { name: 'Luke', department: 'Management Staff', designation: 'Assistant Lead', salary: '20000', dateofjoining: '02-02-2018', city: 'Newyork' },
        { name: 'Rajdeep', department: 'Logistic Staff', designation: 'Logistics Manager', salary: '30000', dateofjoining: '04-05-2018', city: 'Singapore' },
        { name: 'Padma', department: 'Management Staff', designation: 'President', salary: '45000', dateofjoining: '08-08-2017', city: 'Singapore' },
        { name: 'Rajsekhar', department: 'Management Staff', designation: 'Chairman', salary: '50000', dateofjoining: '05-05-2017', city: 'California' },
        { name: 'Esther', department: 'Operations Staff', designation: 'Operations Manager', salary: '25000', dateofjoining: '09-11-2017', city: 'California' },
    ];

    // use the Employee model to insert/save
    Employee.remove({}, () => {
        for (employee of employees) {
            var newEmployee = new Employee(employee);
            newEmployee.save();
        }
    });

    // seeded!
    res.send('Database seeded!');
}

/**
 * Show the create form
 */
function showCreate(req, res) {
    res.render('pages/create', {
        moment: moment,
        errors: req.flash('errors')
    });
}

/**
 * Process the creation form
 */
function processCreate(req, res) {
    // validate information
    req.checkBody('name', 'Name is required.').notEmpty();
    req.checkBody('department', 'Department is required.').notEmpty();
    req.checkBody('designation', 'Designation is required.').notEmpty();
    req.checkBody('salary', 'Salary is required.').notEmpty();
    req.checkBody('dateofjoining', 'Date of Joining is required.').notEmpty();
    req.checkBody('city', 'City is required.').notEmpty();

    // if there are errors, redirect and save errors to flash
    const errors = req.validationErrors();
    if (errors) {
        req.flash('errors', errors.map(err => err.msg));
        return res.redirect('/employees/create');
    }

    // create a new employee
    const employee = new Employee({
        name: req.body.name,
        department: req.body.department,
        designation: req.body.designation,
        salary: req.body.salary,
        dateofjoining: req.body.dateofjoining,
        city: req.body.city
    });

    // save employee
    employee.save((err) => {
        if (err)
            throw err;

        // set a successful flash message
        req.flash('success', 'Successfuly created employee!');

        // redirect to the newly created employee
        res.redirect(`/employees/${employee.slug}`);
    });
}

/**
 * Show the edit form
 */
function showEdit(req, res) {
    Employee.findOne({ slug: req.params.slug }, (err, employee) => {
        res.render('pages/edit', {
            employee: employee,
            moment: moment,
            errors: req.flash('errors')
        });
    });
}

/**
 * Process the edit form
 */
function processEdit(req, res) {
    // validate information
    req.checkBody('name', 'Name is required.').notEmpty();
    req.checkBody('department', 'Department is required.').notEmpty();
    req.checkBody('designation', 'Designation is required.').notEmpty();
    req.checkBody('salary', 'Salary is required.').notEmpty();
    req.checkBody('dateofjoining', 'Date of Joining is required.').notEmpty();
    req.checkBody('city', 'City is required.').notEmpty();

    // if there are errors, redirect and save errors to flash
    const errors = req.validationErrors();
    if (errors) {
        req.flash('errors', errors.map(err => err.msg));
        return res.redirect(`/employees/${req.params.slug}/edit`);
    }

    // finding a current employee
    Employee.findOne({ slug: req.params.slug }, (err, employee) => {
        // updating that employee
        employee.name = req.body.name;
        employee.department = req.body.department;
        employee.designation = req.body.designation;
        employee.salary = req.body.salary;
        employee.dateofjoining = req.body.dateofjoining;
        employee.city = req.body.city;

        employee.save((err) => {
            if (err)
                throw err;

            // success flash message
            // redirect back to the /employees
            req.flash('success', 'Successfully updated employee.');
            res.redirect('/employees');
        });
    });

}

/**
 * Delete an employee
 */
function deleteEmployee(req, res) {
    Employee.remove({ slug: req.params.slug }, (err) => {
        // set flash data
        // redirect back to the employees page
        req.flash('success', 'Employee deleted!');
        res.redirect('/employees');
    });
}