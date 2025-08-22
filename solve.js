const fs = require('fs');

class PolynomialSecretSolver {
    constructor() {
        this.points = [];
        this.n = 0;
        this.k = 0;
    }

    readInput(filename) {
        const data = JSON.parse(fs.readFileSync(filename, 'utf8'));
        this.n = data.keys.n;
        this.k = data.keys.k;
        return data;
    }

    decodeValue(value, base) {
        return parseInt(value, base);
    }

    extractPoints(data) {
        this.points = [];
        for (let i = 1; i <= this.n; i++) {
            if (data[i]) {
                const x = i;
                const base = parseInt(data[i].base);
                const y = this.decodeValue(data[i].value, base);
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
    const secret = solver.solveProblem(filename);
    console.log(`Secret: ${secret}`);
}

if (require.main === module) {
    main();
}

module.exports = PolynomialSecretSolver;
