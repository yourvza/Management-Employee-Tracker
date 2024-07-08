

--place the premade database given to us
INSERT INTO department (dept_name)
VALUES ('Engineering'),
       ('Finance'),
       ('Legal'),
       ('Sales');


INSERT INTO role (title, salary, department)
VALUES ('Sales Lead', 100000, 4),
       ('Salesperson', 80000, 4),
       ('Lead Engineer', 1500001, 1),
       ('Software Engineer', 120000, 1),
       ('Account Manager', 160000, 2),
       ('Accountant', 125000, 2),
       ('Legal Team Lead', 250000, 3),
       ('Lawyer', 190000, 3);


INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Aino', 'Aaltonen', 1, NULL),
       ('Benjamin', 'Bautista', 2, 1),
       ('Chen', 'Chiu', 3, NULL),
       ('David', 'Davenport', 4, 3),
       ('Esha', 'Ekta', 5, NULL),
       ('Fatima', 'Fernandez', 6, 5),
       ('Gabriel', 'Gomez', 7, NULL),
       ('Hiroko', 'Hasegawa', 8, 7);