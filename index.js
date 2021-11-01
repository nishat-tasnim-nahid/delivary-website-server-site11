const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// user: assignment11
// pass: DGc1fK90CFk0XCVO

const uri = "mongodb+srv://assignment11:DGc1fK90CFk0XCVO@cluster0.c7c7z.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db("order");
        const usersCollection = database.collection("user");
        const delivaryItemCollection = database.collection("delivaryItem");
        // item api
        app.get('/items', async (req, res) => {
            const cursor = delivaryItemCollection.find({})
            const items = await cursor.toArray()
            res.send(items)
        })
        // get api
        app.get('/users', async (req, res) => {
            const cursor = usersCollection.find({})
            const users = await cursor.toArray();
            res.send(users)
        });

        app.get('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const user = await usersCollection.findOne(query);
            res.send(user)
        });

        // Post API
        app.post('/users', async (req, res) => {
            const newUser = req.body;
            const result = await usersCollection.insertOne(newUser)
            res.json(result)
        })
        // reset or put api
        app.put('/users/:id', async (req, res) => {
            const id = req.params.id;
            const resetUser = req.body;
            const filter = { _id: ObjectId(id) }
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    name: resetUser.name,
                    email: resetUser.email,
                    address: resetUser.address,
                    number: resetUser.number
                },
            };
            const result = await usersCollection.updateOne(filter, updateDoc, options);
            res.json(result)
        });

        // delete api
        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await usersCollection.deleteOne(query);
            res.json(result);
        })

    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Hello World!!!!')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})