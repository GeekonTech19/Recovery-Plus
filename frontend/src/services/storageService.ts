export function saveData<T>(key: string, data: T): void {
    localStorage.setItem(key, JSON.stringify(data));
  }
  
  export function getData<T>(key: string): T | null {
    const data = localStorage.getItem(key);
  
    if (!data) {
      return null;
    }
  
    return JSON.parse(data) as T;
  }
  
  export function removeData(key: string): void {
    localStorage.removeItem(key);
  }
  
  export function clearStorage(): void {
    localStorage.clear();
  }