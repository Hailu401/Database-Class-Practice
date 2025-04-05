const express = require("express");
const app = express();
const mysql = require("mysql2");
const cors = require("cors");

// Middle ware to extract info from the html body name attribute
app.use(
	express.urlencoded({
		extended: true,
	})
);

// Middle ware to extract info from the frontend that are sent through json
app.use(express.json());

// Middle ware to let frontend app requests to read or use data
app.use(cors());

app.get("/", (req, res) => res.send("Up and running..."));

// User account info
const connection = mysql.createConnection({
	host: "localhost",
	user: "database-admin",
	password: "database-admin",
	database: "database-admin",
	
});

// // Connect to MySQL
connection.connect((err) => {
	if (err) console.log(err);
	else console.log("Connected to MySQL");
});

// Route: /create-table => To create the tables
app.get("/create-table", (req, res) => {
	// Putting Query on a variable
	let name = `CREATE TABLE if not exists customers(
        customer_id int auto_increment, 
        name VARCHAR(255) not null,
        PRIMARY KEY (customer_id)
        )`;

	let address = `CREATE TABLE if not exists address(
        address_id int auto_increment,
        customer_id int(11) not null,
        address VARCHAR(255) not null,
        PRIMARY KEY (address_id),
        FOREIGN KEY (customer_id) REFERENCES customers (customer_id)
        )`;

	let company = `CREATE TABLE if not exists company(
        company_id int auto_increment,
        customer_id int(11) not null,
        company VARCHAR(255) not null,
        PRIMARY KEY (company_id),
        FOREIGN KEY (customer_id) REFERENCES customers (customer_id)
        )`;

	// Executing the query's we wrote above
	connection.query(name, (err, results, fields) => {
		if (err) console.log(`Error Found: ${err}`);
	});

	connection.query(address, (err, results, fields) => {
		if (err) console.log(`Error Found: ${err}`);
	});

	connection.query(company, (err, results, fields) => {
		if (err) console.log(`Error Found: ${err}`);
	});

	res.end("Tables Created");
	console.log("Tables Created");
});












// Route: /insert-customers-info => To insert data to the tables
app.post("/insert-customers-info", (req, res) => {
	// console.log(req.body);

	const { name, address, company } = req.body;


	let insertName = `INSERT INTO customers (name) VALUES (?)`;

	let insertAddress =
		"INSERT INTO address (customer_id, address) VALUES (?, ?)";

	let insertCompany =
		"INSERT INTO company (customer_id, company) VALUES (?, ?)";

	connection.query(insertName, [name], (err, results, fields) => {
		if (err) console.log(`Error Found: ${err}`);
		console.table(results);

		const id = results.insertId;

		connection.query(insertAddress, [id, address], (err, results, fields) => {
			if (err) console.log(`Error Found: ${err}`);
		});

		connection.query(insertCompany, [id, company], (err, results, fields) => {
			if (err) console.log(`Error Found: ${err}`);
		});
	});

	res.send("Data inserted successfully!");
	console.log("Data inserted successfully!");
});
















// Route: /customers => To retrieve customized data from the tables
app.get("/customers", (req, res) => {
	connection.query(
		`SELECT customers.customer_id AS id, customers.name, address.address, company.company FROM
		customers INNER JOIN address INNER JOIN company
			 ON 
		customers.customer_id = address.customer_id
			AND 
		customers.customer_id = company.customer_id
		
		`,
		(err, results, fields) => {
			if (err) console.log("Error During selection", err);
			// console.log(results);
			res.send(results);
		}
	);
});
















// Route: /update => To adjust or update data from the tables
app.put("/update", (req, res) => {
	// console.table(req.body);
	const { newName, id } = req.body;

	let updateName = `UPDATE customers 
						SET name = '${newName}' 
					WHERE customer_id = '${id}'`;

	connection.query(updateName, (err, result) => {
		if (err) throw err;
		console.log(result.affectedRows + " record(s) updated");
		res.send(result);
	});
});









// Route: /remove-user => To delete all data from the tables
app.delete("/remove-user", (req, res) => {
	// console.table(req.body)
	const { id } = req.body;
	let removeName = `DELETE FROM customers WHERE customer_id = '${id}'`;
	let removeAddress = `DELETE FROM address WHERE customer_id = '${id}'`;
	let removeCompany = `DELETE FROM company WHERE customer_id = '${id}'`;

	connection.query(removeAddress, (err, result) => {
		if (err) throw err;
		console.log(result.affectedRows + " record(s) Deleted");
	});

	connection.query(removeCompany, (err, result) => {
		if (err) throw err;
		console.log(result);
		console.log(result.affectedRows + " record(s) Deleted");
	});

	connection.query(removeName, (err, result) => {
		if (err) throw err;
		console.log(result.affectedRows + " record(s) Deleted");
	});

	res.end("Deleted");
});





app.listen(4000, () =>
	console.log("listening and running on http://localhost:4000")
);


















