const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Harshitha2610',
  database: 'ticketDB'
});

db.connect(err => {
  if (err) throw err;
  console.log('Connected!');
  db.query('ALTER TABLE bookings ADD COLUMN event_name VARCHAR(255) DEFAULT "General Event"', (err, result) => {
    if (err) {
      if (err.code === 'ER_DUP_FIELDNAME') {
        console.log('Column already exists');
      } else {
        console.error(err);
      }
    } else {
      console.log('Table altered');
    }
    process.exit();
  });
});
