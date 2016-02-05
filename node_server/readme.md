# Node JS Garage Control
Usage: must create a file "keys.json" in the node_server (this) directory.
Should be in the form of
`{
   "google_key": "<Google Api Key>",
   "google_secret": "<Google Api Secret>"
 }`

 You can generate this by making an "OAuth Client Id"

 Creating the user database:

 `>sqlite3 users_db`

 `sqlite> CREATE TABLE users(id TEXT, email TEXT, name TEXT);`