const User = require('../models/User')

const is_whitelisted = async (linkblue_username) => {
    // query user table looking for linkblue username
    const user = await User.query()
				.findById(linkblue_username)
    // if there is a user return true
    if(user){
        return true
    }
    // else return false
    else{
        return false
    }
}

module.exports.is_whitelisted = is_whitelisted