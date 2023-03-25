import {ObjectId} from 'mongodb';
import User from '../models/User.js'

// ******** CREATE ********
const saveOrUpdateUser = async (userData, parentId) => {
    let user;

    let userExists = userData._id && await User.findOne({ _id: new ObjectId(userData._id) });

    if (userExists) {
        user = await User.findByIdAndUpdate(
            userData._id,
            userData,
            {new: true, upsert: true}
        );
    } else {
        user = new User(userData);
        user.parent = parentId;
        await user.save();
    }

    const childrenIds = [];

    if (userData.children && userData.children.length > 0) {
        for (const childData of userData.children) {
            const child = await saveOrUpdateUser(childData, user._id);
            childrenIds.push(child._id);
        }
    }

    if (childrenIds.length > 0) {
        user.children = childrenIds;
        await user.save();
    }

    return user;
};

const create = async (req, res) => {
    try {
        const userData = req.body.users;
        const savedUser = await saveOrUpdateUser(userData, null);

        res.status(201).json({message: 'Record created or updated successfully', data: savedUser});
    } catch (error) {
        console.log("Error: ", error);
        res.status(500).json({error: 'Error processing the request'});
    }
}

// ******** END CREATE ********


// ************* USER WITH AT LEAST ONE CHILD *******************
const userWithChildren = async (req, res) => {
    try {
        const recordsWithChildren = await User.find({ children: { $exists: true, $not: { $size: 0 } } });
        res.status(200).json({data: recordsWithChildren});
    } catch (error) {
        res.status(500).json({error: 'Error fetching records'});
    }
}
// ************* USER WITH AT LEAST ONE CHILD *******************


// **************** Route to get a record with infinite child population by ID **********************
// Helper function to convert a plain JavaScript object to a Mongoose document

const populateChildrenRecursively = async (record) => {
    await record.populate('children');
    for (const child of record.children) {
        await populateChildrenRecursively(child);
    }
};

const userWithPopulatedChildren = async (req, res) => {
    try {
        const recordId = req.params.id;
        const record = await User.findById(recordId);

        if (!record) {
            return res.status(404).json({ error: 'Record not found' });
        }

        await populateChildrenRecursively(record);
        res.status(200).json({data: record});
    } catch (error) {
        console.log("Error: ", error );
        res.status(500).json({error: 'Error fetching record with child population'});
    }
}
// **************** Route to get a record with infinite child population by ID **********************

// ***************** Get all records with pagination, free-text search, infinite child population ************************
const getAllUsersWithPagination = async (req, res) => {
    try {
        const { page = 1, limit = 10, search } = req.query;
        const skip = (parseInt(page) - 1) * parseInt(limit);

        // Update search query to include parent_id = null
        const searchQuery = { parent: null, ...search ? { $text: { $search: search } } : {} };

        const records = await User.find(searchQuery)
            .skip(skip)
            .limit(parseInt(limit));

        // Populate children recursively for each record
        for (const record of records) {
            await populateChildrenRecursively(record);
        }

        // Update totalRecords to include parent_id = null condition
        const totalRecords = await User.countDocuments(searchQuery);

        res.status(200).json({
            data: records,
            totalPages: Math.ceil(totalRecords / parseInt(limit)),
            currentPage: parseInt(page),
        });
    } catch (error) {
        console.log("Error: ", error);
        res.status(500).json({ error: 'Error fetching records with pagination, search, child population, and parent_id = null' });
    }
};
// ***************** Get all records with pagination, free-text search, infinite child population ************************



export {
    create,
    userWithChildren,
    userWithPopulatedChildren,
    getAllUsersWithPagination
}