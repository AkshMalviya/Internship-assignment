import { MongoClient } from "mongodb";
import AppError from "./utils/AppError.js";

const client = new MongoClient("mongodb://127.0.0.1:27017");
const dbName = 'eventProject';
await client.connect();
console.log('Connected successfully to server');
const db = client.db(dbName);
const events = db.collection('events');
async function insertingEvent(type, name, tagline, schedule, description, image, moderator, category, sub_category, rigor_rank, attendees) {
    const event1 = {
        type: type,
        name : name,
        tagline : tagline,
        schedule : schedule , 
        description : description, 
        image : image , 
        moderator : moderator,
        category : category,
        sub_category : sub_category , 
        rigor_rank : rigor_rank,
        attendees : [ { attendees } ]
    }
    const newEvent  = events.insertOne( event1 , (err, res)=>{
        if ( err ) throw err;
        console.log("Document inserted")
        db.close()
    })
    return newEvent ;
}

const findById = async(_id)=>{
    const event = await events.find({ _id: new ObjectId(_id)}).toArray();
    return event
}

const findAllEvents = async(type, limit, page) =>{
    const sorting = { schedule : -1 }
    const event = await events.find().limit(parseInt(limit)).sort(sorting).toArray();
    return event
}

const updatingEvent = async(id, type, name, tagline, schedule, description, image, moderator, category, sub_category, rigor_rank, attendees )=>{
    const findingEvent =  { _id: new ObjectId(id)}
    const newData = { set : {
        type: type,
        name : name,
        tagline : tagline,
        schedule : schedule , 
        description : description, 
        image : image , 
        moderator : moderator,
        category : category,
        sub_category : sub_category , 
        rigor_rank : rigor_rank,
        attendees : [ { attendees } ]
    }}
    const updatingData = await events.updateOne(findingEvent , newData)
    return updatingData
}

const deletingEvent = async(id)=>{
    const deleted = events.deleteOne({_id: new ObjectId(id)})
    return deleted
}
export default { insertingEvent , findById , findAllEvents , deletingEvent}