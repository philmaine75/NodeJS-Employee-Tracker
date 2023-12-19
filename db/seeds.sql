INSERT INTO department (department_name)
VALUES  ("Restaurant"),
        ("Bar"),
        ("Functions");

INSERT INTO role (title, salary, department_id)
VALUES  ('Manager', "70000", 1),
        ('Supervisor', "60000", 1),
        ('Staff', "50000", 1),
        ('Manager', "60000", 2),
        ('Supervisor', "50000", 2),
        ('Staff', "40000", 2),
        ('Manager', "80000", 3),
        ('Supervisor', "70000", 3),
        ('Staff', "60000", 3);

INSERT INTO employee (first_name, last_name, role_id)
VALUES  ('Bruce', "Wayne", 1),
        ('Michael', "Jackson", 2),
        ('Walter', "White", 3),
        ('Clark', 'Kent', 4);