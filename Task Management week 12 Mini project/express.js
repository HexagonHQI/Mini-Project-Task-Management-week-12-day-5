const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

const dataPath = path.join(__dirname, 'data.json'); 

app.use(express.json());


const fetchData = () => {
  try {
    const content = fs.readFileSync(dataPath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }
};


const storeData = (data) => {
  try {
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error storing data:', error);
  }
};

// API routes
app.get('/info', (req, res) => {
  const info = fetchData();
  res.json(info);
});

app.get('/info/:id', (req, res) => {
  const info = fetchData();
  const item = info.find(item => item.id === parseInt(req.params.id));
  if (item) {
    res.json(item);
  } else {
    res.status(404).json({ message: 'Item not found' });
  }
});

app.post('/info', (req, res) => {
  const info = fetchData();
  const newItem = {
    id: info.length + 1,
    title: req.body.title,
    description: req.body.description
  };
  info.push(newItem);
  storeData(info);
  res.status(201).json(newItem);
});

app.put('/info/:id', (req, res) => {
  const info = fetchData();
  const itemId = parseInt(req.params.id);
  const itemIndex = info.findIndex(item => item.id === itemId);
  if (itemIndex !== -1) {
    info[itemIndex] = { ...info[itemIndex], ...req.body };
    storeData(info);
    res.json(info[itemIndex]);
  } else {
    res.status(404).json({ message: 'Item not found' });
  }
});

app.delete('/info/:id', (req, res) => {
  const info = fetchData();
  const itemId = parseInt(req.params.id);
  const itemIndex = info.findIndex(item => item.id === itemId);
  if (itemIndex !== -1) {
    info.splice(itemIndex, 1);
    storeData(info);
    res.sendStatus(204);
  } else {
    res.status(404).json({ message: 'Item not found' });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
