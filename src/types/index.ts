export type ServiceCategory =
  | 'Todas'
  | 'Hogar y Reparaciones'
  | 'Tecnología y Soporte'
  | 'Gastronomía Local'
  | 'Educación y Tutorías'
  | 'Bienestar y Salud';

export type UserRole = 'Residente' | 'Emprendedor';

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  neighborhood: string;
}

export interface ServiceOffer {
  id: string;
  title: string;
  providerName: string;
  category: Exclude<ServiceCategory, 'Todas'>;
  description: string;
  priceCOP: number;
  phone: string;
  neighborhood: string;
  rating: number;
  verified: boolean;
  createdAt: string;
}

export interface UserStory {
  id: string;
  code: string;
  title: string;
  role: string;
  want: string;
  soThat: string;
  priority: 'Alta (MVP)' | 'Media';
  acceptanceCriteria: string[];
  status: 'Implementado' | 'Validado';
}

export interface EvaluationCriterion {
  id: string;
  phase: 'Recolección' | 'Diseño Rápido' | 'Construcción' | 'Evaluación' | 'Refinamiento';
  metric: string;
  target: string;
  result: string;
  passed: boolean;
}
