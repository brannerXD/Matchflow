const API = "http://localhost:3000";

async function apiGet(path){
    const res = await fetch(API + path);
    return await res.json();
}

async function apiPost(path, data){
    const res = await fetch(API + path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });
    return await res.json();
}
