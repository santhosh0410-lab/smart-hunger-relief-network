const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL ||
    "https://smart-hunger-relief-backend.onrender.com";

export const apiRequest = async (
    endpoint: string,
    options: RequestInit = {}
) => {

    const token = localStorage.getItem("token");

    const headers = new Headers(options.headers);

    if (token) {
        headers.set("Authorization", `Bearer ${token}`);
    }

    const response = await fetch(
        `${API_BASE_URL}${endpoint}`,
        {
            ...options,
            headers
        }
    );

    return response;
};