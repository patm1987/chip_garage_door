
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./models/users_db');

var users = function() {
    this.get_user = function (user_id) {
        db.get('SELECT * FROM users WHERE id=?', function(err, row){
            if (err || !row) {
                return null;
            }
            console.log('Got ' + row);
            return {
                id: row.id,
                email: row.email,
                name: row.name
            };
        });
    };

    this.add_user = function(user_id, email, name) {
        var statement = db.prepare("INSERT INTO users VALUES(?,?,?)");
        statement.run(user_id, email, name);
        statement.finalize();
        return {
            id: user_id,
            email: email,
            name: name
        };
    }
};

module.exports = users;
