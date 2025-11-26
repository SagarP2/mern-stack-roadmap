export function PostList({ posts }) {
  return (
    <ul className="space-y-6">
      {posts.map((post) => (
        <li
          key={post.id}
          className="rounded-2xl border border-ink-700 bg-ink-900/60 p-6 shadow-card hover:shadow-card-hover transition"
        >
          <a
            href={`/posts/${post.slug}`}
            className="text-xl font-semibold text-slate-100 hover:text-blue-200 focus-visible:outline-none focus-visible:ring focus-visible:ring-blue-300/70 rounded"
          >
            {post.title}
          </a>
          <p className="mt-2 text-slate-400">{post.excerpt}</p>
        </li>
      ))}
    </ul>
  );
}

export function PostDetails({ post }) {
  return (
    <article className="prose prose-invert max-w-none prose-headings:text-slate-100 prose-p:text-slate-300 prose-a:text-blue-300">
      <h1 className="text-4xl font-bold">{post.title}</h1>
      <p className="text-slate-400">{post.subtitle}</p>
      <img src={post.cover} alt="" className="my-8 rounded-3xl" />
      {post.content}
    </article>
  );
}

