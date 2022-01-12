import express from "express"
import cors from "cors"
import mongoose from "mongoose"


const app = express()
app.use(express.urlencoded())
app.use(express.json())
app.use(cors())

mongoose.connect("mongodb://localhost:27017/mykeeperAppDB", {useNewUrlParser: true, useUnifiedTopology: true}, () => console.log("DB Connected"))
const kepperSchema = mongoose.Schema({
    title: String,
    description: String
})

const keeper = new mongoose.model("keeper", kepperSchema)

app.get("/", (req, res) => {
    res.send("Beckend connected.")
})


app.get("/api/getAll",(req, res) =>{
    keeper.find({}, (err, keeperList) => {
        if(err){
            console.log(err)
        }else{
            res.status(200).send(keeperList)
        }
    })
})

app.post("/api/addNew",(req, res) =>{
    const { title, description } = req.body
    const keeperObj = new keeper({
        title,
        description
    })
    keeperObj.save(err => {
        if(err){
            console.log(err)
        }
        keeper.find({}, (err, keeperList) => {
            if(err){
                console.log(err)
            }else{
                res.status(200).send(keeperList)
            }
        })
    })
})

app.post("/api/delete",(req, res) =>{
    const { id } = req.body 
    keeper.deleteOne({_id: id}, () => {
        keeper.find({}, (err, keeperList) => {
            if(err){
                console.log(err)
            }else{
                res.status(200).send(keeperList)
            }
        })
    })
})

app.listen(3001, () =>{
    console.log("backend created at port 3001")
})