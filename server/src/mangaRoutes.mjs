import users from "../db/users.json" assert {type: "json"}
import genres from "../db/genres.json" assert {type: "json"}
import favs from "../db/favs.json" assert {type: "json"}
import axios from 'axios'
import fs from 'fs/promises'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import 'dotenv/config'
import {insertUser, getUser, deleteUserMongo, run, updateUser} from './mongodb.mjs'


const DB_PATH_USERS = './db/users.json'
const DB_PATH_FAVS = './db/favs.json'


const MAX_RETRY_ATTEMPTS = 3;
const RETRY_DELAY = 1000; 

export const welcome = async (req, res) => {
  run()
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


    const existingUserByEmail = Object.values(users).find(
      (user) => user.email == email
    );

    if (existingUserByEmail) return res.status(400).send('Email already exists');


    const hashedPassword = await bcrypt.hash(password, 10);
    let newUser = {
      [username]: {
        email: email,
        password: hashedPassword,
        fav: [],
      }
    }
    const updatedUsers = {
      ...users,
      ...newUser
    };
    console.log(newUser);

    await insertUser(newUser)
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
    const expiringTime = '36000'
    const username = Object.keys(users).find(
      (key) => users[key].email === req.body.email

    );
console.log(username, '-',req.body.email);
    if (username) {

      const mongoData =await getUser({ [`${username}.email`]: `${req.body.email}` })
      const isPasswordValid = await bcrypt.compare(
        req.body.password,
        users[username].password
       

      );
      if (isPasswordValid) {

        const accessToken = jwt.sign(
          users[username],
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: `${expiringTime}` }
        );
        res.json({
          accessToken: accessToken,
          username: username,
          timer: expiringTime
        });
        // console.log(accessToken);
        return res.status(200);
      } else {

        console.log('Invalid password');
        return res.status(400).send('Invalid email or password ');

      }
    } else {

      console.log('User not found');
      return res.status(400).send('Invalid password or email');

    }
  } catch (error) {

    console.error(error);
    res.status(404).send('Invalid password or email');

  }
};


export const addFav = async (req, res) => {
  try {
    const { id, username } = req.body;
    console.log(req.body);
    if (!users[username].fav.includes(id)) {

 const email= users[username].email
      const filter = {
        [`${username}.email`]: email
      };
      const update = { $push: { [`${username}.fav`]: { $each: [`${id}`] } } };
      
      await updateUser(filter, update);

      users[username].fav.push(id);
      await fs.writeFile(DB_PATH_USERS, JSON.stringify(users, null, '  '));
     
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
    const email = users[username].email
    const mongoData =await getUser({ [`${username}.email`]: `${email}` })
    console.log(mongoData);
    const favs = mongoData[username].favs
    console.log(mongoData[username]);
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
    
const email = users[username].email;
    const filter = { [`${username}.email`]: email };
    const update = { $pop: { [`${username}.fav`]: 1 } };

    await updateUser(filter, update);

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

    res.send(response.data.data);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};

export const deleteUser = async (req, res) => {
  try {
    
    const { username } = req.headers;

    if (!users[username]) {
      return res.status(404).send('User not found');
    }
 const email = users[username].email;
    const filter = { [`${username}.email`]: email };
    delete users[username];

     await deleteUserMongo(filter);
    await fs.writeFile(DB_PATH_USERS, JSON.stringify(users, null, '  '));

   

    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'An error occurred',
    });
  }
};
