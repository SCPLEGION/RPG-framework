import React, { useState } from 'react';
import { Button, TextField, Typography, Box, Select, MenuItem, FormControl, InputLabel } from '@mui/material';

function CbcCalc() {
    const [angle, setAngle] = useState('');
    const [velocity, setVelocity] = useState('');
    const [targetDistance, setTargetDistance] = useState('');
    const [cannonHeight, setCannonHeight] = useState('');
    const [targetHeight, setTargetHeight] = useState('');
    const [barrelType, setBarrelType] = useState('steel');
    const [barrelCount, setBarrelCount] = useState('1');
    const [calculationMode, setCalculationMode] = useState('angle'); // 'angle' or 'distance'
    const [result, setResult] = useState(null);

    // Physics constants
    const GRAVITY = 0.05; // blocks/tick
    const DRAG = 0.99; // per tick
    
    // Barrel spread values
    const BARREL_SPREADS = {
        'nether-steel': 0.1,
        'steel': 0.5,
        'cast-iron': 1.25,
        'wrought-iron': 1.5
    };

    // Calculate projectile trajectory with analytical formulas (based on Reddit math derivation)
    const calculateTrajectory = (angle, velocity, cannonY = 0, targetY = 0) => {
        const angleRad = (angle * Math.PI) / 180;
        const vx = velocity * Math.cos(angleRad);
        const vy = velocity * Math.sin(angleRad);
        
        // For horizontal distance calculation using analytical formula
        // x(t) = (v0 * cos(a)) * (1 - drag^t) / (1 - drag)
        const maxTime = Math.floor(-Math.log(0.001) / Math.log(DRAG)); // When velocity becomes negligible
        
        let maxDistance = 0;
        let maxHeight = 0;
        let flightTime = 0;
        let hitTarget = false;
        const trajectory = [];
        
        // Calculate trajectory points using analytical formulas
        for (let t = 0; t <= maxTime; t++) {
            // Horizontal position: x(t) = (v0 * cos(a)) * (1 - drag^t) / (1 - drag)
            const x = vx * (1 - Math.pow(DRAG, t)) / (1 - DRAG);
            
            // Vertical position using derived formula from Reddit post
            // y(t) = (v0 * sin(a)) * (1 - drag^t) / (1 - drag) - gravity * ((1 - drag^t) / (1 - drag) - t) / (1 - drag)
            const dragTerm = (1 - Math.pow(DRAG, t)) / (1 - DRAG);
            const y = cannonY + vy * dragTerm - GRAVITY * (dragTerm - t) / (1 - DRAG);
            
            // Check if projectile hits target height at target distance
            if (!hitTarget && x >= parseFloat(targetDistance || 0) && Math.abs(y - targetY) <= 1) {
                hitTarget = true;
                flightTime = t;
            }
            
            // Ground impact detection (y < cannon starting height or below target if target is lower)
            const groundLevel = Math.min(cannonY, targetY) - 5; // 5 block buffer below lowest point
            if (y < groundLevel && flightTime === 0) {
                flightTime = t;
            }
            
            if (y >= groundLevel) {
                trajectory.push({ x: parseFloat(x.toFixed(2)), y: parseFloat(y.toFixed(2)), time: t });
                maxDistance = Math.max(maxDistance, x);
                maxHeight = Math.max(maxHeight, y);
            }
        }
        
        return {
            maxDistance: parseFloat(maxDistance.toFixed(2)),
            maxHeight: parseFloat(maxHeight.toFixed(2)),
            flightTime: flightTime || maxTime,
            hitTarget,
            trajectory
        };
    };

    // Calculate optimal angle for a given distance using analytical approach
    const calculateOptimalAngle = (targetDistance, velocity, cannonY = 0, targetY = 0) => {
        let bestAngle = 45;
        let bestError = Infinity;
        
        // Search for optimal angle using the analytical formulas
        for (let angle = 5; angle <= 85; angle += 0.5) {
            const trajectory = calculateTrajectory(angle, velocity, cannonY, targetY);
            const error = Math.abs(trajectory.maxDistance - targetDistance);
            
            if (error < bestError) {
                bestError = error;
                bestAngle = angle;
            }
        }
        
        return bestAngle;
    };

    const handleCalculate = () => {
        const deg = parseFloat(angle);
        const vel = parseFloat(velocity);
        const targetDist = parseFloat(targetDistance);
        const cannonY = parseFloat(cannonHeight) || 0;
        const targetY = parseFloat(targetHeight) || 0;
        const barrels = parseInt(barrelCount);
        
        if (calculationMode === 'angle') {
            if (isNaN(deg) || isNaN(vel) || deg < 0 || deg > 90 || vel <= 0) {
                setResult('Please enter valid values (angle: 0-90°, velocity > 0).');
                return;
            }
            
            const trajectoryData = calculateTrajectory(deg, vel, cannonY, targetY);
            const spread = BARREL_SPREADS[barrelType] * barrels;
            
            // Calculate spread range
            const minDistance = trajectoryData.maxDistance - spread;
            const maxDistance = trajectoryData.maxDistance + spread;

            setResult(
                <Box sx={{ mt: 2 }}>
                    <Typography variant="h6" gutterBottom>
                        Ballistics Results
                    </Typography>
                    
                    <Box sx={{ mb: 2, p: 2, border: '1px solid #ccc', borderRadius: 1 }}>
                        <Typography variant="subtitle1" gutterBottom>
                            <strong>Trajectory Analysis</strong>
                        </Typography>
                        <Typography>Max Distance: {trajectoryData.maxDistance} blocks</Typography>
                        <Typography>Max Height: {trajectoryData.maxHeight} blocks</Typography>
                        <Typography>Flight Time: {trajectoryData.flightTime} ticks ({(trajectoryData.flightTime / 20).toFixed(2)} seconds)</Typography>
                        <Typography>Cannon Height: {cannonY} blocks</Typography>
                        <Typography>Target Height: {targetY} blocks</Typography>
                        <Typography>Height Difference: {(targetY - cannonY).toFixed(1)} blocks</Typography>
                        <Typography>Barrel Type: {barrelType.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</Typography>
                        <Typography>Number of Barrels: {barrels}</Typography>
                        <Typography>Spread Factor: ±{spread.toFixed(2)} blocks</Typography>
                        <Typography>Distance Range: {minDistance.toFixed(2)} - {maxDistance.toFixed(2)} blocks</Typography>
                        <Typography>Initial Velocity: {vel} blocks/tick</Typography>
                        <Typography>Launch Angle: {deg}°</Typography>
                    </Box>

                    <Typography variant="subtitle1" gutterBottom>
                        <strong>Angle Comparison Table</strong>
                    </Typography>
                    <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 10 }}>
                        <thead>
                            <tr>
                                <th style={{ border: '1px solid #ccc', padding: 8 }}>Angle (°)</th>
                                <th style={{ border: '1px solid #ccc', padding: 8 }}>Distance (blocks)</th>
                                <th style={{ border: '1px solid #ccc', padding: 8 }}>Flight Time (ticks)</th>
                                <th style={{ border: '1px solid #ccc', padding: 8 }}>Max Height (blocks)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[...Array(9)].map((_, i) => {
                                const testAngle = (i + 1) * 10; // 10°, 20°, 30°, etc.
                                const testTrajectory = calculateTrajectory(testAngle, vel, cannonY, targetY);
                                return (
                                    <tr key={testAngle} style={{ backgroundColor: testAngle === deg ? '#e3f2fd' : 'transparent' }}>
                                        <td style={{ border: '1px solid #ccc', padding: 8 }}>{testAngle}</td>
                                        <td style={{ border: '1px solid #ccc', padding: 8 }}>{testTrajectory.maxDistance}</td>
                                        <td style={{ border: '1px solid #ccc', padding: 8 }}>{testTrajectory.flightTime}</td>
                                        <td style={{ border: '1px solid #ccc', padding: 8 }}>{testTrajectory.maxHeight}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </Box>
            );
        } else {
            // Distance mode - find optimal angle
            if (isNaN(targetDist) || isNaN(vel) || targetDist <= 0 || vel <= 0) {
                setResult('Please enter valid values (distance > 0, velocity > 0).');
                return;
            }
            
            const optimalAngle = calculateOptimalAngle(targetDist, vel, cannonY, targetY);
            const trajectoryData = calculateTrajectory(optimalAngle, vel, cannonY, targetY);
            const spread = BARREL_SPREADS[barrelType] * barrels;
            const minDistance = trajectoryData.maxDistance - spread;
            const maxDistance = trajectoryData.maxDistance + spread;

            setResult(
                <Box sx={{ mt: 2 }}>
                    <Typography variant="h6" gutterBottom>
                        Optimal Angle Results
                    </Typography>
                    
                    <Box sx={{ mb: 2, p: 2, border: '1px solid #ccc', borderRadius: 1 }}>
                        <Typography variant="subtitle1" gutterBottom>
                            <strong>Optimal Trajectory for {targetDist} blocks</strong>
                        </Typography>
                        <Typography>Optimal Angle: {optimalAngle.toFixed(1)}°</Typography>
                        <Typography>Actual Distance: {trajectoryData.maxDistance} blocks</Typography>
                        <Typography>Distance Error: {Math.abs(trajectoryData.maxDistance - targetDist).toFixed(2)} blocks</Typography>
                        <Typography>Max Height: {trajectoryData.maxHeight} blocks</Typography>
                        <Typography>Cannon Height: {cannonY} blocks</Typography>
                        <Typography>Target Height: {targetY} blocks</Typography>
                        <Typography>Height Difference: {(targetY - cannonY).toFixed(1)} blocks</Typography>
                        <Typography>Flight Time: {trajectoryData.flightTime} ticks ({(trajectoryData.flightTime / 20).toFixed(2)} seconds)</Typography>
                        <Typography>Spread Factor: ±{spread.toFixed(2)} blocks</Typography>
                        <Typography>Distance Range: {minDistance.toFixed(2)} - {maxDistance.toFixed(2)} blocks</Typography>
                    </Box>
                </Box>
            );
        }
    };

    return (
        <Box sx={{ p: 2, maxWidth: 800, mx: 'auto' }}>
            <Typography variant="h4" gutterBottom>
                Cannon Ballistics Calculator
            </Typography>
            <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
                Calculate trajectory and spread for different cannon barrel configurations
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
                <FormControl>
                    <InputLabel>Calculation Mode</InputLabel>
                    <Select
                        value={calculationMode}
                        onChange={e => setCalculationMode(e.target.value)}
                        label="Calculation Mode"
                    >
                        <MenuItem value="angle">Calculate Distance from Angle</MenuItem>
                        <MenuItem value="distance">Find Optimal Angle for Distance</MenuItem>
                    </Select>
                </FormControl>

                {calculationMode === 'angle' ? (
                    <TextField
                        label="Launch Angle (degrees)"
                        type="number"
                        value={angle}
                        onChange={e => setAngle(e.target.value)}
                        helperText="Enter angle between 0-90 degrees"
                        inputProps={{ min: 0, max: 90, step: 0.1 }}
                    />
                ) : (
                    <TextField
                        label="Target Distance (blocks)"
                        type="number"
                        value={targetDistance}
                        onChange={e => setTargetDistance(e.target.value)}
                        helperText="Enter desired target distance in blocks"
                        inputProps={{ min: 0.1, step: 0.1 }}
                    />
                )}
                
                <TextField
                    label="Initial Velocity (blocks/tick)"
                    type="number"
                    value={velocity}
                    onChange={e => setVelocity(e.target.value)}
                    helperText="Enter initial projectile velocity"
                    inputProps={{ min: 0.1, step: 0.1 }}
                />

                <TextField
                    label="Cannon Height (Y coordinate)"
                    type="number"
                    value={cannonHeight}
                    onChange={e => setCannonHeight(e.target.value)}
                    helperText="Enter cannon Y coordinate (optional, defaults to 0)"
                    inputProps={{ step: 0.1 }}
                />

                <TextField
                    label="Target Height (Y coordinate)"
                    type="number"
                    value={targetHeight}
                    onChange={e => setTargetHeight(e.target.value)}
                    helperText="Enter target Y coordinate (optional, defaults to 0)"
                    inputProps={{ step: 0.1 }}
                />
                
                <FormControl>
                    <InputLabel>Barrel Material</InputLabel>
                    <Select
                        value={barrelType}
                        onChange={e => setBarrelType(e.target.value)}
                        label="Barrel Material"
                    >
                        <MenuItem value="nether-steel">Nether Steel (±0.1 spread)</MenuItem>
                        <MenuItem value="steel">Steel (±0.5 spread)</MenuItem>
                        <MenuItem value="cast-iron">Cast Iron (±1.25 spread)</MenuItem>
                        <MenuItem value="wrought-iron">Wrought Iron (±1.5 spread)</MenuItem>
                    </Select>
                </FormControl>
                
                <TextField
                    label="Number of Barrels"
                    type="number"
                    value={barrelCount}
                    onChange={e => setBarrelCount(e.target.value)}
                    helperText="Number of cannon barrels"
                    inputProps={{ min: 1, step: 1 }}
                />
            </Box>

            <Button
                variant="contained"
                color="primary"
                onClick={handleCalculate}
                size="large"
                fullWidth
                sx={{ mb: 2 }}
            >
                {calculationMode === 'angle' ? 'Calculate Trajectory' : 'Find Optimal Angle'}
            </Button>
            
            {result && result}
        </Box>
    );
}

export default CbcCalc;