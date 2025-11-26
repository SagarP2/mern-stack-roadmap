export function PostCard({ post, featured = false }) {
  return (
    <article
      className={`flex flex-col rounded-3xl border border-ink-700 bg-ink-900/70 p-6 shadow-card transition duration-200 hover:-translate-y-1 hover:shadow-card-hover motion-reduce:transform-none ${
        featured ? 'lg:col-span-2' : ''
      }`}
    >
      <img src={post.cover} alt="" className="h-48 w-full rounded-2xl object-cover" />
      <div className="mt-4 flex items-center gap-2 text-xs uppercase tracking-wide text-blue-300">
        {post.category}
        <span className="text-slate-500">•</span>
        {post.date}
      </div>
      <h3 className="mt-3 text-2xl font-semibold text-slate-100">{post.title}</h3>
      <p className="mt-2 text-slate-400">{post.excerpt}</p>
    </article>
  );
}

export function PostGrid({ posts }) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {posts.map((post, idx) => (
        <PostCard key={post.id} post={post} featured={idx === 0} />
      ))}
    </div>
  );
}

