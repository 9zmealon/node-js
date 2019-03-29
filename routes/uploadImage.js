var express = require('express');
var multer = require('multer')
var storage = multer.diskStorage({
    destination: (req, file, cb)=>{
        cb(null, 'uploads/')
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


router.post('/', upload.single("image"), (req, res) => {
    res.send(req.file);
});

router.post('/multiple', upload.array("image"), (req, res) => {
    res.send(req.files);
});
module.exports = router;