// routes/ballisticsRoutes.js

import express from 'express';

const router = express.Router();

/**
 * @swagger
 * /api/ballistics/calculate:
 *   post:
 *     summary: Calculate Create Big Cannons ballistics
 *     description: Calculate trajectory, distance, or optimal angle for CBC projectiles with realistic physics
 *     tags: [Ballistics]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               velocity:
 *                 type: number
 *                 description: Projectile velocity in blocks/tick
 *                 example: 4.0
 *               cannon:
 *                 type: object
 *                 description: Cannon position
 *                 properties:
 *                   x:
 *                     type: number
 *                     example: 0
 *                   y:
 *                     type: number
 *                     example: 64
 *                   z:
 *                     type: number
 *                     example: 0
 *                 required: [x, y, z]
 *               targets:
 *                 type: array
 *                 description: List of targets to calculate for
 *                 items:
 *                   type: object
 *                   properties:
 *                     x:
 *                       type: number
 *                       example: 100
 *                     y:
 *                       type: number
 *                       example: 64
 *                     z:
 *                       type: number
 *                       example: 0
 *                     name:
 *                       type: string
 *                       description: Optional target identifier
 *                       example: "Target 1"
 *                   required: [x, y, z]
 *               barrelMaterial:
 *                 type: string
 *                 enum: [nether-steel, steel, cast-iron, wrought-iron]
 *                 description: Barrel material affecting spread
 *                 default: steel
 *               barrelCount:
 *                 type: integer
 *                 description: Number of barrels
 *                 default: 1
 *                 example: 1
 *             required:
 *               - velocity
 *               - cannon
 *               - targets
 *     responses:
 *       200:
 *         description: Ballistics calculation result
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     velocity:
 *                       type: number
 *                     cannon:
 *                       type: object
 *                       properties:
 *                         x:
 *                           type: number
 *                         y:
 *                           type: number
 *                         z:
 *                           type: number
 *                     targets:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *                           x:
 *                             type: number
 *                           y:
 *                             type: number
 *                           z:
 *                             type: number
 *                           angle:
 *                             type: number
 *                           distance:
 *                             type: number
 *                           flightTime:
 *                             type: number
 *                           maxHeight:
 *                             type: number
 *                           impactVelocity:
 *                             type: number
 *                           trajectory:
 *                             type: array
 *                             items:
 *                               type: object
 *                               properties:
 *                                 x:
 *                                   type: number
 *                                 y:
 *                                   type: number
 *                     barrelMaterial:
 *                       type: string
 *                     barrelCount:
 *                       type: integer
 *                     spread:
 *                       type: number
 *       400:
 *         description: Invalid input parameters
 *       500:
 *         description: Server error
 */
router.post('/calculate', (req, res) => {
  try {
    const {
      velocity,
      cannon,
      targets,
      barrelMaterial = 'steel',
      barrelCount = 1
    } = req.body;

    // Validate required parameters
    if (!velocity || velocity <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Velocity is required and must be greater than 0'
      });
    }

    if (!cannon || typeof cannon.x !== 'number' || typeof cannon.y !== 'number' || typeof cannon.z !== 'number') {
      return res.status(400).json({
        success: false,
        error: 'Cannon coordinates (x, y, z) are required'
      });
    }

    if (!targets || !Array.isArray(targets) || targets.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'At least one target with coordinates (x, y, z) is required'
      });
    }

    // Validate each target
    for (let i = 0; i < targets.length; i++) {
      const target = targets[i];
      if (typeof target.x !== 'number' || typeof target.y !== 'number' || typeof target.z !== 'number') {
        return res.status(400).json({
          success: false,
          error: `Target ${i + 1} must have valid x, y, z coordinates`
        });
      }
    }

    // Physics constants
    const GRAVITY = 0.05; // blocks per tick²
    const DRAG = 0.99; // drag coefficient per tick

    // Barrel material spread values
    const BARREL_SPREADS = {
      'nether-steel': 0.1,
      'steel': 0.5,
      'cast-iron': 1.25,
      'wrought-iron': 1.5
    };

    if (!BARREL_SPREADS.hasOwnProperty(barrelMaterial)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid barrel material. Must be one of: nether-steel, steel, cast-iron, wrought-iron'
      });
    }

    // Calculate spread
    const spread = BARREL_SPREADS[barrelMaterial] / Math.sqrt(barrelCount);

    // Function to calculate optimal angle for a target
    /**
     * Calculates the optimal launch angle (in degrees) for a projectile to hit a target,
     * considering drag and gravity, using a binary search approach.
     *
     * @param {Object} target - The target position.
     * @param {number} target.x - The x-coordinate of the target.
     * @param {number} target.y - The y-coordinate of the target.
     * @param {number} target.z - The z-coordinate of the target.
     * @returns {number} The optimal launch angle in degrees.
     */
    const calculateOptimalAngle = (target) => {
      const deltaX = target.x - cannon.x;
      const deltaY = target.y - cannon.y;
      const deltaZ = target.z - cannon.z;
      const horizontalDistance = Math.sqrt(deltaX * deltaX + deltaZ * deltaZ);
      
      let bestAngle = 45;
      let bestError = Infinity;
      let lowAngle = 0;
      let highAngle = 90;
      
      for (let iteration = 0; iteration < 50; iteration++) {
        const testAngle = (lowAngle + highAngle) / 2;
        const angleRad = (testAngle * Math.PI) / 180;
        const vx0 = velocity * Math.cos(angleRad);
        const vy0 = velocity * Math.sin(angleRad);

        let t = 0;
        let x = 0;
        let y = 0;
        let vx = vx0;
        let vy = vy0;
        const dt = 0.1;
        
        while (y >= deltaY && t < 1000) {
          t += dt;
          vx *= Math.pow(DRAG, dt);
          vy = vy * Math.pow(DRAG, dt) - GRAVITY * dt;
          x += vx * dt;
          y += vy * dt;
        }
        
        const error = Math.abs(x - horizontalDistance);
        if (error < bestError) {
          bestError = error;
          bestAngle = testAngle;
        }
        
        if (x < horizontalDistance) {
          lowAngle = testAngle;
        } else {
          highAngle = testAngle;
        }
        
        if (error < 0.1) break;
      }
      
      return bestAngle;
    };

    // Function to calculate trajectory for a given angle and target
    const calculateTrajectory = (angle, target) => {
      const deltaY = target.y - cannon.y;
      const angleRad = (angle * Math.PI) / 180;
      const vx0 = velocity * Math.cos(angleRad);
      const vy0 = velocity * Math.sin(angleRad);
      
      const trajectory = [];
      let t = 0;
      let x = 0;
      let y = 0;
      let vx = vx0;
      let vy = vy0;
      let maxHeight = 0;
      const dt = 0.5;
      
      while (y >= deltaY && t < 1000) {
        trajectory.push({ 
          x: Math.round(x * 10) / 10, 
          y: Math.round((y + cannon.y) * 10) / 10 
        });
        
        maxHeight = Math.max(maxHeight, y + cannon.y);
        
        t += dt;
        vx *= Math.pow(DRAG, dt);
        vy = vy * Math.pow(DRAG, dt) - GRAVITY * dt;
        x += vx * dt;
        y += vy * dt;
      }
      
      const flightTime = t;
      const impactVelocity = Math.sqrt(vx * vx + vy * vy);
      const deltaX = target.x - cannon.x;
      const deltaZ = target.z - cannon.z;
      const distance = Math.sqrt(deltaX * deltaX + deltaZ * deltaZ);
      
      return {
        distance: Math.round(distance * 10) / 10,
        flightTime: Math.round(flightTime * 10) / 10,
        maxHeight: Math.round(maxHeight * 10) / 10,
        impactVelocity: Math.round(impactVelocity * 100) / 100,
        trajectory
      };
    };

    // Calculate ballistics for each target
    const targetResults = targets.map(target => {
      const angle = calculateOptimalAngle(target);
      const trajectoryData = calculateTrajectory(angle, target);
      
      return {
        name: target.name || `Target (${target.x}, ${target.y}, ${target.z})`,
        x: target.x,
        y: target.y,
        z: target.z,
        angle: Math.round(angle * 100) / 100,
        distance: trajectoryData.distance,
        flightTime: trajectoryData.flightTime,
        maxHeight: trajectoryData.maxHeight,
        impactVelocity: trajectoryData.impactVelocity,
        trajectory: trajectoryData.trajectory
      };
    });

    const result = {
      velocity,
      cannon,
      targets: targetResults,
      barrelMaterial,
      barrelCount,
      spread: Math.round(spread * 100) / 100
    };

    res.json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('Ballistics calculation error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error during ballistics calculation'
    });
  }
});

/**
 * @swagger
 * /api/ballistics/materials:
 *   get:
 *     summary: Get available barrel materials and their spread values
 *     description: Returns a list of available barrel materials with their spread coefficients
 *     tags: [Ballistics]
 *     responses:
 *       200:
 *         description: List of barrel materials
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   additionalProperties:
 *                     type: number
 */
router.get('/materials', (req, res) => {
  const materials = {
    'nether-steel': 0.1,
    'steel': 0.5,
    'cast-iron': 1.25,
    'wrought-iron': 1.5
  };

  res.json({
    success: true,
    data: materials
  });
});

export default router;
