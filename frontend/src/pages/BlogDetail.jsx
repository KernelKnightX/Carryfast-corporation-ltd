import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "@/lib/api";
import SEO from "@/components/SEO";
import { ArrowLeft } from "lucide-react";

// Minimal markdown-ish renderer for headings, paragraphs, lists
function renderMarkdown(md = "") {
  const blocks = md.split(/\n\n+/);
  return blocks.map((b, i) => {
    const trimmed = b.trim();
    if (trimmed.startsWith("### ")) return <h3 key={i} className="font-display font-bold text-2xl text-navy-900 mt-10 mb-3">{trimmed.slice(4)}</h3>;
    if (trimmed.startsWith("## ")) return <h2 key={i} className="font-display font-bold text-3xl text-navy-900 mt-12 mb-4">{trimmed.slice(3)}</h2>;
    if (trimmed.startsWith("# ")) return <h1 key={i} className="font-display font-bold text-4xl text-navy-900 mt-12 mb-4">{trimmed.slice(2)}</h1>;
    if (/^(- |\* )/m.test(trimmed)) {
      const items = trimmed.split(/\n/).map((l) => l.replace(/^(- |\* )/, ""));
      return <ul key={i} className="list-disc pl-6 space-y-2 text-slate-700 my-4">{items.map((it, j) => <li key={j}>{it}</li>)}</ul>;
    }
    if (/^\d+\. /m.test(trimmed)) {
      const items = trimmed.split(/\n/).map((l) => l.replace(/^\d+\.\s*/, ""));
      return <ol key={i} className="list-decimal pl-6 space-y-2 text-slate-700 my-4">{items.map((it, j) => <li key={j}>{it}</li>)}</ol>;
    }
    return <p key={i} className="text-slate-700 leading-relaxed my-5 text-lg">{trimmed}</p>;
  });
}

export default function BlogDetail() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    api.get(`/blog/${slug}`).then((r) => setPost(r.data)).catch(() => setNotFound(true));
  }, [slug]);

  if (notFound) {
    return (
      <div className="container-x py-32 text-center">
        <h1 className="font-display font-bold text-3xl text-navy-900">Post not found.</h1>
        <Link to="/blog" className="mt-6 inline-block text-brand-orange font-semibold">← Back to blog</Link>
      </div>
    );
  }
  if (!post) return <div className="container-x py-32 text-center text-slate-500">Loading…</div>;

  return (
    <>
      <SEO
        title={`${post.meta_title || post.title} | Carry Fast`}
        description={post.meta_description || post.excerpt}
        keywords={post.meta_keywords || (post.tags || []).join(", ")}
        image={post.cover_image}
      />
      <article className="bg-white">
        <header className="bg-navy-900 text-white py-20 md:py-28">
          <div className="container-x max-w-4xl">
            <Link to="/blog" className="inline-flex items-center gap-2 text-white/60 hover:text-brand-orange text-sm mb-8" data-testid="blog-back">
              <ArrowLeft size={14} /> All insights
            </Link>
            <div className="text-overline mb-5">{(post.tags || [])[0] || "Logistics"}</div>
            <h1 className="font-display font-extrabold text-4xl md:text-6xl tracking-tight leading-[1.05]">{post.title}</h1>
            <div className="mt-8 text-sm text-white/60">
              {post.author} · {post.published_at ? new Date(post.published_at).toLocaleDateString() : ""}
            </div>
          </div>
        </header>

        {post.cover_image && (
          <div className="container-x max-w-5xl -mt-12">
            <img src={post.cover_image} alt={post.title} className="w-full h-[420px] object-cover shadow-xl" />
          </div>
        )}

        <div className="container-x max-w-3xl py-20">
          <p className="text-xl text-slate-600 leading-relaxed border-l-4 border-brand-orange pl-6 mb-12 italic">{post.excerpt}</p>
          {renderMarkdown(post.content)}
          {(post.tags || []).length > 0 && (
            <div className="mt-16 pt-8 border-t border-slate-200 flex flex-wrap gap-2">
              {post.tags.map((t) => <span key={t} className="text-xs uppercase tracking-wider bg-slate-100 px-3 py-1.5 text-slate-700">{t}</span>)}
            </div>
          )}
        </div>
      </article>
    </>
  );
}
