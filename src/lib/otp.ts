import { db } from "./db.js";

export const generateOTP = async ( email: string ) => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    
    await db.verificationToken.deleteMany({
        where :{
            email
        }
    })
    
    await db.verificationToken.create({
        data : {
            email,
            token : otp,
            expires : expiresAt,
        }
    })
    return otp;
}

export const verifyOTP = async ( email: string, token: string ) => {
    const record = await db.verificationToken.findFirst({
        where : {
            email,
            token,
        }
    });
    if (!record) {
        return false;
    }
    if (record.expires < new Date()) {
        return false;
    }
    await db.verificationToken.delete({
        where :{
            id : record.id
        }
    });
    return true;
} 