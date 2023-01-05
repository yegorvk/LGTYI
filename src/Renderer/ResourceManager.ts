
/** Manager for disposable three.js objects */
export class ResourceManager {
    private resources: Array<any>;

    constructor() {
        this.resources = new Array<any>();
    }

    register<T>(resource: T) {
        this.resources.push(resource);
    }

    dispose() {
        console.log(`Disposing ${this.resources.length} objects.`);

        const numObjects = this.resources.length;

        for (let i = 0; i < numObjects; i++)
            this.resources[i].dispose();

        for (let i = 0; i < numObjects; i++)
            this.resources.pop();
    }
}