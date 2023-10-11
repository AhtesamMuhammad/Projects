const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bcrypt = require('bcrypt');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const {log} = require("debug");

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

/////////////////////////////////////////////////////

const db = require('knex')(
    {
        client: 'sqlite3',
        connection: {
            filename: 'database_ajuntament.db'
        }
    }
);

/////////////////////USER////////////////////////////////

///LOGIN ROUTE
app.get('/login', (req, res) => {
    const sessionCookie = req.cookies.session;

    if (sessionCookie) {
        // The user is already logged in, redirect to the reservations page
        return res.redirect('/');
    } else {
        // Show the login form
        res.sendFile(__dirname + '/public/Pag_login.html');
    }
});

// Route for processing the login form
// which is in Pag_login.html and has action="/login" inside it
app.post('/login', async (req, res) => {
    const {email, password} = req.body;

    try {
        // Query the password stored in the database for the provided email
        const user = await db('usuaris')
            .where('correu_electronic', email)
            .first();

        if (user) {
            // If we want to use bcrypt to verify if the password is correct, we have to hash it
            user.contrasenya = await bcrypt.hash(user.contrasenya, 10);

            // Verify the password
            const passwordMatch = await bcrypt.compare(password, user.contrasenya);

            if (passwordMatch) {

                const sessionData = {
                    ID: user.ID,
                    dni: user.DNI,
                    rol: user.rol
                };
                console.log(sessionData)
                // Set the session cookie with the user's DNI
                res.cookie('session', sessionData, {maxAge: 3600000});

                res.send(true)
            } else {
                res.send(false);
            }

        } else {
            // Whether the password and the email are wrong, send 'false'
            res.send(false)
        }
    } catch
        (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

app.get('/logout', (req, res) => {
    // Remove the session cookie
    res.clearCookie('session');
    res.redirect('/');
});

//////// USER ROUTES
app.get('/api/usuaris', async (req, res) => {
    const sessionCookie = req.cookies.session.rol;

    if (sessionCookie === 'Usuario') {
        return res.sendFile(__dirname + '/public/Pag_login.html');
    } else if (sessionCookie === 'Administrador') {
        try {
            const data = await db.select('*').from('usuaris');

            // Encrypt the password for each user using data.map, first map each user
            // and then hash it using 'bcrypt.hashSync'
            const hashedData = data.map((usuario) => {
                const hashedPassword = bcrypt.hashSync(usuario.contrasenya, 10);
                /* Check if is hashing the password
                const valid = bcrypt.compare(usuario.contrasenya, hashedPassword);
                if(valid){
                    console.log('GOOD');
                }
                */
                return {...usuario, contrasenya: hashedPassword};
            });
            res.json({hashedData, sessionCookie});
        } catch (error) {
            console.log(error);
        }
    } else {
        res.redirect('/')
    }
});

//////// RESERVATION ROUTE ////////
app.get('/api/reserves', function (req, res) {
    const DniUsuari = req.cookies.session.dni; // Get the DNI
    const RolUsuari = req.cookies.session.rol; // Get the role

    db.select('reserves.*', 'esdeveniments.Nom', 'esdeveniments.Aforament')
        .from('reserves')
        .join('esdeveniments', 'reserves.Esdeveniment', 'esdeveniments.Nom')
        .where('reserves.Client', DniUsuari) // Filter reservations by the current client
        .then(function (data) {
            const isAdmin = RolUsuari === 'Administrador';
            const reservas = data;

            // Get all event capacities
            db.select('Nom', 'Aforament')
                .from('esdeveniments')
                .then(function (eventData) {
                    const eventos = eventData.reduce((acc, event) => {
                        acc[event.Nom] = event.Aforament;
                        return acc;
                    }, {});

                    data = {reserves: reservas, isAdmin, eventos};
                    res.json(data);
                })
                .catch(function (error) {
                    console.log(error);
                });
        })
        .catch(function (error) {
            console.log(error);
        });
});

/// DELETE RESERVATION
app.delete('/api/reserves/:id', function (req, res) {
    let id = parseInt(req.params.id);

    db.delete()
        .from('reserves')
        .where('ID', id)
        .then(function (data) {
            data = {reserves: data};
            res.json(data);
        }).catch(function (error) {
        console.log(error);
    });
});

/// ADD RESERVATION
app.post('/api/reserves', function (req, res) {
    const clienteActual = req.cookies.session.dni;

    let data_form = req.body;
    data_form.Client = clienteActual; // Add the value to the Client variable

    db.insert(data_form)
        .into('reserves')
        .then (function (data) {
        res.json(data);
    })
.catch(function (error) {
        console.log(error);
    });
});

// UPDATE RESERVATIONS
app.post('/api/reserves/:id', function (req, res) {
    let id = req.params.id;
    let reservaData = req.body;

    db('reserves')
        .update(reservaData)
        .where('ID', id)
        .then(function (data) {
            res.json(data);
        })
        .catch(function (error) {
            console.log(error);
        });
});


// EVENTS ROUTE
app.get('/api/esdeveniments/', function (req, res) {
    db.select('*')
        .from('esdeveniments')
        .then(function (data) {
            data = {esdeveniments: data};
            res.json(data);
        })
        .catch(function (error) {
            console.log(error);
        });
});

app.get('/api/esdeveniments/:id', function (req, res) {
    const id = req.params.id;

    db.select('*')
        .from('esdeveniments')
        .where('ID', id)
        .first()
        .then(function (data) {
            res.json(data);
        })
        .catch(function (error) {
            console.log(error);
        });
});

// DETAILS ROUTE
app.get('/api/esdeveniments/', function (req, res) {
    db.select('*')
        .from('esdeveniments')
        .then(function (data) {
            data = {esdeveniments: data};
            res.json(data);
        })
        .catch(function (error) {
            console.log(error);
        });
});

// OPINIONS ROUTE
app.get('/api/opinions', function (req, res) {
    const currentClient = req.cookies.session.ID;
    db.select('opinions.ID', 'usuaris.nom_cognom AS User', 'usuaris.DNI', 'esdeveniments.Nom AS Event', 'TextOpinio', 'Puntuacio')
        .from('opinions')
        .leftJoin('usuaris', 'opinions.Usuari', 'usuaris.ID')
        .leftJoin('esdeveniments', 'opinions.Esdeveniment', 'esdeveniments.ID')
        .then(function (data) {
            const isOwn = currentClient;
            data = {opinions: data, isOwn};
            res.json(data);
        })
        .catch(function (error) {
            console.log("Error:", error);
        });
});

app.get('/api/opinions/:id', function (req, res) {
    let id = req.params.id;

    db.select('*')
        .from('opinions')
        .where('ID', id)
        .first()
        .then(function (data) {
            res.json(data);
        })
        .catch(function (error) {
            console.log(error);
        });
});

// DELETE OPINIONS
app.delete('/api/opinions/:id', function (req, res) {
    let id = parseInt(req.params.id);

    db.delete()
        .from('opinions')
        .where('ID', id)
        .then(function (data) {
            data = {opinions: data};
            res.json(data);
        })
        .catch(function (error) {
            console.log(error);
        });
});

// ADD OPINIONS
app.post('/api/opinions', function (req, res) {
    const currentClient = req.cookies.session.ID;

    let data_form = req.body;
    data_form.Usuari = currentClient;

    db.insert(data_form)
        .into('opinions')
        .then(function (data) {
            res.json(data);
        })
        .catch(function (error) {
            console.log(error);
        });
});

// MODIFY OPINION
app.post('/api/opinions/:id', function (req, res) {
    let id = req.params.id;
    let opinionData = req.body;

    db('opinions')
        .update(opinionData)
        .where('ID', id)
        .then(function (data) {
            res.json(data);
        })
        .catch(function (error) {
            console.log(error);
        });
});

// VENUES ROUTE
app.get('/api/recintes', function (req, res) {
    db.select('*')
        .from('recintes')
        .then(function (data) {
            data = {recintes: data};
            res.json(data);
        })
        .catch(function (error) {
            console.log(error);
        });
});

////////////////////////////////////////////////////////////

// Catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// Error handler
app.use(function (err, req, res, next) {
    // Set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // Render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;

