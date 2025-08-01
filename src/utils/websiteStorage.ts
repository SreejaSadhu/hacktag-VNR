// src/utils/websiteStorage.ts
export type StoredWebsite = {
    id: string;
    title: string;
    html: string;
    css: string;
    description: string;
    createdAt: string;
  };
  
  const STORAGE_KEY = "my_websites";
  
  export function getStoredWebsites(): StoredWebsite[] {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }
  
  export function saveWebsite(website: StoredWebsite) {
    const websites = getStoredWebsites();
    websites.unshift(website); // newest first
    localStorage.setItem(STORAGE_KEY, JSON.stringify(websites));
  }
  
  export function deleteWebsite(id: string) {
    const websites = getStoredWebsites().filter(w => w.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(websites));
  }