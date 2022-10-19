import * as userRepository from "../Repositories/userRepository.js";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";

export async function SignUp(req, res) {

    const {email, password, username, picture} = req.body

    try {

        if (!email || !password || !username || !picture) {
            return res.status(422).send("Preencha os campos em vazios!");
          }

        if(userRepository.findUser.length === 0) {
           return res.sendStatus(409).send('Já existe um usuário cadastrado com esse e-mail.')
        }

        const passwordHash = bcrypt.hashSync(password, 13);

        userRepository.createUser(email, passwordHash, username, picture);

        res.sendStatus(201);


    }
    catch (error) {
        res.sendStatus(500)
        console.log(error)
    }
}

export async function SignIn(req, res) {
   
    const {email, password} = req.body;
    const key = process.env.JWT_SECRET;
    let result;

    try {

        const {rows: user} = await userRepository.findUser(email);
        const token = jwt.sign(user[0].id, key);
        const sendToken = {
            token: token,
          };

        if (!email || !password) {
            return res.status(422).send("Preencha os campos em vazios!");
          }

        if(user.length === 0) {
            return res.status(401).send("Usuário incompátivel ou inexistente");
        }

        if(bcrypt.compareSync(password, user[0].password) == false) {
            return res.status(401).send("Senha incorreta.");
          }

        userRepository.Login(token, user[0].id)

        res.status(200).send(sendToken);

    }
    catch (error) {
        res.sendStatus(500)
        console.log(error)
    }
}

export async function Logout(req, res) {
    const token = req.headers.authorization?.replace("Bearer ", "");

    try {

        const {rows: session} = await userRepository.FindToken(token)
        console.log(session)

        if(session.length === 0) {
            return res.status(401).send("Sessão não encontrada");
        }

        if (!token) {
            return res.status(401).send("Sem Token de acesso.");
          }

        await userRepository.Finish(session[0].token);
        
        res.status(200);
    }
    catch (error) {
        res.sendStatus(500)
        console.log(error)
    }
}