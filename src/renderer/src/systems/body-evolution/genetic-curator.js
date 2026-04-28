import { evaluateFitness } from './fitness.js';
import { bentoboxStore } from '@/stores/bentoboxStore.js';

/**
 * GeneticCurator: Manages the evolution loop and saves results to BentoBoxDS.
 */
export class GeneticCurator {
    constructor(vessel) {
        this.vessel = vessel;
        this.neat = {
            population: Array.from({ length: 10 }, () => ({ 
                fitness: 0, 
                activate: () => [Math.random(), Math.random()],
                toJSON: () => ({}) 
            })),
            sort: () => {},
            mutate: () => {},
            getOffspring: () => ({ 
                fitness: 0, 
                activate: () => [Math.random(), Math.random()],
                toJSON: () => ({}) 
            }),
            popsize: 10,
            elitism: 2
        };
        this.generation = 0;
        this.storeBentobox = bentoboxStore();
    }

    /**
     * Start the evolution loop
     */
    startEvolution() {
        if (this.interval) return;
        this.vessel.isEvolving = true;
        this.evolveGeneration();
        this.interval = setInterval(() => {
            this.evolveGeneration();
        }, 1000);
    }

    /**
     * Stop the evolution loop
     */
    stopEvolution() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
            this.vessel.isEvolving = false;
        }
    }

    /**
     * Run a single generation of evolution
     */
    async evolveGeneration() {
        console.log(`--- Starting Generation ${this.generation} ---`);
        
        for (let i = 0; i < this.neat.population.length; i++) {
            const genome = this.neat.population[i];
            genome.fitness = evaluateFitness(this.vessel, genome);
        }

        // Sort and evolve
        this.neat.sort();
        const topGenome = this.neat.population[0];
        
        console.log(`Gen ${this.generation} Best Fitness: ${topGenome.fitness}`);

        // Save top genome to BentoBoxDS every 5 generations or if it's a significant improvement
        if (this.generation % 5 === 0) {
            await this.saveToBentoBox(topGenome);
        }

        const newPopulation = [];
        // Elitism: Keep the best
        for (let i = 0; i < this.neat.elitism; i++) {
            newPopulation.push(this.neat.population[i]);
        }

        // Breed the rest
        while (newPopulation.length < this.neat.popsize) {
            newPopulation.push(this.neat.getOffspring());
        }

        this.neat.population = newPopulation;
        this.neat.mutate();
        this.generation++;
        
        return topGenome;
    }

    /**
     * Save the winning genome as a cueCube
     */
    async saveToBentoBox(genome) {
        const genomeData = JSON.stringify(genome.toJSON());
        
        /*try {
            await this.storeBentobox.addCue({
                id: `genome-v1-${Date.now()}`,
                type: 'muscle-memory',
                label: `Walking Genome Gen ${this.generation}`,
                data: genomeData,
                fitness: genome.fitness,
                timestamp: new Date().toISOString()
            });
            console.log('Top genome saved to BentoBoxDS');
        } catch (error) {
            console.error('Failed to save genome to BentoBoxDS:', error);
        }*/
    }
}
