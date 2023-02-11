const router = require("express").Router();
const prisma = require("../db").getInstance();

const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })


router.post("/upload", upload.single('file'), async (req, res) => {
    const file = req.file;
    const file_original_name = file.originalname;
    const file_stored_name = file.filename;
    const file_mime = file.mimetype;
    let file_type = null;


    if(file_mime.includes("image")) {
        file_type = "IMAGE";
    }else if(file_mime.includes("video")) {
        file_type = "VIDEO";
    }else if(file_mime.includes("audio")) {
        file_type = "AUDIO";
    }else{
        file_type = "FILE";
    }
    
    res.json({
        "success": true,
        "data": {
            "file_name": file_original_name,
            "file_stored_name": file_stored_name,
            "mime_type": file_mime,
            "file_type": file_type
        }
    });
})

router.get("/access", async (req, res) => {
    try{
        let stored_file_name = req.query.key;
        let actual_file_name = req.query.name;
        let mime_type = decodeURI(req.query.type);

        if(stored_file_name == null || mime_type == null || stored_file_name == undefined || mime_type == undefined) throw new Error("Invalid request");

        res.setHeader('Content-Type', mime_type);
        res.setHeader("Content-Disposition", `attachment; filename=${actual_file_name}`);
        res.sendFile(`${__basedir}/uploads/${stored_file_name}`);
    }catch(e) {
        res.removeHeader("Content-Type");
        res.removeHeader("Content-Disposition");
        res.status(404).send("File not found")
    }
})

module.exports = router;