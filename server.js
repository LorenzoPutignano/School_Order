const express = require('express');
const { use } = require('express/lib/application');
const { json } = require('express/lib/response');
const app = express();
const { readFile } = require('fs');
app.use(express.json());
app.use(express.static('./'));
const MongoClient = require('mongodb').MongoClient
const connection_string = "mongodb+srv://lorenzodb:admin@cluster0.ykjtz.mongodb.net";


app.get('/login', (request, response) => {
    readFile('login/login.html', 'utf-8', (err, html) => {
        if (err) {
            response.status(500).send("[ERROR] server error! html page not found!")
        } else {
            response.send(html);
        }
    });
});
app.post('/login', function (req, res) {
    //console.log("------------------------Login-------------------------------")
    var data = req.body;
    var classe = data.classe;
    var password = data.password;
    //console.log(data);
    MongoClient.connect(connection_string, {
        useUnifiedTopology: true
    }, (err, db) => {
        if (err) {
            return console.log("[ERROR] no db connection!");
        } else {
            var dbo = db.db("menu");
            dbo.collection("utente").find({ class: classe, password: password }).toArray(function (err, result) {
                if(result.length > 0){
                    //console.log("[INFO] Utente Esiste")
                    res.status(200).send(JSON.stringify("Ok"));
                }else{
                    //console.log("[ERROR] Utente Inesistente")
                    res.status(200).send(JSON.stringify("Error"));
                }
                db.close();
            });
        }
    })

});


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////7


app.get('/', (request, response) => {
    readFile('index.html', 'utf-8', (err, html) => {
        if (err) {
            response.status(500).send("[ERROR] server error! html page not found!")
        } else {
            response.send(html);
        }

    });
});
app.post('/', function (req, res) {
    //console.log("------------------------Table-------------------------------")
    MongoClient.connect(connection_string, {
        useUnifiedTopology: true
    }, (err, db) => {
        if (err) {
            return console.log("[ERROR] no db connection!");
        } else {
            var dbo = db.db("menu");
            dbo.collection("panini").find().toArray(function (err, result) {
                //console.log(result);
                res.status(200).send(JSON.stringify(result));
                db.close();
            });
        }
    })

});

///////////////////////////////////////////////////////////////////////////////////////////////7/////

app.get('/ordine', (request, response) => {
    readFile('index.html', 'utf-8', (err, html) => {
        if (err) {
            response.status(500).send("[ERROR] server error! html page not found!")
        } else {
            response.send(html);
        }

    });
});
app.post('/ordine', function (req, res) {
    var ordine = req.body;
    
    MongoClient.connect(connection_string, {
        useUnifiedTopology: true
    }, (err, db) => {
        if (err) {
            return console.log("[ERROR] no db connection!");
        } else {
            var dbo = db.db("menu");
            dbo.collection("ordini").insertMany(ordine,function (err, result) {
                if(result.acknowledged == true){
                    console.log("[INFO] Ordine Inserito Correttamente");
                    res.status(200).send(JSON.stringify("Ok"));
                    db.close();
                }else{
                    console.log("[ERROR] Orinde non è stato inserito");
                    res.status(200).send(JSON.stringify("err"));
                    db.close();
                }
                db.close();
            });
        }
    })

});

//////////////////////////////////////////////////////////////////////////////////////////

app.get('/resetordini', (request, response) => {
    readFile('index.html', 'utf-8', (err, html) => {
        if (err) {
            response.status(500).send("[ERROR] server error! html page not found!")
        } else {
            response.send(html);
        }
    });
});
app.post('/resetordini', function (req, res) {
    MongoClient.connect(connection_string, {
        useUnifiedTopology: true
    }, (err, db) => {
        if (err) {
            return console.log("[ERROR] no db connection!");
        } else {
            var dbo = db.db("menu");
            dbo.collection("ordini").deleteMany(function (err, result) {
            db.close();
            });

        }
    })

});


app.listen(3000, () => {
    console.log("[INFO] login on http://localhost:3000/login");
    console.log("[INFO] login on http://localhost:3000/");
});
