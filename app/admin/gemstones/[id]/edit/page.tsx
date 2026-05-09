export const dynamic = 'force-dynamic'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import GemstoneForm from '../../GemstoneForm'

export const metadata = { title: 'Edit Gemstone — Admin' }

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EditGemstonePage({ params }: PageProps) {
  const { id } = await params
  const gemstone = await prisma.gemstone.findUnique({ where: { id } })

  if (!gemstone) notFound()

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-white">Edit Gemstone</h1>
        <p className="text-white/50 text-sm">Editing: {gemstone.name}</p>
      </div>
      <div className="glass-card p-6">
        <GemstoneForm
          mode="edit"
          initialData={gemstone}
        />
      </div>
    </div>
  )
}
