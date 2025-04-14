const express = require('express');

const router = express.Router();

// Mock data for user count
const mockUserCount = 1234;

// Route to fetch user count
router.get('/user-count', (req, res) => {
    try {
        res.json({ count: mockUserCount });
    } catch (error) {
        console.error("Error fetching user count:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;