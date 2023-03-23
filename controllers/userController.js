import User from '../models/User.js'

// ******** CREATE ********
const create = async (req, res) => {

    const _data = {
        name: req.body.name,
        age: req.body.age,
        veteran: req.body.veteran,
    };

    try {
        const user = await User.create(_data);
        res.status(201).json(user);
    } catch (error) {
        console.log('error: ', error);
        res.status(500)
    }
}

// ******** INDEX ********
const index = async (req, res) => {

    const user = await User.find().exec();

    if (user) {
        res.status(200).json(user);
    } else {
        res.status(500)
        throw new Error('Invalid user data');
    }
}

export {
    create,
    index
}