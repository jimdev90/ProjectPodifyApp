import { RequestHandler } from "express";
import { CreateUser, VerifyEmailRequest } from "#/@types/user";
import User from "#/models/user";
import { generateToken } from "#/utils/helpers";
import { sendVerificationMail } from "#/utils/mail";
import EmailVerificationToken from "#/models/emailVerificationToken";


export const create: RequestHandler = async (req: CreateUser, res) => {

    const { email, password, name } = req.body;
    const user = await User.create({ name, email, password });

    //Enviamos token de verificación
    const token = generateToken(6);
    await sendVerificationMail(token, {
        email,
        name,
        userId: user._id.toString()
    })

    res.status(201).json({ user: { id: user._id, name, email } });

}

export const verifyEmail: RequestHandler = async (req: VerifyEmailRequest, res) => {
    const { token, userId } = req.body;

    const verificationToken = await EmailVerificationToken.findOne({
        owner: userId,
    });

    if (!verificationToken)
        return res.status(403).json({ error: "Invalid Token" })

    const match = await verificationToken.compareToken(token);


    if (!match)
        return res.status(403).json({ error: "Invalid Token" });

    await User.findByIdAndUpdate(userId, {
        verified: true
    });

    await EmailVerificationToken.findByIdAndDelete(verificationToken._id);

    res.json({ message: "Your email is verified" });


}