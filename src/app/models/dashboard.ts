// models/dashboard.ts
export interface DashboardStats {
    totalStudents: number;
    totalTeachers: number;
    totalSubjects: number;
    totalClasses: number;
    totalSchedules: number;
    activeTeachers: number;  // Ajoutez cette ligne
    activeClasses: number;   // Ajoutez cette ligne
  }