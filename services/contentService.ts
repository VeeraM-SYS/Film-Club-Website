import { Event, ClubDetails, DirectorQuote, ClubMember } from '../types';
import { UPCOMING_EVENTS, CLUB_DETAILS, QUOTES, LEADS } from '../constants';
import { sanityClient, hasSanityConfig } from '../lib/sanity';

// Simulating a delay to mimic CMS API call (only used for fallback)
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const ContentService = {
  getClubDetails: async (): Promise<ClubDetails> => {
    if (hasSanityConfig()) {
        try {
            const query = `*[_type == "clubDetails"][0]{ name, regNo, branch, department, contactNo, email }`;
            const data = await sanityClient.fetch(query);
            if (data) return data;
        } catch (e) {
            console.warn("Sanity fetch failed, falling back to static data", e);
        }
    }
    await delay(500);
    return CLUB_DETAILS;
  },

  getUpcomingEvents: async (): Promise<Event[]> => {
    if (hasSanityConfig()) {
        try {
            const query = `*[_type == "event"] | order(date asc) {
                "id": _id,
                title,
                date,
                description,
                "imageUrl": mainImage.asset->url,
                registrationLink,
                type
            }`;
            const data = await sanityClient.fetch(query);
            if (data && data.length > 0) return data;
        } catch (e) {
            console.warn("Sanity fetch failed, falling back to static data", e);
        }
    }
    await delay(1200); 
    return UPCOMING_EVENTS;
  },

  getDailyQuote: async (): Promise<DirectorQuote> => {
    if (hasSanityConfig()) {
        try {
            // Fetch all quotes and pick one based on day of year logic locally to keep it consistent
            // or fetch a specific "quote of the day" document
            const query = `*[_type == "quote"]{ "id": _id, text, author, movie }`;
            const data = await sanityClient.fetch(query);
            if (data && data.length > 0) {
                 const today = new Date();
                 const startOfYear = new Date(today.getFullYear(), 0, 0);
                 const diff = today.getTime() - startOfYear.getTime();
                 const oneDay = 1000 * 60 * 60 * 24;
                 const dayOfYear = Math.floor(diff / oneDay);
                 const index = dayOfYear % data.length;
                 return data[index];
            }
        } catch (e) {
             console.warn("Sanity fetch failed, falling back to static data", e);
        }
    }
    
    await delay(800);
    const today = new Date();
    const startOfYear = new Date(today.getFullYear(), 0, 0);
    const diff = today.getTime() - startOfYear.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);
    const index = dayOfYear % QUOTES.length;
    return QUOTES[index];
  },

  getLeads: async (): Promise<ClubMember[]> => {
    if (hasSanityConfig()) {
        try {
            const query = `*[_type == "member"]{ name, role, favoriteFilm, "imageUrl": image.asset->url }`;
            const data = await sanityClient.fetch(query);
            if (data && data.length > 0) return data;
        } catch (e) {
             console.warn("Sanity fetch failed, falling back to static data", e);
        }
    }
    await delay(1000);
    return LEADS;
  }
};
