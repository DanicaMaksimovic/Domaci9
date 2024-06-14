const { error } = require('console');
const express = require('express');
const path = require('path');
const fs = require ('fs').promises;

const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extended: true}));
app.get('/', (req,res) => {
    res.render('index');
});

app.get('/addRecept', async (req,res) =>{
    res.render('addRecept', {error: null});
});

app.post('/addRecept', async (req, res) => {
    const {brojRecepta , recept} = req.body;
    const newRecept = {brojRecepta, recept};
    let recepti = await readRecepti();
    const receptExist = recepti.some(recept => recept.brojRecepta===brojRecepta);
    if(receptExist){
        res.render('addRecept', {error: 'Recept vec postoji'});
    } else {
        recepti.push(newRecept);
        await saveRecepti(recepti);
        res.render('recepti');
    }
});

app.get('/recepti', async (req,res) =>{
    const recept = await readRecepti();
    res.render('recepti', {recept});
});

async function readRecepti() {
    try {
      const data = await fs.readFile(path.join(__dirname, 'recepti.json'), 'utf-8');
      return JSON.parse(data); // Parsing JSON data
    } catch (err) {
      if (err.code === 'ENOENT') {
        return []; 
      }
      throw err;
    }
  }

  async function saveRecepti(recepti) {
    await fs.writeFile(path.join(__dirname, 'recepti.json'), JSON.stringify(recepti, null, 2), 'utf-8');
  }

app.listen(PORT, () =>{
    console.log('Server radi na portu 3000');
});