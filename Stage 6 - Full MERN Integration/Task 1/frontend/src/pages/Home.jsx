import SiteLayout from '../components/ui/SiteLayout';
import Button from '../components/ui/Button';
import { PostGrid } from '../components/ui/PostCard';

const mockPosts = [
  {
    id: 1,
    title: 'Designing with Dark Mode in Mind',
    category: 'Design',
    date: 'Nov 24',
    cover: '/images/post-1.jpg',
    excerpt:
      'Learn how to build immersive interfaces using glassmorphism, cool blues, and high-contrast palettes.',
  },
  {
    id: 2,
    title: 'From Markdown to Production',
    category: 'Engineering',
    date: 'Nov 18',
    cover: '/images/post-2.jpg',
    excerpt: 'A tooling breakdown for Jamstack teams that want reliable delivery pipelines.',
  },
  {
    id: 3,
    title: 'UX Research Notes',
    category: 'Product',
    date: 'Nov 12',
    cover: '/images/post-3.jpg',
    excerpt: 'How we synthesize interviews into actionable insights within 48 hours.',
  },
];

export default function Home() {
  return (
    <SiteLayout>
      <section className="rounded-3xl border border-ink-700 bg-gradient-to-br from-ink-900 via-ink-800 to-ink-900 p-10 shadow-card text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-blue-300">Premium Stories</p>
        <h1 className="mt-4 text-4xl font-bold">A modern blog for deep dives and bold looks.</h1>
        <p className="mt-3 text-slate-400 max-w-2xl mx-auto">
          Crafted with Tailwind, optimized for readability, powered by blue-lit interactions.
        </p>
        <div className="mt-6 flex justify-center gap-4">
          <Button>Start Reading</Button>
          <Button variant="secondary">Subscribe</Button>
        </div>
      </section>

      <section className="mt-12 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Featured Posts</h2>
          <Button variant="ghost">View All</Button>
        </div>
        <PostGrid posts={mockPosts} />
      </section>
    </SiteLayout>
  );
}

