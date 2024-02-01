require('dotenv').config()
const express = require('express');
const zod = require("zod");
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const path = require('path');
const teachersPath = path.join(__dirname, '..', 'database', 'teachers.json');
const Userschema = zod.object({
    //id name age dob classes
    id: zod.number(),
    name: zod.string(),
    age: zod.number(),
    dob: zod.string(),
    numOfClasses: zod.number()
});

app.use(express.static(path.join(__dirname, '..', 'frontend')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//ROUTES
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

app.get('/api/teachers', function(req, res) {
    res.sendFile(path.join(__dirname, '..', 'database', 'teachers.json'));
});

app.post("/addTeacher", function(request, response){
    const name = request.body.name.toLowerCase();
    const age = parseInt(request.body.age);
    const dob = request.body.dob;
    const classes = parseInt(request.body.classes);
    const data = JSON.parse(fs.readFileSync(teachersPath, "utf-8"));
    const teachers = data["teachers"];  

    const newTeachers = [...teachers];
    const newObj = {
        "id": teachers[teachers.length-1].id+1,
        "name": name,
        "age": age,
        "dob": dob,
        "numOfClasses": classes
    };
    const newObjCopy = {
        "id": teachers[teachers.length-1].id+1,
        "name": name,
        "age": age,
        "dob": dob,
        "numOfClasses": classes
    };

    const validation = Userschema.safeParse(newObjCopy);
    if(!validation.success){
        response.status(411).json({
            msg: "Input is invalid!"
        })
    }
    else{
        newTeachers.push(newObj);
        const objectToPush = {
            "teachers": newTeachers
        }
        fs.writeFileSync(teachersPath, '');
        fs.writeFileSync(teachersPath, JSON.stringify(objectToPush));
        response.redirect("TeacherAddedSuccessfully.html");
    }
    
});

app.post("/deleteTeacher", function(request, response){
    const name = request.body.name.toLowerCase();
    const dob = request.body.dob;

    const data = JSON.parse(fs.readFileSync(teachersPath, "utf-8"));
    const teachers = data["teachers"];  
    var idx = -1;
    for(var i = 0 ; i < teachers.length ; i++){
        if(teachers[i].name == name && teachers[i].dob == dob){
            idx = i;
            break;
        }
    }
    if(idx == -1){
        response.redirect("TeacherNotFound.html");
    }
    else{
        teachers.splice(idx,1);
        const newObj = {
            "teachers": teachers
        }
        fs.writeFileSync(teachersPath, '');
        fs.writeFileSync(teachersPath, JSON.stringify(newObj));
        response.redirect("TeacherDeletedSuccessfully.html");
    }
});

app.post("/updateTeacher", function(request, response){
    const name = request.body.name.toLowerCase();
    const dob = request.body.dob;

    const newName = request.body.newName.toLowerCase();
    const newDob = request.body.newDob;
    const newAge = parseInt(request.body.newAge);
    const newClasses = parseInt(request.body.newClasses);

    const updatedUser = {
        "id": 1,
        "name": newName,
        "age": newAge,
        "dob": newDob,
        "numOfClasses": newClasses
    };
    
    const validation = Userschema.safeParse(updatedUser);

    if(validation.error){
        response.status(411).json({
            msg: "Input is invalid!"
        })
    }
    else{
        const data = JSON.parse(fs.readFileSync(teachersPath, "utf-8"));
        const teachers = data["teachers"];  
    
        var idx = -1;
        for(var i = 0 ; i < teachers.length ; i++){
            if(teachers[i].name == name && teachers[i].dob == dob){
                idx = i;
                break; 
            }
        }
    
        if(idx == -1){
            response.redirect("TeacherNotFound.html");
        }
        else{
            teachers[idx] = {
                "id": idx+1,
                "name": newName,
                "age": newAge,
                "dob": newDob,
                "numOfClasses": newClasses
            }
            const newObj = {
                "teachers": teachers
            }
            fs.writeFileSync(teachersPath, '');
            fs.writeFileSync(teachersPath, JSON.stringify(newObj));
            response.redirect("TeacherUpdatedSuccessfully.html");
        }
    }

    
});


//LISTENING AT PORT
app.listen(process.env.PORT, function (err) {
    if (err) {
        return console.log(err);
    }
    console.log("Server is ready at port " + process.env.PORT);
});
