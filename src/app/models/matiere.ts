export class Matiere {
    id: string;
    name: string;
    //levels: string[];
    type: string;
    classesIds: string[];  // ✅ Utilise bien un tableau d'IDs

    constructor() {
        this.id = '';
        this.name = '';
        //this.levels = [];
        this.type = '';
        this.classesIds = [];  // ✅ Initialisation correcte
    }
}
