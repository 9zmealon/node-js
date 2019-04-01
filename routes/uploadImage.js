var express = require('express');
var multer = require('multer')
var storage = multer.diskStorage({
    destination: (req, file, cb)=>{
        cb(null, 'files/uploads/')
    }
    , filename: (req, file, cb) => {
        var customName = Math.floor(Math.random() * 999) + '-' + Date.now();
        var ext = file.originalname.split('.')[1];
        var fullFileName = customName + '.' + ext;
        cb(null, fullFileName)
    }
});
var upload = multer({storage:storage, fileFilter:(req,file,cb)=>{
    
    var allowedFileType=['png','jpg','jpeg'];
    var fileExtension = file.originalname.split('.')[1];
    if(allowedFileType.indexOf(fileExtension) === -1){
        cb(null, false);
    } else{
        cb(null,true);
    }
} });
var router = express();
var connection = require("./dbConnction/databaseConnection");


router.post('/', upload.single("image"), (req, res) => {
    var insertObj = {
        filename: req.file.filename,
        caption: "Empty"
    }
    var baseUrl = req.protocol + "://" + req.get('host');
    connection.query("insert into uploads set ?", insertObj, (err,result)=>{
        if(err) throw err;
        var { insertId} = result;
        res.send({
            id: insertId,
            filename: req.file.filename,
            url: baseUrl + "/uploads/" + req.file.filename
        });
    });
});

router.post('/multiple', upload.array("image"), (req, res) => {
    var fileList = [];
    var dbRecord =  []
    for (let index = 0; index < req.files.length; index++) {
        var insertObj = {
            filename: req.files[index].filename,
            caption: "Empty"
        }
        var insertRecord = [
            req.files[index].filename,
            "Empty"
        ];
        fileList.push(insertObj);
        dbRecord.push(insertRecord);
    }
        var query = connection.query("insert into uploads (filename, caption) values ?", [dbRecord], (err,result)=>{
            if(err) throw err;
            res.send(fileList);
        });
        console.log(query.sql);
});
module.exports = router;