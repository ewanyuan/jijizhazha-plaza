export const STORAGE_KEY = 'jijizhazha:public-reading:v1';
const validId = /^[a-f0-9]{24}$/;

export function readMarks(storage) {
 const value=JSON.parse(storage.getItem(STORAGE_KEY)||'{}');
 if(!value||typeof value!=='object'||Array.isArray(value))throw Error('Invalid reading state');
 const marks={};
 for(const [id,row] of Object.entries(value)){
  if(!validId.test(id)||!row||typeof row!=='object')continue;
  marks[id]={read:!!row.read,disposition:['useful','follow','ignore'].includes(row.disposition)?row.disposition:'',note:typeof row.note==='string'?row.note.slice(0,5000):'',quotes:Array.isArray(row.quotes)?row.quotes.filter(x=>typeof x==='string').map(x=>x.slice(0,2000)).slice(-30):[]};
 }
 return marks;
}

export function commitMark(storage,id,update) {
 if(!validId.test(id))throw Error('Invalid card identity');
 // Read the latest persisted map at each write, including cards absent from this snapshot.
 const latest=readMarks(storage),current=latest[id]||{},delta=typeof update==='function'?update(current):update;
 latest[id]={...current,...delta};
 storage.setItem(STORAGE_KEY,JSON.stringify(latest));
 return latest;
}
