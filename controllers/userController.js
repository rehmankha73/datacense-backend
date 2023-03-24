import User from '../models/User.js'

// ******** CREATE ********
    // const saveOrUpdatePerson = async (personData, parentId) => {
//     let user;
//
//     const person = await User.findOne({_id: personData._id}).exec();
//     console.log('person: ', person);
//
//     if (person) {
//         user = await User.findByIdAndUpdate(
//             personData._id,
//             personData,
//             { new: true, upsert: true }
//         );
//     } else {
//         user = new User(personData);
//         user.parent = parentId;
//         await user.save();
//     }
//
//     const childrenIds = [];
//
//     if (personData.children && personData.children.length > 0) {
//         for (const childData of personData.children) {
//             const child = await saveOrUpdatePerson(childData, user._id);
//             childrenIds.push(child._id);
//         }
//     }
//
//     if (childrenIds.length > 0) {
//         user.children = childrenIds;
//         await user.save();
//     }
//
//     return user;
// };

const create = async (req, res) => {

    const record = {
        name: req.body.name,
        age: req.body.age,
        veteran: req.body.veteran,
        parent: req.body.parent,
        children: req.body.children,
    }

    console.log('record: ', record);

    // const user = await saveOrUpdatePerson(personData, personData.parent);

    traverse(record);


    // console.log('req.body: ', req.body);
    // if (req.body.children && req.body.children.length > 0) {
    //     await findOneAndCreate(req.body.children);
    // } else {
    //     const _data = {
    //         name: req.body.name,
    //         age: req.body.age,
    //         veteran: req.body.veteran,
    //         parent: req.body.parent,
    //         children: [],
    //     };
    //
    //     try {
    //         const user = await User.create(_data);
    //         res.status(201).json(user);
    //     } catch (error) {
    //         console.log('error: ', error);
    //         res.status(500)
    //     }
    // }
}

function traverse(node) {
    // user001
    // Check if node is a user and doesn't exist in the users collection
    if (!userExists(node._id)) {
        // Create a new user in the users collection
        createUser(node);
    }

    // Check if node has children and traverse them recursively
    if (node.children && node.children.length > 0) {
        node.children.forEach(child => traverse(child));
    }


}

async function userExists(userId) {
    // Check if user exists in the users collection
    const user = User.findOne({_id: userId}).exec();
    // Return true or false
    if (user) {
        return true;
    } else {
        return false;
    }
}

async function createUser(user) {
    // Create a new user in the users collection
    try {
        const user = await User.create(user);
        console.log('user: ', user);
    } catch (error) {
        console.log('error: ', error);
        res.status(500)
    }
}
// ******** END CREATE ********


// ************* USER WITH AT LEAST ONE CHILD *******************
const userWithChildren = async (req, res) => {
    try {
        const recordsWithChildren = await User.find({ children: { $exists: true, $not: { $size: 0 } } }).populate('children').exec();
        res.status(200).json({ data: recordsWithChildren });
    } catch (error) {
        res.status(500).json({ error: 'Error fetching records' });
    }
}
// ************* USER WITH AT LEAST ONE CHILD *******************


// **************** Route to get a record with infinite child population by ID **********************
const populateChildrenRecursively = async (record) => {
    await record.populate('children').exec();
    for (const child of record.children) {
        await populateChildrenRecursively(child);
    }
};

const userWithPopulatedChildren = async (req, res) => {
    try {
        const recordId = req.params.id;
        const record = await User.findById(recordId).populate('parent').populate('children').exec();

        if (!record) {
            return res.status(404).json({ error: 'Record not found' });
        }

        // await populateChildrenRecursively(record);
        res.status(200).json({ data: record });
    } catch (error) {
        res.status(500).json({ error: 'Error fetching record with child population' });
    }
}
// **************** Route to get a record with infinite child population by ID **********************

// ***************** GET ALL USERS ************************
const index = async (req, res) => {
    try {
        const { page = 1, limit = 10, search } = req.query;
        const skip = (parseInt(page) - 1) * parseInt(limit);

        // Update search query to include parent_id = null
        const searchQuery = { parent_id: null, ...search ? { $text: { $search: search } } : {} };

        const records = await User.find(searchQuery)
            .populate('children')
            .skip(skip)
            .limit(parseInt(limit));

        // Populate children recursively for each record
        // for (const record of records) {
        //     await populateChildrenRecursively(record);
        // }

        // Update totalRecords to include parent_id = null condition
        const totalRecords = await User.countDocuments(searchQuery);

        res.status(200).json({
            data: records,
            totalPages: Math.ceil(totalRecords / parseInt(limit)),
            currentPage: parseInt(page),
        });
    } catch (error) {
        res.status(500).json({ error: 'Error fetching records with pagination, search, child population, and parent_id = null' });
    }
}
// ***************** GET ALL USERS ************************


export {
    create,
    userWithChildren,
    userWithPopulatedChildren,
    index
    // saveOrUpdatePerson
}