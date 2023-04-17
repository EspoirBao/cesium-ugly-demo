const express = require('express');
const cors = require('cors')
const fs = require('fs');
const sharp = require('sharp');
const app = express();
const port = 3000;
app.use(cors())
app.use(express.static('public'));

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
})

app.get('/tiles/:z/:x/:y', (req, res) => {
    const { x, y, z } = req.params;

    const path = `public/tiles/${z}/${x}/${y}.png`;

    fs.access(path, fs.constants.F_OK, (err) => {
        if (err) {
            res.status(404).send('Not found');
            return;
        }

        const size = 256;
        const pipeline = sharp(path).resize(size, size).png();
        res.set('Content-Type', 'image/png');
        res.setHeader('Access-Control-Allow-Origin',"*")// 默认设置为允许所有域名
        pipeline.pipe(res);
    });
})