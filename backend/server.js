const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors()); 

app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/threejs_scenes', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const SceneSchema = new mongoose.Schema({
    elements: [
      {
        type: {
          type: String,
          required: true,
        },
        position: {
          x: Number,
          y: Number,
          z: Number,
        },
      },
    ],
  });

const Scene = mongoose.model('Scene', SceneSchema);

app.use(bodyParser.json());

app.post('/api/scenes', async (req, res) => {
    try {
      const sceneData = req.body;
      const savedScene = await Scene.create(sceneData);
      res.json(savedScene);
    } catch (error) {
      console.error(error); 
      res.status(500).send('Error saving scene data');
    }
  });
  
  app.get('/api/scenes/latest', async (req, res) => {
    try {
      const latestScene = await Scene.findOne().sort({ _id: -1 }).limit(1);
      res.json(latestScene);
    } catch (error) {
      console.error(error);
      res.status(500).send('Error loading scene data');
    }
  });

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});