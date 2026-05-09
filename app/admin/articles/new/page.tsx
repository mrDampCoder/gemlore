import ArticleForm from '../ArticleForm'

export const metadata = { title: 'Add Article — Admin' }

export default function NewArticlePage() {
  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-white">Add Article</h1>
        <p className="text-white/50 text-sm">Create a new article</p>
      </div>
      <div className="glass-card p-6">
        <ArticleForm mode="create" />
      </div>
    </div>
  )
}
