// utils/db.ts
const store = new Map<string, any>();

export function saveToDb(id: string, data: any) {
    store.set(id, data);
}

export async function getFromDb(id: string) {
    return  await store.get(id);
}
