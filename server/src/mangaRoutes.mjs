import users from "../db/users.json" assert {type: "json"}
import genres from "../db/genres.json" assert {type: "json"}
import favs from "../db/favs.json" assert {type: "json"}
import axios from 'axios'
import fs from 'fs/promises'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import 'dotenv/config'

const DB_PATH_USERS = './db/users.json'
const DB_PATH_FAVS = './db/favs.json'


const MAX_RETRY_ATTEMPTS = 3; // Numero massimo di tentativi di ritentativo
const RETRY_DELAY = 1000; // Ritardo tra i tentativi di ritentativo (in millisecondi)

export const welcome = async (req, res) => {

  res.send('manga site')

}


export const getGenres = async (req, res) => {
  try {

    res.send(genres)

  }
  catch (error) {

    console.error(error);
    res.status(500).send('Internal Server Error');

  }
}



export const register = async (req, res) => {
  try {

    let entries = Object.entries(req.body);
    let username = entries[0][0];
    let { email, password } = entries[0][1];
    console.log(username);

    const existingUserByUsername = Object.keys(users).find(
      (user) => user == username
    );

    if (existingUserByUsername) return res.status(400).send('Username already exists');


    // Controllo se esiste già un utente con la stessa email
    const existingUserByEmail = Object.values(users).find(
      (user) => user.email == email
    );

    if (existingUserByEmail) return res.status(400).send('Email already exists');


    const hashedPassword = await bcrypt.hash(password, 10);

    const updatedUsers = {
      ...users,
      ...{
        [username]: {
          email: email,
          password: hashedPassword,
          fav: [],
        },
      },
    };

    console.log(updatedUsers);
    await fs.writeFile(DB_PATH_USERS, JSON.stringify(updatedUsers, null, '  '));
    res.send('ok').end();

  } catch (error) {

    console.error(error);
    res.status(500).send('Internal Server Error');

  }
};


export const login = async (req, res) => {
  try {

    const username = Object.keys(users).find(
      (key) => users[key].email === req.body.email

    );

    if (username) {

      const isPasswordValid = await bcrypt.compare(
        req.body.password,
        users[username].password

      );
      if (isPasswordValid) {

        const accessToken = jwt.sign(
          users[username],
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: '1h' }
        );
        res.json({
          accessToken: accessToken,
          username: username,
        });
        // console.log(accessToken);
        return res.status(200);
      } else {

        console.log('Invalid password');
        return res.status(400).send('invalid email or password ');

      }
    } else {

      console.log('User not found');
      return res.status(400).send('invalid password or email');

    }
  } catch (error) {

    console.error(error);
    res.status(404).send('invalid password or email');

  }
};


export const addFav = async (req, res) => {
  try {
    const { id, username } = req.body;
    console.log(req.body);
    if (!users[username].fav.includes(id)) {

      users[username].fav.push(id);
      await fs.writeFile(DB_PATH_USERS, JSON.stringify(users, null, '  '));

    }

    let retryAttempts = 0;
    let response;

    while (retryAttempts < MAX_RETRY_ATTEMPTS) {

      try {

        response = await axios.get(`https://api.jikan.moe/v4/manga/${id}`);
        break;

      } catch (error) {
        if (error.response && error.response.status === 429) {

          console.log(`Rate limit exceeded. Retrying in ${RETRY_DELAY}ms...`);
          await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));

          retryAttempts++;
        } else {
          throw error;
        }
      }
    }

    if (!favs[id]) {
      favs[id] = response.data.data;
      await fs.writeFile(DB_PATH_FAVS, JSON.stringify(favs, null, '  '));
    }

    res.status(200).json({
      success: true,
      message: 'Favorite added successfully',
      guarda: users[username].fav,

    });

  } catch (error) {

    console.error(error);
    res.status(500).json({
      success: false,
      message: 'An error occurred',
    });

  }
};

export const getFav = async (req, res) => {
  try {

    const { username } = req.headers;
    res.send(users[username].fav);

  } catch (error) {

    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};

export const deleteFav = async (req, res) => {
  try {
    const { id, username } = req.headers;
    if (!users[username]) return res.status(404).send('User not found');

    users[username].fav = users[username].fav.filter((favId) => favId !== id);
    await fs.writeFile(DB_PATH_USERS, JSON.stringify(users, null, '  '));

    console.log(users[username].fav);
    res.send(users[username].fav);

  } catch (error) {

    console.error(error);
    res.status(500).send('Internal Server Error');

  }
};


export const getMangaRecommendations = async (req, res) => {
  try {

    let retryAttempts = 0;

    let response;
    while (retryAttempts < MAX_RETRY_ATTEMPTS) {

      try {

        response = await axios.get(`https://api.jikan.moe/v4/manga/${req.params.mal_id}/recommendations`);
        break; // Esci dal loop se la richiesta ha avuto successo

      } catch (error) {

        if (error.response && error.response.status === 429) {

          console.log(`Rate limit exceeded. Retrying in ${RETRY_DELAY}ms...`);
          await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
          retryAttempts++;

        } else {
          throw error;
        }
      }
    }

    res.send(response.data.data);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};
