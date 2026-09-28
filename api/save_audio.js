const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const app = express();

// Cấu hình multer để lưu file vào thư mục sounds
const upload = multer({ dest: 'public/song-ngu-cho-be/sounds/' });

app.post('/api/save_audio', upload.single('file'), (req, res) => {
    const filename = req.body.filename;
    const file = req.file;
    if (!file || !filename) {
        console.error('Missing file or filename:', { file, filename });
        return res.status(400).send('Missing file or filename');
    }
    const newPath = path.join('public/song-ngu-cho-be/sounds', filename);
    fs.rename(file.path, newPath, (err) => {
        if (err) {
            console.error('Error saving file:', err);
            return res.status(500).send('Error saving file');
        }
        console.log(`File saved: ${newPath}`);
        res.send('File saved');
    });
});

app.listen(3000, () => console.log('Server running on port 3000'));