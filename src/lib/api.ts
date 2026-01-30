const API_BASE =
    (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/$/, "") ||
    "http://localhost:3000";

async function getJson<T>(path: string): Promise<T> {
    const url = `${API_BASE}${path.startsWith("/") ? "" : "/"}${path}`;

    const res = await fetch(url, {
        method: "GET",
        headers: { "Accept": "application/json" },
    });

    if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`API ${res.status} ${res.statusText}: ${text}`);
    }

    return res.json() as Promise<T>;
}

export type NewsItem = {
    id: number;
    title: string;
    description: string;
    tag: string;
    created_at: string; // kommt aus Postgres als ISO string
};

export type GlobalStats = {
    totalUsers: string;  // COUNT(*) kommt oft als string
    onlineUsers: string;
};

export const api = {
    health: () => getJson<{ status: string; uptime: number }>("/health"),
    news: () => getJson<NewsItem[]>("/api/news"),
    stats: () => getJson<GlobalStats>("/api/stats"),
};
