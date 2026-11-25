// Public GitHub profile facts for the footer's hover card, fetched once per build.
// Uses GITHUB_TOKEN when present (CI) to avoid rate limits; falls back to nothing on error,
// and the card then shows just the handle.
import { GITHUB_USER } from './contact';

export interface GitHubCard {
  avatar: string;
  repos: number | null;
  recent: string[];
}

let cache: Promise<GitHubCard> | undefined;

export function githubCard(): Promise<GitHubCard> {
  cache ??= (async () => {
    const fallback: GitHubCard = { avatar: `https://github.com/${GITHUB_USER}.png?size=160`, repos: null, recent: [] };
    try {
      const headers: Record<string, string> = { Accept: 'application/vnd.github+json', 'User-Agent': 'portfolio-build' };
      if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
      const [user, repos] = await Promise.all([
        fetch(`https://api.github.com/users/${GITHUB_USER}`, { headers }).then((r) => (r.ok ? r.json() : null)),
        fetch(`https://api.github.com/users/${GITHUB_USER}/repos?sort=pushed&per_page=20`, { headers }).then((r) =>
          r.ok ? r.json() : [],
        ),
      ]);
      const skip = new Set([GITHUB_USER, 'register']);
      return {
        avatar: user?.avatar_url ? `${user.avatar_url}&s=160` : fallback.avatar,
        repos: typeof user?.public_repos === 'number' ? user.public_repos : null,
        recent: (repos as { name: string; fork: boolean }[])
          .filter((r) => !r.fork && !skip.has(r.name))
          .slice(0, 3)
          .map((r) => r.name),
      };
    } catch {
      return fallback;
    }
  })();
  return cache;
}
