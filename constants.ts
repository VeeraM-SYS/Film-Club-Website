import { ClubDetails, DirectorQuote, Event, ClubMember, ClubHierarchy } from './types';

export const CLUB_DETAILS: ClubDetails = {
  name: "The Film Society",
  description: "A sanctuary for cinema enthusiasts. We are a collective of dreamers, critics, and creators dedicated to the art of motion pictures. From obscure indie screenings to hands-on filmmaking workshops, we celebrate the frame in all its glory.",
  regNo: "SOC-2024-FILM-042",
  branch: "Main Campus",
  department: "Department of Visual Arts & Media",
  contactNo: "+1 (555) 019-2834",
  email: "contact@thefilmsociety.edu",
  tagline: "Where life meets the lens."
};

export const QUOTES: DirectorQuote[] = [
  { id: '1', text: "Cinema is a matter of what's in the frame and what's out.", author: "Martin Scorsese" },
  { id: '2', text: "A film is - or should be - more like music than like fiction.", author: "Stanley Kubrick" },
  { id: '3', text: "The cinema is truth 24 times per second.", author: "Jean-Luc Godard" },
  { id: '4', text: "I don't dream at night, I dream all day; I dream for a living.", author: "Steven Spielberg" },
  { id: '5', text: "Pick up a camera. Shoot something. No matter how small, no matter how cheesy.", author: "Quentin Tarantino" },
  { id: '6', text: "Cinema is a mirror of reality and it is a filter.", author: "Alejandro González Iñárritu" },
  { id: '7', text: "To make a great film, you need three things – the script, the script and the script.", author: "Alfred Hitchcock" }
];

export const UPCOMING_EVENTS: Event[] = [
  {
    id: 'e1',
    title: "Noir November Marathon",
    date: "Nov 15, 2024 - 18:00",
    description: "A sleepless night featuring the best of Classic Noir. Coffee provided.",
    imageUrl: "https://picsum.photos/800/600?grayscale",
    registrationLink: "https://example.com/register/noir",
    type: "Screening"
  },
  {
    id: 'e2',
    title: "Cinematography Workshop",
    date: "Nov 22, 2024 - 14:00",
    description: "Learn lighting techniques with industry expert Roger D.",
    imageUrl: "https://picsum.photos/800/601?grayscale",
    registrationLink: "https://example.com/register/workshop",
    type: "Workshop"
  },
  {
    id: 'e3',
    title: "Student Short Film Festival",
    date: "Dec 05, 2024 - 10:00",
    description: "Submit your entries now. Theme: 'Silence'.",
    imageUrl: "https://picsum.photos/800/602?grayscale",
    registrationLink: "https://example.com/register/fest",
    type: "Festival"
  }
];

export const INITIAL_HIERARCHY: ClubHierarchy = {
  facultyCoordinators: [{
    name: "Prof. Alistair Thorne",
    role: "Faculty Coordinator",
    favoriteFilm: "Citizen Kane",
    imageUrl: "https://picsum.photos/200/200?random=10"
  }],
  chairpersons: [{
    name: "Elena V.",
    role: "Chairperson",
    favoriteFilm: "In the Mood for Love",
    imageUrl: "https://picsum.photos/200/200?random=1"
  }],
  viceChairpersons: [{
    name: "Marcus T.",
    role: "Vice Chairperson",
    favoriteFilm: "Blade Runner 2049",
    imageUrl: "https://picsum.photos/200/200?random=2"
  }],
  departments: [
    { id: 'd1', name: "Visual Arts", lead: { name: "Leo K.", role: "Head of Visuals", favoriteFilm: "Memento", imageUrl: "https://picsum.photos/200/200?random=4" } },
    { id: 'd2', name: "Sound Design", lead: { name: "Maya S.", role: "Head of Sound", favoriteFilm: "Whiplash", imageUrl: "https://picsum.photos/200/200?random=5" } },
    { id: 'd3', name: "Public Relations", lead: { name: "Ethan J.", role: "PR Lead", favoriteFilm: "The Social Network", imageUrl: "https://picsum.photos/200/200?random=6" } },
    { id: 'd4', name: "Cinematography", lead: { name: "Sasha B.", role: "Chief Cinematographer", favoriteFilm: "1917", imageUrl: "https://picsum.photos/200/200?random=7" } },
    { id: 'd5', name: "Scriptwriting", lead: { name: "Julian R.", role: "Head Writer", favoriteFilm: "Pulp Fiction", imageUrl: "https://picsum.photos/200/200?random=8" } },
    { id: 'd6', name: "Post-Production", lead: { name: "Nia W.", role: "Editor-in-Chief", favoriteFilm: "Eternal Sunshine", imageUrl: "https://picsum.photos/200/200?random=9" } },
    { id: 'd7', name: "Event Management", lead: { name: "Victor L.", role: "Events Lead", favoriteFilm: "The Grand Budapest Hotel", imageUrl: "https://picsum.photos/200/200?random=11" } },
    { id: 'd8', name: "Archives", lead: { name: "Clara M.", role: "Curator", favoriteFilm: "Cinema Paradiso", imageUrl: "https://picsum.photos/200/200?random=12" } }
  ]
};

export const LEADS: ClubMember[] = INITIAL_HIERARCHY.departments.map(d => d.lead);

