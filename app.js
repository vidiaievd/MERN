// curet ip = 188.163.108.233  188.163.108.233/32  (includes your current IP address)
//pass = 8VJNk6IOd9z2kAyx
//mongodb+srv://barm:8VJNk6IOd9z2kAyx@cluster0.k8nve.mongodb.net/app?retryWrites=true&w=majority
const express = require('express');
const config = require('config');
const path = require('path')
const mongoose = require('mongoose')

const app = express();

app.use(express.json({ extended: true }));

app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/link', require('./routes/link.routes'));
app.use('/t', require('./routes/redirect.routes'));

if (process.env.NODE_ENV === 'production') {
    app.use('/', express.static(path.join(__dirname, 'client', 'build')));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    })
}

const PORT = config.get('port') || 5000;

async function start() {
    try {
        await mongoose.connect(config.get('mongoUrl'), {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        })
        app.listen(5000, () => console.log(`App has been started jn port ${PORT}...`))
    } catch (e) {
        console.log('[e] = ', e);
        process.exit(1)
    }
}
start();

