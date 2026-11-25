import { GithubProfile, GithubRepo } from "@/types";
export type { GithubProfile, GithubRepo };

const GITHUB_USERNAME = process.env.NEXT_PUBLIC_GITHUB_USERNAME || "Ryusaaa";
const BASE_URL = "https://api.github.com";

// Retry configuration
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

// Helper function to delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function fetchGithub<T>(endpoint: string, revalidate = 3600, retries = MAX_RETRIES): Promise<T> {
    const url = `${BASE_URL}${endpoint}`;
    const headers: HeadersInit = {
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
    };

    if (process.env.GITHUB_TOKEN) {
        headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    }

    try {
        const res = await fetch(url, {
            headers,
            next: { revalidate },
        });

        if (!res.ok) {
            // If rate limited or server error, retry
            if ((res.status === 429 || res.status >= 500) && retries > 0) {
                console.warn(`GitHub API Error for ${endpoint}: ${res.status}, retrying... (${retries} attempts left)`);
                await delay(RETRY_DELAY * (MAX_RETRIES - retries + 1)); // Exponential backoff
                return fetchGithub<T>(endpoint, revalidate, retries - 1);
            }

            console.error(`GitHub API Error for ${endpoint}: ${res.status}`);
            throw new Error(`GitHub API Error: ${res.statusText}`);
        }

        return res.json();
    } catch (error) {
        if (retries > 0 && error instanceof TypeError) {
            // Network error, retry
            console.warn(`Network error for ${endpoint}, retrying... (${retries} attempts left)`);
            await delay(RETRY_DELAY * (MAX_RETRIES - retries + 1));
            return fetchGithub<T>(endpoint, revalidate, retries - 1);
        }
        throw error;
    }
}

// Safe fetch that returns null on error instead of throwing
async function safeFetchGithub<T>(endpoint: string, revalidate = 3600): Promise<T | null> {
    try {
        return await fetchGithub<T>(endpoint, revalidate);
    } catch (error) {
        console.error(`Safe fetch failed for ${endpoint}:`, error);
        return null;
    }
}

export async function getProfile(): Promise<GithubProfile> {
    const profile = await safeFetchGithub<GithubProfile>(`/users/${GITHUB_USERNAME}`);

    // Return fallback profile if API fails
    if (!profile) {
        return {
            login: GITHUB_USERNAME,
            name: "Satria Ibnu Safarudin",
            avatar_url: `https://github.com/${GITHUB_USERNAME}.png`,
            bio: "Web Developer",
            public_repos: 0,
            followers: 0,
            following: 0,
            html_url: `https://github.com/${GITHUB_USERNAME}`,
            company: null,
            blog: "",
            location: null,
            email: null,
            created_at: new Date().toISOString(),
        };
    }

    return profile;
}

export async function getRepos(): Promise<GithubRepo[]> {
    const repos = await safeFetchGithub<GithubRepo[]>(`/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`);

    // Return empty array if API fails
    if (!repos) {
        console.warn("Failed to fetch repos, returning empty array");
        return [];
    }

    // Filter out forks
    return repos.filter(repo => !repo.fork);
}

export async function getRepo(slug: string): Promise<GithubRepo | null> {
    return safeFetchGithub<GithubRepo>(`/repos/${GITHUB_USERNAME}/${slug}`);
}

export async function getRepoReadme(slug: string): Promise<string | null> {
    try {
        const res = await fetchGithub<{ content: string; encoding: string }>(`/repos/${GITHUB_USERNAME}/${slug}/readme`);
        if (res.encoding === "base64") {
            return atob(res.content);
        }
        return res.content;
    } catch {
        return null;
    }
}

export async function getRecentActivity() {
    const activity = await safeFetchGithub<Record<string, unknown>[]>(`/users/${GITHUB_USERNAME}/events?per_page=20`, 600);
    return activity || [];
}
