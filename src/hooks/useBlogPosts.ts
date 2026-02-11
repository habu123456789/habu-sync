import { useState, useEffect } from 'react';

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  published: string;
  url: string;
  author: string;
  isLocal?: boolean;
  user_id?: string;
}

const BLOG_FEED_URL = 'https://habu-says.blogspot.com/feeds/posts/default?alt=json&max-results=50';

function stripHtml(html: string): string {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent || '';
}

function parseFeed(data: any): BlogPost[] {
  const entries = data?.feed?.entry || [];
  return entries.map((entry: any) => {
    const altLink = entry.link?.find((l: any) => l.rel === 'alternate');
    return {
      id: entry.id?.$t || '',
      title: entry.title?.$t || 'Untitled',
      content: entry.content?.$t || '',
      published: entry.published?.$t || '',
      url: altLink?.href || '#',
      author: entry.author?.[0]?.name?.$t || 'Habu',
    };
  });
}

export function useBlogPosts() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(BLOG_FEED_URL);
        const data = await res.json();
        setPosts(parseFeed(data));
      } catch (e) {
        console.error('Blog feed error:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  return { posts, loading, error, stripHtml };
}
