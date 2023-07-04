import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"

export const register = async (req, res, next) => {
  try {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);

    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hash,
    });

    await newUser.save();
    res.status(200).send("User has been created");
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const user = User.findOne({ username: req.body.username });
    if (!user) return next(createError(404, "User not found"));

    const isPasswordCorrect = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!isPasswordCorrect)
      return next(createError(404, "Wrong password or Username"));
      //il nostro oggetto user si trova all'interno di _doc
      const {password, isAdmin, ...otherDetails} = user._doc
        //per ogni richiesta useremo jwt per verificare l'identità di chi lo sta usando
      const token = jwt.sign({id:user._id, isAdmin : user.isAdmin}, process.env.JWT)
      //usando httpOnly : true, facciamo in modo che ai client non sia consentito di arrivare al cookie, in questo modo è più sicuro
      res.cookie("access_token", token,{httpOnly:true}).status(200).send({...otherDetails});
  } catch (err) {
    next(err);
  }
};