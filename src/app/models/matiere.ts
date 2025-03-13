export class Matiere {
    id: string;
    name: string;
    type: string;
    
    nombreHeures: string;
    level:string[];

    constructor() {
        this.id = '';
        this.name = '';
        this.type = '';
        
        this.nombreHeures = '';
        this.level = [];
    }
}
