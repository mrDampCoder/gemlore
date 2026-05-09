export const dynamic = 'force-dynamic'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import DeleteGemstoneButton from './DeleteGemstoneButton'
import { Plus, Pencil } from 'lucide-react'

export const metadata = { title: 'Manage Gemstones — Admin' }

export default async function AdminGemstonesPage() {
  const gemstones = await prisma.gemstone.findMany({ orderBy: { name: 'asc' } })

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-white">Gemstones</h1>
          <p className="text-white/50 text-sm">{gemstones.length} total</p>
        </div>
        <Link href="/admin/gemstones/new" className="btn-primary text-sm flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Gemstone
        </Link>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left px-4 py-3 text-white/40 font-medium">Name</th>
                <th className="text-left px-4 py-3 text-white/40 font-medium hidden sm:table-cell">Category</th>
                <th className="text-left px-4 py-3 text-white/40 font-medium hidden md:table-cell">Color</th>
                <th className="text-left px-4 py-3 text-white/40 font-medium hidden lg:table-cell">Hardness</th>
                <th className="text-left px-4 py-3 text-white/40 font-medium hidden lg:table-cell">Origin</th>
                <th className="text-right px-4 py-3 text-white/40 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {gemstones.map((gem) => (
                <tr key={gem.id} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                  <td className="px-4 py-3">
                    <div>
                      <p className="text-white font-medium">{gem.name}</p>
                      <p className="text-xs text-white/30 font-mono">{gem.slug}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <span className="text-xs px-2 py-1 rounded-full bg-white/10 text-white/60">{gem.category}</span>
                  </td>
                  <td className="px-4 py-3 text-white/60 hidden md:table-cell">{gem.color}</td>
                  <td className="px-4 py-3 text-white/60 hidden lg:table-cell">{gem.hardness}</td>
                  <td className="px-4 py-3 text-white/60 hidden lg:table-cell">{gem.origin}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/gemstones/${gem.id}/edit`}
                        className="p-2 text-white/50 hover:text-gold-400 hover:bg-white/5 rounded-lg transition-colors"
                        aria-label="Edit"
                      >
                        <Pencil className="w-4 h-4" />
                      </Link>
                      <DeleteGemstoneButton id={gem.id} name={gem.name} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
