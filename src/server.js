import express from 'express';
import BodyParser from 'body-parser'; 
import bodyParser from 'body-parser';
import path from 'path';

const app = express();

app.use(express.static(path.join(__dirname, '/build')));


const MongoClient = require('mongodb').MongoClient;
const connectionString = 'mongodb+srv://yanay:yl1101@cluster0.harp3.mongodb.net/shaundb?retryWrites=true&w=majority';

app.use(bodyParser.json());


/*const withDB = async (operations, res) => {
    try {
        const client =  await MongoClient.connect(connectionString, { useUnifiedTopology: true })
        const db = client.db('shaundb');
        
        operations(db);

        client.close();
    } catch (error) {
        res.status(500).json({ message: "Error connecting to db", error });
    }
}*/




app.get('/api/articles/:name', async (req, res) => {
    try {
        const articleName = req.params.name;
    const client =  await MongoClient.connect(connectionString, { useUnifiedTopology: true })
    const db = client.db('shaundb');


        
        const articleInfo = await db.collection('articles').findOne({ name: articleName });
        
        res.status(200).json(articleInfo);
    client.close();
    } catch(error) {
        res.status(500).json( {message: "Error connecting to the db", error} )
    }
})


app.post('/api/articles/:name/upvote', async (req, res) => {

    try {
        const client =  await MongoClient.connect(connectionString, { useUnifiedTopology: true })
        const db = client.db('shaundb');
        const articleName = req.params.name;


        const articleInfo = await db.collection('articles').findOne({ name: articleName });
        await db.collection('articles').updateOne({name: articleName} , {
        '$set': {
            upvotes: articleInfo.upvotes + 1,
        },
        });

        const updatedArticleInfo = await db.collection('articles').findOne({name: articleName});

        res.status(200).json(updatedArticleInfo);
        client.close();
    } catch(error) {
        res.status(500).json( {message: "Error connecting to the db", error} )
    }  
});


app.post('/api/articles/:name/add-comment', async (req, res) => {
   
    try {
        
        const client =  await MongoClient.connect(connectionString, { useUnifiedTopology: true });
        const db = client.db('shaundb');
        const articleName = req.params.name;
        const { username, text } = req.body;
        
        const articleInfo = await db.collection('articles').findOne({name: articleName });
        await db.collection('articles').updateOne({name: articleName}, {
            '$set': {
                comments: articleInfo.comments.concat({username, text})
            },
        });

        const updatedArticleInfo = await db.collection('articles').findOne({name: articleName});
        res.status(200).json(updatedArticleInfo);
        client.close();
    } catch(error) {
        res.status(500).json( {message: "Error connecting to the db", error} )
    }  

    
});

/*MongoClient.connect(connectionString, { useUnifiedTopology: true })
  .then (client => {
    console.log('Connected to Database');
    const db = client.db('shaundb');

    app.use(BodyParser.json())

    app.post('/api/articles/:name/upvote', (req, res) => {
    
        articlesInfo[articleName].upvotes+=1;
        res.status(200).send(`${articleName} now has ${articlesInfo[articleName].upvotes} upvotes!`);
    });

    app.post('/api/articles/:name/add-comment', (req, res) => {
        const { username, text } = req.body;

        const articleName = req.params.name;

        articlesInfo[articleName].comments.push({username, text});
        res.status(200).send(articlesInfo[articleName]);
})

    app.listen(8000, () => console.log('Listening on port 8000'));

  })
.catch(console.error)*/

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/build/index.html'));
})

app.listen(8000, () => console.log('Listening on port 8000'));


/* The way I inserted data in the articles collection

MongoClient.connect(connectionString, { useUnifiedTopology: true })
.then(client => {
  console.log('Connected to Database');
  const db = client.db('shaundb');
  const quotesCollection = db.collection('articles')


  app.use(bodyParser.urlencoded({ extended: true }));

   
    app.post('/quotes', (req, res) => {
      quotesCollection.insertMany([
          {
          name: "learn-react",
          upvotes: 0,
          comments: [],
        },
        {
            name: "learn-node",
            upvotes: 0,
            comments: [],
          },
          {
            name: "my-thoughts-on-resumes",
            upvotes: 0,
            comments: [],
          }
    ])
    })

     app.listen(8000, function() {
      console.log('listening on 3000')
    })
  

})
.catch(error => console.error(error))
*/


/* Fake frontend and object as a db

const articlesInfo = {
    'learn-react': {
        upvotes: 0,
        comments: [],
    },

    'learn-node': {
        upvotes: 0,
        comments: [],
    },

    'my-thoughts-on-resumes': {
        upvotes: 0,
        comments: [],
    },
}

app.use(bodyParser.json());

app.post('/api/articles/:name/upvote', (req, res) => {
    const articleName = req.params.name;
    articlesInfo[articleName].upvotes+=1;
    res.status(200).send(`${articleName} now has ${articlesInfo[articleName].upvotes} upvotes`)
})



app.post('/api/articles/:name/add-comment', (req, res) => {
    
    const articleName = req.params.name;
    const {username, text} = req.body;
    
    articlesInfo[articleName].comments.push({username, text});

    res.status(200).send(articlesInfo[articleName]);
})

app.post('/hello', (req, res) => {
    
    res.status(200).send(`Hello ${req.body.name}`);

})

*/