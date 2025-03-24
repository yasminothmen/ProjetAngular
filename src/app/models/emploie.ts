export interface Schedule {
    id?: string;         // L'ID est optionnel car il sera généré par MongoDB
    className: string;
    level: string;
    sessions: Session[];
  }
  
  export interface Session {
    
    day: string;
    time: string;
    teacher: string;
    subject: string;
  }
  