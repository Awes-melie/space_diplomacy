const BACKEND = 'http://localhost:3000'
export const api = async (path : String, options : Object = {}) => {
    const res = await fetch(BACKEND + {path}, options);
    return res.json();
};
