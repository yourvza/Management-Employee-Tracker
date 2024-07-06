INSERT INTO role (title, salary, department_id)
VALUES
    ('Sales Lead', 200000, 1),
    ('Salesperson', 70000, 1),
    ('Lead Engineer', 200000, 2),
    ('Software Engineer', 220000, 2),
    ('Account Manager', 260000, 3),
    ('Accountant', 150000, 3),
    ('Legal Team Lead', 250000, 4),
    ('Lawyer', 190000, 4);

INSERT INTO department (name)
VALUES
    ('Sales'),
    ('Engineering'),
    ('Finance'),
    ('Legal');

    INSERT INTO employee
    (first_name, last_name, role_id, manager_id)
VALUES
    ('Molly', 'Beck', 1,),
    ('Emmie', 'Fitzgerald', 2, 1),
    ('Rylie', 'Vazquez', 3, ),
    ('Blair', 'Roberts', 4, 3),
    ('Melanie', 'Armstrongh', 5,),
    ('Audrey', 'Erickson', 6, 5),
    ('Promise', 'Gomez', 7,),
    ('Laurel ', 'Valencia', 8, 7);


  \c employees
