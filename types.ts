export enum Gender {
  MALE = 'Male',
  FEMALE = 'Female',
  OTHER = 'Other'
}

export enum MaritalStatus {
  SINGLE = 'Single',
  MARRIED = 'Married',
  WIDOWED = 'Widowed',
  DIVORCED = 'Divorced',
  SEPARATED = 'Separated'
}

export interface FamilyMember {
  id: string;
  serialNo: number;
  name: string;
  parentSpouseName: string; // Husband or Father Name
  relationWithHead: string;
  sex: Gender;
  age: number;
  maritalStatus: MaritalStatus;
  healthProblems: string;
}

export interface FamilySurvey {
  id: string;
  headOfFamily: string;
  address: string;
  surveyDate: string;
  members: FamilyMember[];
  healthSummary?: string; // AI Generated summary
}

// For AI Parsing
export interface ParsedMemberData {
  name?: string;
  parentSpouseName?: string;
  relationWithHead?: string;
  sex?: Gender;
  age?: number;
  maritalStatus?: MaritalStatus;
  healthProblems?: string;
}