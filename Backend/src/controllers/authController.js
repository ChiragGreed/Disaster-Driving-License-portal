import { config } from "dotenv";
import { Config } from "../config/config.js";
import userModel from "../models/userModel.js";
import JWT from "jsonwebtoken";
import bcrypt from "bcryptjs";
import sendEmail from "../services/emailService.js";

function tokenGeneration(user, res) {

    const token = JWT.sign({
        userId: user._id,
        fullname: user.fullname,
        role: user.role
    }, Config.JWT_SECRET,
        { expiresIn: '7d' });
    
        
        res.cookie("token", token);
        
    }
    
    export const register = async (req, res) => {
        const { fullname, email, contact, password, role } = req.body;
        
        const userExist = await userModel.findOne({ $or: [{ fullname }, { email }] });
        
        if (userExist) return res.status(400).json({
            message: "User already exist from this " + (userExist.email == email ? "email" : "username"),
            success: false,
            error: "User already exist"
        })
        
        const user = await userModel.create({ fullname, email, password, contact, role });
        
        tokenGeneration(user, res);
        
        res.status(201).json({
            message: "User registered",
            success: true,
            user
        })
        
}

export const login = async (req, res) => {
    const { email, password } = req.body;
    
    const user = await userModel.findOne({ email }).select('+password');
    
    if (!user) return res.status(400).json({
        message: "Invalid credentials",
        success: false,
        error: "Invalid credentials"
    })

    const VerifyPassword = await bcrypt.compare(password, user.password);

    if (!VerifyPassword) return res.status(400).json({
        message: "Invalid credentials",
        success: false,
        error: "Invalid credentials"
    })


    tokenGeneration(user, res);

    res.status(201).json({
        message: "User Logged in",
        success: true,
        user,
    })

}

export const getMe = async (req, res) => {

    const user = await userModel.findById(req.user);

    if (!user) return res.status(404).json({
        message: "User not found",
        success: false,
        error: "No user forund with this token"
    });

    res.status(200).json({
        message: "Fetched user details",
        success: true,
        user
    })

}

export const protectedRoute = async (req, res) => {
    res.status(200).json({
        message: "Protected route accessed",
        success: true,
    })
}



export const googleAuth = async (req, res) => {
    const { id, displayName, emails } = req.user;
    const email = emails[0].value;

    let user = await userModel.findOne({ email });

    if (!user) user = await userModel.create({ fullname: displayName, email, googleId: id });

    tokenGeneration(user, res);

    res.redirect('http://localhost:5173/');

}

export const forgotPassword = async (req, res) => {
    const { clientEmail } = req.body;

    const sessionId = JWT.sign({
        clientEmail
    }, Config.JWT_SECRET,
        { expiresIn: '1h' });

    res.cookie("sessionId", sessionId);

    const redirectUserApi = `http://localhost:5173/resetPassword/`;

    const subject = 'Request to Reset Password';
    const html = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Password Reset</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px;">
    <table cellpadding="0" cellspacing="0" style="width: 100%; max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 8px;">
        <tr>
            <td style="text-align: center;">
                <h1 style="color: #333333;">Reset Your Password</h1>
                <p style="color: #555555; font-size: 16px;">
                    We received a request to reset your password. Click the button below to proceed.
                </p>
                <p style="color: #555555; font-size: 16px;">
                    If you did not request this, please ignore this email.
                </p>
                
                <!-- Reset Button -->
                <a href=${redirectUserApi} 
                   style="display: inline-block; padding: 15px 25px; margin-top: 20px; background-color: #007bff; color: #ffffff; text-decoration: none; border-radius: 5px; font-weight: bold;">
                    Reset Password
                </a>
            </td>
        </tr>
    </table>
</body>
</html>
`;


    await sendEmail(clientEmail, subject, html);

    res.status(200).json({
        message: "Email sent to client's email",
        success: true
    })
}

export const resetPassword = async (req, res) => {

    const user = await userModel.findOne({ email: req.clientEmail });

    if (!user) return res.status(404).json({
        message: "User not found with provided email",
        success: false,
        error: "User not found"
    })


    const { newPassword, confirmationPassword } = req.body;

    if (!newPassword) return res.status(400).json({
        message: "Please provide a new password",
        success: false,
        error: "New Password not provided"
    })


    if (!confirmationPassword) return res.status(400).json({
        message: "Please provide a confirmation password",
        success: false,
        error: "Confirmation Password not provided"
    })

    if (newPassword !== confirmationPassword) return res.status(400).json({
        message: "Confirmation Password doesn't match new password",
        success: false,
        error: "Confirmation password mismatch"
    })

    const newHash = await bcrypt.hash(newPassword, 10);

    await userModel.findByIdAndUpdate(user._id, { password: newHash }).select("+password");

    res.status(200).json({
        message: "Password Changed successfully",
        success: true
    })

}

export const sessionProtectedRoute = async (req, res) => {
    res.status(200).json({
        message: "Session protected route accessed",
        success: true,
    })
}
