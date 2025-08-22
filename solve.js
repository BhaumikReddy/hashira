const fs = require('fs');

class PolynomialSecretSolver {
    constructor() {
        this.points = [];
        this.n = 0;
        this.k = 0;
    }

    readInput(filename) {
        try {
            const data = JSON.parse(fs.readFileSync(filename, 'utf8'));
            this.n = data.keys.n;
            this.k = data.keys.k;
            return data;
        } catch (error) {
            throw new Error(`Error reading file ${filename}: ${error.message}`);
        }
    }

    decodeValue(value, base) {
        const decoded = parseInt(value, base);
        if (isNaN(decoded)) {
            throw new Error(`Failed to decode value "${value}" in base ${base}`);
        }
        return decoded;
    }

    extractPoints(data) {
        this.points = [];
        
        for (let i = 1; i <= this.n; i++) {
            if (data[i]) {
                const x = i;
                const base = parseInt(data[i].base);
                const encodedY = data[i].value;
                const y = this.decodeValue(encodedY, base);
                this.points.push({ x, y });
            }
        }
    }

    lagrangeInterpolation(points) {
        let result = 0;
        
        for (let i = 0; i < points.length; i++) {
            const xi = points[i].x;
            const yi = points[i].y;
            
            let li = 1;
            for (let j = 0; j < points.length; j++) {
                if (i !== j) {
                    const xj = points[j].x;
                    li *= (0 - xj) / (xi - xj);
                }
            }
            
            result += yi * li;
        }
        
        return Math.round(result);
    }

    solve() {
        if (this.points.length < this.k) {
            throw new Error(`Insufficient points: need ${this.k}, have ${this.points.length}`);
        }
        
        const selectedPoints = this.points.slice(0, this.k);
        return this.lagrangeInterpolation(selectedPoints);
    }

    solveProblem(filename) {
        const data = this.readInput(filename);
        this.extractPoints(data);
        return this.solve();
    }
}

function main() {
    const args = process.argv.slice(2);
    const filename = args[0] || 'testcase1.json';
    
    const solver = new PolynomialSecretSolver();
    
    try {
        const secret = solver.solveProblem(filename);
        console.log(`Secret: ${secret}`);
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}

if (require.main === module) {
    main();
}

module.exports = PolynomialSecretSolver;
