import express from "express"
import cors from "cors"
import jwt from 'jsonwebtoken'
import * as manga from './mangaRoutes.mjs'
import 'dotenv/config'
import {insertUser, getUser, deleteUser} from './mongodb.mjs'
const app = express()
const port = 3000

import bodyParser from 'body-parser'
app.use(express.json())
app.use(bodyParser.json())
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }));


app.get('/', manga.welcome)


app.get('/manga/:mal_id/recommendations', manga.getMangaRecommendations)
app.post('/registration', manga.register)
app.post('/login', manga.login)
app.get('/genres', manga.getGenres)
app.put('/favourites', authenticateToken, manga.addFav)
app.get('/favourites', authenticateToken, manga.getFav)
app.delete('/favourites', authenticateToken, manga.deleteFav)



function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  if (token == null) return res.sendStatus(401)

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    console.log(err)
    if (err) return res.sendStatus(403)
    req.user = user
    next()
  })
}

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })

