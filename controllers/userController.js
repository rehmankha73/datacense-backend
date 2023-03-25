import {ObjectId} from 'mongodb';
import User from '../models/User.js'

// ******** CREATE USERS AND UPDATE IF ALREADY EXISTS ********
const saveOrUpdateUser = async (userData, parentId) => {
    let user;

    // Check if user exists
    let userExists = userData._id && ObjectId.isValid(userData._id)  && await User.findOne({ _id: new ObjectId(userData._id) });

    if (userExists) {
        const { children, ...restData } = userData;
        // If exists then update the user
        user = await User.findByIdAndUpdate(
            userData._id,
            restData,
            {new: true, upsert: true}
        );
    } else {
        // If not exists then create the user
        const { children, ...restData } = userData;
        user = new User(restData);
        user.parent = parentId;
        await user.save();
    }

    const childrenIds = [];

    // If the user has children then recursively call the function to save or update the children & collect their ids
    if (userData.children && userData.children.length > 0) {
        for (const childData of userData.children) {
            const child = await saveOrUpdateUser(childData, user._id);
            childrenIds.push(child._id);
        }
    }

    // If the user has children then update the children ids in the user
    if (childrenIds.length > 0) {
        user.children = childrenIds;
        await user.save();
    }

    return user;
};

export const createAndUpdateUsers = async (req, res) => {
    try {
        const userData = req.body.user;
        const savedUser = await saveOrUpdateUser(userData, null);

        res.status(201).json({message: 'Record created or updated successfully', data: savedUser});
    } catch (error) {
        console.log("Error: ", error);
        res.status(500).json({error: 'Error processing the request'});
    }
}

// ******** CREATE USERS AND UPDATE IF ALREADY EXISTS ********


// ************* USER WITH AT LEAST ONE CHILD *******************
export const userWithChildren = async (req, res) => {
    try {
        // Find all users with at least one child
        const recordsWithChildren = await User.find({ children: { $exists: true, $not: { $size: 0 } } });
        res.status(200).json({data: recordsWithChildren});
    } catch (error) {
        res.status(500).json({error: 'Error fetching records'});
    }
}
// ************* USER WITH AT LEAST ONE CHILD *******************


// **************** Get record with infinite child population by ID **********************
const populateChildrenRecursively = async (record) => {
    await record.populate('children');
    for (const child of record.children) {
        // Recursively populate children
        await populateChildrenRecursively(child);
    }
};

export const userWithPopulatedChildren = async (req, res) => {
    try {
        const recordId = req.params.id;
        const record = await User.findById(recordId);

        if (!record) {
            return res.status(404).json({ error: 'Record not found' });
        }

        // Populate children recursively
        await populateChildrenRecursively(record);
        res.status(200).json({data: record});
    } catch (error) {
        console.log("Error: ", error );
        res.status(500).json({error: 'Error fetching record with child population'});
    }
}
// **************** Get record with infinite child population by ID **********************

// ***************** Get all records with pagination, free-text search, infinite child population
export const getAllUsersWithPagination = async (req, res) => {
    try {
        const { page = 1, limit = 10, search } = req.query;
        const skip = (parseInt(page) - 1) * parseInt(limit);

        // Users that have no parent
        const searchQuery = { parent: null, ...search ? { $text: { $search: search } } : {} };

        // Find records with pagination
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
            totalRecords,
            currentPage: parseInt(page),
        });
    } catch (error) {
        console.log("Error: ", error);
        res.status(500).json({ error: 'Error fetching records with pagination, search, child population, and parent_id = null' });
    }
};
// ***************** Get all records with pagination, free-text search, infinite child population
