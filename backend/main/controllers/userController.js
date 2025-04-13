// src/controllers/userController.js

// Mock data for example purposes
let users = [
    { id: 1, name: 'John Doe', email: 'johndoe@example.com' },
    { id: 2, name: 'Jane Doe', email: 'janedoe@example.com' }
  ];
  
  export const createUser = (req, res) => {
    const { name, email } = req.body;
    const newUser = { id: users.length + 1, name, email };
    users.push(newUser);
    res.status(201).json(newUser);
  };
  
  export const getUser = (req, res) => {
    const user = users.find((u) => u.id === parseInt(req.params.id));
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  };
  
  export const updateUser = (req, res) => {
    const user = users.find((u) => u.id === parseInt(req.params.id));
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const { name, email } = req.body;
    user.name = name || user.name;
    user.email = email || user.email;
    res.status(200).json(user);
  };
  
  export const deleteUser = (req, res) => {
    const userIndex = users.findIndex((u) => u.id === parseInt(req.params.id));
    if (userIndex === -1) {
      return res.status(404).json({ message: 'User not found' });
    }
    users.splice(userIndex, 1);
    res.status(200).json({ message: 'User deleted successfully' });
  };

  export const getusers = (req, res) => {
    res.status(200).json(users);
  }
  