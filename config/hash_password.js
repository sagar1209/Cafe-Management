const bcrypt = require('bcrypt');

const generateHasePassword = async(password)=>{
    try {
        const salt = await bcrypt.genSalt(10);
        const hashPassword =  await bcrypt.hash(password,salt);
        return hashPassword;
    } catch (error) {
        console.log(error)
    }
}

const verifyPassword = async(password,hashPassword)=>{
    try {
        const match = await bcrypt.compare(password,hashPassword);
        return match;
    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    generateHasePassword,
    verifyPassword,
}