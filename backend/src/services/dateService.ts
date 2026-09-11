export function getLocalDateString(date:Date,timeZone:string):string{return new Intl.DateTimeFormat("en-CA",{timeZone,year:"numeric",month:"2-digit",day:"2-digit"}).format(date);}
export function addCalendarDays(dateString:string,days:number):string{const d=new Date(`${dateString}T12:00:00Z`);d.setUTCDate(d.getUTCDate()+days);return d.toISOString().slice(0,10);}
export function isValidTimeZone(timeZone:string){try{new Intl.DateTimeFormat("en-US",{timeZone}).format();return true;}catch{return false;}}
