var express = require('express'); //Ensure our express framework has been added
var app = express();
var bodyParser = require('body-parser'); //Ensure our body-parser tool has been added
app.use(bodyParser.json());              // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies


//Create Database Connection
var pgp = require('pg-promise')();

const dbConfig = {
	host: 'ec2-52-45-73-150.compute-1.amazonaws.com',
	port: 5432,
	database: 'd8b2aul18qrmq',
	user: 'exjyekrkvtcaoi',
	password: '4793810bb7fdf7594e358eacc6c2583eceebc167b80de53c6369e92d155868f8'
};

var db = pgp(dbConfig);


// // set the view engine to ejs
// app.set('view engine', 'ejs');
// app.use(express.static(__dirname + '/'));//This line is necessary for us to use relative paths and access our resources directory


app.get("/test",function(res,req){
    res.json({"test":"hello"});
});
 
app.get('/', function(req, res) {
    var query1 = 'SELECT * FROM users;';
    db.any(query1)
        .then(function (rows) {
            res.json(rows)
        })
        .catch(function (err) {
            console.log(err)
        })
});

// For checking if a household with a given id number exists
app.post('/joincheck', function(req, res) {
    var query1 = "SELECT COUNT(*) FROM households WHERE household_id = '"+req.body.household_id+"';";
    db.any(query1)
    .then(info => {
        res.json(info)
    })
    .catch(function (err) {
        console.log(err)
    })
});

// For user joining a household
app.post('/join', function(req, res) {
    var update = "UPDATE users SET household_id='"+req.body.household_id+"' WHERE user_id='"+req.body.user_id+"';";
    var check = "SELECT name FROM households WHERE household_id ='"+req.body.household_id+"';";


    db.task('get-everything', task => {
        return task.batch([
            task.any(update),
            task.any(check)
        ]);
    })
    .then(info => {
        res.json(info[1]) // sends household name back
    })
    .catch(function (err) {
        console.log(err)
    })
});

// For user joining a household
app.post('/newhouse', function(req, res) {

    var insert = "INSERT INTO households(name, address)";
    insert += "VALUES('"+req.body.name+"', '"+req.body.address+"');";
    var check = "SELECT household_id FROM households WHERE name ='"+req.body.name+"' and address = '"+req.body.address+"'";


    db.task('get-everything', task => {
        return task.batch([
            task.any(insert),
            task.any(check)
        ]);
    })
    .then(info => {
        console.log('Just made new household with id: ' + info[1][0].household_id)
        res.json(info[1]) // sends household id
    })
    .catch(function (err) {
        console.log(err)
    })
});

app.post('/registercheck', function(req, res) {
    var query1 = "SELECT COUNT(*) FROM users WHERE email = '"+req.body.email+"';";
    db.any(query1)
    .then(info => {
        res.json(info)
    })
    .catch(function (err) {
        console.log(err)
    })
});

app.post('/register', function(req, res) {
    console.log('Registering: ' + req.body.name)

    var insert = "INSERT INTO users(household_id, name, email, password)";
    insert += "VALUES(-1, '"+req.body.name+"', '"+req.body.email+"', '"+req.body.password+"');";
    var check = "SELECT email, COUNT(*) AS count FROM users WHERE email ='"+req.body.email+"' and password = '"+req.body.password+"' GROUP BY email;";


    db.task('get-everything', task => {
        return task.batch([
            task.any(insert),
            task.any(check)
        ]);
    })
    .then(info => {
        res.json(info[1])
    })
    .catch(function (err) {
        console.log(err)
    })
});

app.post('/login', function(req, res) {
    var count = "SELECT COUNT(*) AS count FROM users WHERE email ='"+req.body.email+"' and password = '"+req.body.password+"';";
    var household = "SELECT user_id, household_id FROM users WHERE email ='"+req.body.email+"';";


    db.task('get-everything', task => {
        return task.batch([
            task.any(count),
            task.any(household)
        ]);
    })
    .then(info => {
        // if user exists
        if (info[0][0].count == 1){
            // send household id
            res.json(info[1])
        }
        else{
            // send count 
            console.log('Count: ' + info[0][0].count)
            res.json(info[0])
        }
    })
    .catch(function (err) {
        console.log(err)
    })
});

app.post('/home/chores.json', function(req, res) {
    var query1 = "SELECT chore_id, EXTRACT(DOW FROM due_date) AS \"day_of_week\", TO_CHAR(due_date, 'Mon dd, yyyy') as \"date\", points, chore_name FROM chores WHERE user_id = '"+req.body.user_id+"';";
    db.any(query1)
    .then(info => {
        res.json(info)
    })
    .catch(function (err) {
        console.log(err)
    })
});

app.post('/home/stats.json', function(req, res) {
    var query1 = "SELECT * FROM users WHERE user_id = '"+req.body.user_id+"';";
    db.any(query1)
    .then(info => {
        res.json(info)
    })
    .catch(function (err) {
        console.log(err)
    })
});

app.post('/home/finishChore', function(req, res){
    var update_chores = "DELETE FROM chores WHERE chore_id='"+req.body.chore_id+"';";
    var update_points = "UPDATE users SET points='"+req.body.new_points+"', monthly_points='"+req.body.new_monthly_points+"'   WHERE user_id='"+req.body.user_id+"';"
    var new_chores = "SELECT chore_id, EXTRACT(DOW FROM due_date) AS \"day_of_week\", TO_CHAR(due_date, 'Mon dd, yyyy') as \"date\", points, chore_name FROM chores WHERE user_id = '"+req.body.user_id+"';";
    db.task('get-everything', task => {
        return task.batch([
            task.any(update_chores),
            task.any(update_points),
            task.any(new_chores)
        ]);
    })
    .then(info => {
        res.json(info[2])
    })
    .catch(function (err) {
        console.log(err)
    })

});


app.listen(3000);
console.log('3000 is the magic port');
