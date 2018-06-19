// create a new express router
const express      = require('express'),
  router           = express.Router(),
  mainController   = require('./controllers/main.controller'),
  employeesController = require('./controllers/employees.controller');

// export router
module.exports = router;

// define routes
// main routes
router.get('/', mainController.showHome);

// employee routes
router.get('/employees',       employeesController.showEmployees);

// seed employees
router.get('/employees/seed',  employeesController.seedEmployees);

// create employees
router.get('/employees/create',  employeesController.showCreate);
router.post('/employees/create', employeesController.processCreate);

// edit employees
router.get('/employees/:slug/edit', employeesController.showEdit);
router.post('/employees/:slug',     employeesController.processEdit);

// delete employees
router.get('/employees/:slug/delete', employeesController.deleteEmployee);

// show a single employee
router.get('/employees/:slug', employeesController.showSingle);

// Find and Display only designation of an Employee
router.get('/employees/designationSearch',  employeesController.designationEmployees);