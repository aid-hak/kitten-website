const express = require('express')
const app = express()
const port = 3000
const sharp = require('sharp')
const fs = require('fs')

function notRandom(height,width){
    const files = fs.readdirSync(__dirname + "/jpg-low").filter(filename => filename.endsWith("jpg"))
    const result = height * width
    const index = result % files.length
    return (files[index])
}

function resize(pathname,output,height,width)
{
    let newheight = parseInt(height)
    let newwidth = parseInt(width)
    return sharp(pathname).resize({height: newheight, width: newwidth}).toFile(output)
}
app.get('/:height/:width', (req, res) => {
    const height = req.params.height
    const width = req.params.width
    const fonjaPic = notRandom(height,width)
    let path = __dirname +"/jpg-low/" + fonjaPic
    let output = __dirname + "/jpg-low/jpg-resize/"+height+"x"+width

    if(fs.existsSync(output)){
        res.header("content-type", "image/jpg")
        res.sendFile(output)
    }
    else {
        resize(path, output, height, width).then(function () {
            res.header("content-type", "image/jpg")
            res.sendFile(output)
        })
    }
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
