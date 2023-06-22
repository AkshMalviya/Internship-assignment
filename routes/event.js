import express from "express";
import multer from "multer";
import fs from "fs"
import catchAsync from "../utils/catchAsync.js";
import database from "../database.js";
import AppError from "../utils/AppError.js";
const router = express.Router();

const events = async (req,res,next) =>{
    if (req.query.id){
        const id = req.query.id
        console.log(id)
        const event = await database.findById(id)
        // console.log(allEvents)
        res.send(event)
    }
    if (req.query.type || req.query.limit || req.query.page){
        const type =  req.query.type || "latest"
        const limit = req.query.limit || 5
        const page = req.query.page || 1
        console.log(type , limit , page)
        const allEvents = await database.findAllEvents(type , limit , page)
        if ( !allEvents ){
            new AppError("Event does not exist" , 500)
            res.send("Error")
        }
        res.send(allEvents)
    }
}

const fileUpload = async(req,res,next)=>{
    const upload = multer({
        dest: "./images/"
        // you might also want to set some limits: https://github.com/expressjs/multer#limits
      });
        upload.single("file"),(req, res) => {
            const tempPath = req.file.path;
            const targetPath = path.join(__dirname, "./im.png");
            if (path.extname(req.file.originalname).toLowerCase() === ".png") {
            fs.rename(tempPath, targetPath, err => {
                if (err) return handleError(err, res);
                res
                .status(200)
                .contentType("text/plain")
                .end("File uploaded!");
            });
            }
        } 
}

const creatingEvent = async(req,res,next)=>{
    const { type, name, tagline, schedule, description, image, moderator, category, sub_category, rigor_rank, attendees } = req.body;
    console.log(req.body)
    const createdEvent = await database.insertingEvent(type, name, tagline, schedule, description, image, moderator, category, sub_category, rigor_rank, attendees) 
    res.send(createdEvent) 
}

const updatingEvent = async(req,res,next)=>{
    const { id } = req.params 
    const { type, name, tagline, schedule, description, image, moderator, category, sub_category, rigor_rank, attendees } = req.body;
    const updated = await database.updater(id ,type, name, tagline, schedule, description, image, moderator, category, sub_category, rigor_rank, attendees )
    res.send(updated)
}

const deletingEvent = async(req,res,next)=>{
    const { id } = req.params
    const deleteQuery = await database.deletingEvent(id)
    res.send(deleteQuery)
}
// ?type=latest&limit=5&page=1
// router.get("/events?type=latest&limit=5&page=1" , catchAsync(typeevent) )
router.get('/events' ,catchAsync(events) )
router.post("/events", catchAsync(creatingEvent))
router.put("/events/:id", catchAsync(updatingEvent))
router.delete("/events/:id", catchAsync(deletingEvent))

export default router