const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config()
const port = 5000
const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ach2z.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const ObjectId = require('mongodb').ObjectId;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


const client = new MongoClient(uri, { useNewUrlParser: true,useUnifiedTopology: true  });
client.connect(err => {
  const allUsersCollection = client.db("Volunteer-work").collection("user-info");
  const volunteersCollection = client.db("Volunteer-work").collection("volunteers");
  const activitiesCollection=client.db("Volunteer-work").collection("activities");

  app.post("/addVolunteers", (req, res) => {
    const volunteers = req.body;
    volunteersCollection.insertMany(volunteers)
      .then(result => {
        res.send(result.insertedCount > 0)
      })
  });

  app.get("/volunteers", (req, res) => {
    volunteersCollection.find({})
      .toArray((err, documents) => {
        res.send(documents);
      })
  });

  app.post("/activities", (req, res) => {
   const activity = req.body;
    activitiesCollection.insertOne(activity)
    .then(result => {
      res.send(result.insertedCount > 0);
    })
  })

  app.get("/userActivity", (req, res) => {
    
    activitiesCollection.find({email:req.query.email}).toArray((err, documents) => {
      res.send(documents);
    })
  })

  app.delete('/deleteEvent/:id', (req, res) => {
    console.log(req.params.id);
    activitiesCollection.deleteOne({ _id: ObjectId(req.params.id) })
      .then(result => {
        console.log(result);
        res.send(result);
        
      })
      
  })
  app.get('/allActivities',(req, res) => {
    activitiesCollection.find({}).toArray(documents => {
      res.send(documents);
    })
  })
  app.get('/', (req, res) => {
    res.send('Hello World!')
  })
 
});



app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})