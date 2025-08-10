import { useAuthStore } from "@/hooks/use-auth-store";
import { create } from "zustand";

export type Article = {
    id: string;
    title: string;
    author: string;
    publishedAt: string;
    views: number;
    likes: number;
    comments: number;
    content: string;
    status: "PUBLISHED" | "DRAFT";
};

type SortBy = keyof Pick<Article, "title" | "author" | "publishedAt" | "views" | "likes" | "comments">;
type SortDir = "asc" | "desc";

type Filters = {
    search: string;
    author?: string;
    startDate?: string;
    endDate?: string;
    sortBy: SortBy;
    sortDir: SortDir;
    page: number;
};

type Aggregations = {
    byDate: {
        daily: { label: string; views: number }[];
        monthly: { label: string; views: number }[];
    };
};

type FilteredResult = {
    articles: Article[];
    page: number;
    aggregations: Aggregations;
};

type ArticlesState = {
    articles: Article[];
    authors: string[];
    filters: Filters;
    total: number;
    filtered: FilteredResult;

    setFilters: (filters: Filters) => void;
    createArticle: (article: { title: string; content: string; status: "PUBLISHED" | "DRAFT" }) => void;
    updateArticle: (id: string, patch: Partial<Article>) => void;

    processArticles: () => void;
    initArticles: (articles: Article[]) => void;
};

function filterAndSort(articles: Article[], filters: Filters) {
    const { search, author, startDate, endDate, sortBy, sortDir } = filters;
    let list = articles.slice();

    if (search.trim()) {
        const q = search.trim().toLowerCase();
        list = list.filter((a) => a.title.toLowerCase().includes(q));
    }
    if (author) {
        list = list.filter((a) => a.author === author);
    }
    if (startDate) {
        const s = new Date(startDate).getTime();
        list = list.filter((a) => new Date(a.publishedAt).getTime() >= s);
    }
    if (endDate) {
        const e = new Date(endDate).getTime();
        list = list.filter((a) => new Date(a.publishedAt).getTime() <= e);
    }

    list.sort((a, b) => {
        const av = a[sortBy];
        const bv = b[sortBy];
        const comp = av === bv ? 0 : av > bv ? 1 : -1;
        return sortDir === "asc" ? comp : -1 * comp;
    });

    return list;
}

function paginate<T>(list: T[], page: number, pageSize: number) {
    const start = (page - 1) * pageSize;
    return list.slice(start, start + pageSize);
}

function aggregateByDay(list: Article[]) {
    const map = new Map<string, number>();
    list.forEach((a) => {
        const d = new Date(a.publishedAt);
        const key = d.toISOString().slice(0, 10);
        map.set(key, (map.get(key) ?? 0) + a.views);
    });
    const arr = Array.from(map.entries())
        .sort((a, b) => (a[0] > b[0] ? 1 : -1))
        .map(([k, v]) => ({ label: k, views: v }));
    return arr;
}

function aggregateByMonth(list: Article[]) {
    const map = new Map<string, number>();
    list.forEach((a) => {
        const d = new Date(a.publishedAt);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
        map.set(key, (map.get(key) ?? 0) + a.views);
    });
    const arr = Array.from(map.entries())
        .sort((a, b) => (a[0] > b[0] ? 1 : -1))
        .map(([k, v]) => ({ label: k, views: v }));
    return arr;
}

export const useArticlesStore = create<ArticlesState>((set, get) => ({
    articles: [],
    authors: [],
    filters: {
        search: "",
        sortBy: "views",
        sortDir: "desc",
        page: 1,
    },
    total: 0,
    filtered: {
        articles: [],
        page: 1,
        aggregations: {
            byDate: {
                daily: [],
                monthly: [],
            },
        },
    },

    setFilters: (filters) => {
        set({ filters });
        get().processArticles();
    },

    createArticle: (article) => {
        const { articles } = get();
        const newArticle: Article = {
            id: String(Number(articles[articles.length - 1].id) + 1),
            author: useAuthStore.getState().user?.name || "",
            ...article,
            publishedAt: new Date().toISOString(),
            views: 0,
            likes: 0,
            comments: 0,
        };
        set({ articles: [...articles, newArticle] });
        get().processArticles();
    },

    updateArticle: (id, patch) => {
        const { articles } = get();
        const updatedArticles = articles.map((a) => (a.id === id ? { ...a, ...patch } : a));

        set({ articles: updatedArticles });
        get().processArticles();
    },

    processArticles: () => {
        const { articles, filters } = get();

        const filteredList = filterAndSort(articles, filters);
        const total = filteredList.length;
        const page = Math.max(1, Math.min(filters.page, Math.ceil(total / 10) || 1));
        const list = paginate(filteredList, page, 10);
        const daily = aggregateByDay(filteredList);
        const monthly = aggregateByMonth(filteredList);

        const filtered: FilteredResult = {
            articles: list,
            page,
            aggregations: {
                byDate: {
                    daily,
                    monthly,
                },
            },
        };

        set({ total, filtered });
    },
    initArticles: (articles: Article[]) => {
        set({ articles });
        get().processArticles();
    },
}));
