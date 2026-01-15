export interface DirectorQuote {
  id: string;
  text: string;
  author: string;
  movie?: string;
}

export interface Event {
  id: string;
  title: string;
  date: string;
  description: string;
  imageUrl: string;
  registrationLink: string;
  type: 'Screening' | 'Workshop' | 'Talk' | 'Festival';
}

export interface ClubMember {
  name: string;
  role: string;
  favoriteFilm: string;
  imageUrl: string;
}

export interface Department {
  id: string;
  name: string;
  lead: ClubMember;
}

export interface ClubHierarchy {
  facultyCoordinators: ClubMember[];
  chairpersons: ClubMember[];
  viceChairpersons: ClubMember[];
  departments: Department[];
}

export interface ClubDetails {
  name: string;
  description: string;
  regNo: string;
  branch: string;
  department: string;
  contactNo: string;
  email: string;
  instagram?: string;
  youtube?: string;
  recruitment?: string;
  tagline?: string;
}
