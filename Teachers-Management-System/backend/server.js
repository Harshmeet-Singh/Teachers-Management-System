require('dotenv').config()
const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');

app.use(express.static(path.join(__dirname, '..', 'frontend')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


//ROUTES
app.get('/api/teachers', function(req, res) {
    res.sendFile(path.join(__dirname, 'teachers.json'));
});

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
});

app.post('/addTeacher', function(req, res){
    const name = req.body.name.toUpperCase();
    const age = parseInt(req.body.age)
    const dob = req.body.dob;
    const classes = parseInt(req.body.classes);

    const data = JSON.parse(fs.readFileSync("teachers.json", "utf-8"));
    const teachers = data["teachers"];

    const newTeacher = {
        "id": teachers[teachers.length-1].id+1,
        "name": name,
        "age": age,
        "dob": dob,
        "numOfClasses": classes
    }

    teachers.push(newTeacher);
    const newData = {
        "teachers": teachers
    }
    fs.writeFileSync("teachers.json", '');
    fs.writeFileSync("teachers.json", JSON.stringify(newData));
    res.redirect("TeacherAddedSuccessfully.html");

})

app.post("/deleteTeacher", function(req, res){
    const name = req.body.name.toUpperCase();
    const dob = req.body.dob;

    const data = JSON.parse(fs.readFileSync("teachers.json", "utf-8"));
    const teachers = data["teachers"];  
    let idx = -1;
    for(let i = 0 ; i < teachers.length ; i++){
        if(teachers[i].name == name && teachers[i].dob == dob){
            idx = i;
            break;
        }
    }
    if(idx == -1){
        res.redirect("TeacherNotFound.html");
    }
    else{
        teachers.splice(idx,1);
        const newData = {
            "teachers": teachers
        }
        fs.writeFileSync("teachers.json", '');
        fs.writeFileSync("teachers.json", JSON.stringify(newData));
        res.redirect("TeacherDeletedSuccessfully.html");
    }
});

app.post("/updateTeacher", function(req, res){
    const name = req.body.name.toUpperCase();
    const dob = req.body.dob;
    const newName = req.body.newName.toUpperCase();
    const newDob = req.body.newDob;
    const newAge = parseInt(req.body.newAge);
    const newClasses = parseInt(req.body.newClasses);
    
    const data = JSON.parse(fs.readFileSync("teachers.json", "utf-8"));
    const teachers = data["teachers"];  
    
    let idx = -1;
    for(let i = 0 ; i < teachers.length ; i++){
        if(teachers[i].name == name && teachers[i].dob == dob){
            idx = i;
            break; 
        }
    }
    
    if(idx == -1){
        res.redirect("TeacherNotFound.html");
    }
    else{
        teachers[idx] = {
            "id": idx+1,
            "name": newName,
            "age": newAge,
            "dob": newDob,
            "numOfClasses": newClasses
        }
        const updatedTeacher = {
            "teachers": teachers
        }
        fs.writeFileSync("teachers.json", '');
        fs.writeFileSync("teachers.json", JSON.stringify(updatedTeacher));
        res.redirect("TeacherUpdatedSuccessfully.html");
    }
});

//LISTENING
app.listen(process.env.PORT, function (err) {
    if (err) return console.log(err);
    console.log(`Server is ready at port ${process.env.PORT}`);
});