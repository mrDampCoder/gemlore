import GemstoneForm from '../GemstoneForm'

export const metadata = { title: 'Add Gemstone — Admin' }

export default function NewGemstonePage() {
  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-white">Add Gemstone</h1>
        <p className="text-white/50 text-sm">Create a new gemstone entry</p>
      </div>
      <div className="glass-card p-6">
        <GemstoneForm mode="create" />
      </div>
    </div>
  )
}
