const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Controller to create a new user
const createUser = async (req, res) => {
  const { username, password, parentName, childAge, schoolLevel, email, avatar } = req.body;

  try {
    // Create a new user in the database
    const newUser = await prisma.user.create({
      data: {
        username,
        password,
        parentName,
        childAge,
        schoolLevel,
        email,
        avatar,
      },
    });
    
    res.status(201).json(newUser);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Unable to create user' });
  }
};

// Controller to get all users
const getUsers = async (req, res) => {
  try {
    // Get all users from the database
    const users = await prisma.user.findMany();
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Unable to fetch users' });
  }
};

// Controller to get a user by ID
const getUserById = async (req, res) => {
  console.log("Requested user ID:", req.params.id);
  const userId = parseInt(req.params.id, 10);

  if (isNaN(userId)) {
    return res.status(400).json({ error: 'Invalid user ID' });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        books: true,
        readingHistory: true,
        userPreferences: true,
        parentalControl: true,
        subscriptions: true,
      },
    });

    if (user) {
      console.log('Fetched user:', user); // Log the full user object
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
// Function to get the authenticated user's account
async function getUserAccount(req, res) {
  const userId = req.user.id;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        books: true,
        readingHistory: true,
        userPreferences: true,
        parentalControl: true,
        subscriptions: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user account:', error);
    res.status(500).json({ error: 'Could not fetch user account' });
  }
}

// Controller to get user account by ID
const getUserAccountById = async (req, res) => {
  const { id } = req.params; // The ID from the URL
  const requesterId = req.user.id; // The ID from the authenticated user

  if (id !== requesterId) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  try {
    const userAccount = await prisma.user.findUnique({
      where: { id: parseInt(id, 10) },
      include: {
        books: true,
        readingHistory: true,
        userPreferences: true,
        parentalControl: true,
        subscriptions: true,
      }
    });

    if (userAccount) {
      res.json(userAccount);
    } else {
      res.status(404).json({ message: 'User account not found.' });
    }
  } catch (error) {
    console.error('Error fetching user account:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Controller to upload avatar
const uploadAvatar = async (req, res) => {
  const { file } = req; // Uploaded file
  const fileName = file.filename; // File name

  // Save the file name to the database for the current user
  const userId = req.user.id; // Assuming you have user authentication
  await prisma.user.update({
    where: { id: userId },
    data: { avatar: fileName }
  });

  // Respond with a success message
  res.status(200).json({ message: 'Avatar uploaded successfully' });
}

module.exports = { createUser, getUsers, getUserById, getUserAccount, uploadAvatar, getUserAccountById };
