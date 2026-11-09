export type ServiceCategory =
  | 'Todas'
  | 'Hogar y Reparaciones'
  | 'Tecnología y Soporte'
  | 'Gastronomía Local'
  | 'Educación y Tutorías'
  | 'Bienestar y Salud';

export type UserRole = 'Residente' | 'Emprendedor';

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  password: string;
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

export interface AcceptanceCriterionItem {
  code: string;
  title: string;
  gherkin: string;
  expectedResult: string;
  status: 'Cumple' | 'No cumple';
  observation: string;
}

export interface UserStory {
  id: string;
  code: string;
  moduleName: string;
  title: string;
  actor: string;
  want: string;
  soThat: string;
  priority: 'Alta (MVP)' | 'Media';
  criteria: AcceptanceCriterionItem[];
}
