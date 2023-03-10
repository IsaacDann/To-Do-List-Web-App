//Declare variables
const express = require('express')
const app = express()
const PORT = 8500
const mongoose = require('mongoose')
const TodoTask = require('./models/todoTask')
require('dotenv').config()

//Set Middleware
app.set('view engine', 'ejs')
app.use(express.static(__dirname + '/public'))
app.use(express.urlencoded({extended: true}))
mongoose.set('strictQuery', true)

mongoose.connect(process.env.DB_CONNECTION, 
    {useNewUrlParser: true}, 
    () => {console.log('You are conected to the database!')}
)


//GET
app.get("/", async (req, res) => {
    try {
        TodoTask.find({}, (err, tasks) => {
            res.render('index.ejs', {
                todoTasks: tasks
            })
        })
    } catch (err) {
        if (err) return res.status(500).send(err);
    }
})


//POST
app.post('/', async (req, res) => {
    const todoTask = new TodoTask (
        {
            title: req.body.title,
            content: req.body.content

        }
     )
    try {
        await todoTask.save()
        console.log(todoTask)
        res.redirect('/')
    } catch (error) {
        if (err) return res.status(500).send(err)
        res.redirect('/')
    }
})


//UPDATE
app
    .route("/edit/:id")
    .get((req, res) => {
        const id = req.params.id;
        TodoTask.find({}, (err, tasks) => {
            res.render("edit.ejs", { todoTasks: tasks, idTask: id });
        });
    })
    .post((req, res) => {
        const id = req.params.id;
        TodoTask.findByIdAndUpdate(
            id,
            {
                title: req.body.title,
                content: req.body.content
            },

            err => {
                if (err) return res.status(500).send(err);
                res.redirect("/");
            });
    });

app
.route("/remove/:id")
.get((req, res) => {
    const id = req.params.id;
    TodoTask.findByIdAndRemove(id, err => {
        if (err) return res.send(500, err);
        res.redirect("/");
    });
});




app.listen(PORT, ()=> console.log(`App is running on port ${PORT}`
))