import { Gem, BookOpen, Users, Sparkles } from 'lucide-react'
import Link from 'next/link'

export const metadata = {
  title: 'About GemLore',
  description: 'Learn about GemLore\'s mission to educate and inspire curiosity about gemstones and the natural world.',
}

export default function AboutPage() {
  return (
    <div className="page-container py-16 animate-fade-in">
      {/* Hero */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gold-500/15 border border-gold-500/20 mb-6">
          <Gem className="w-10 h-10 text-gold-400" />
        </div>
        <h1 className="font-display text-5xl font-bold text-white mb-4">About GemLore</h1>
        <p className="text-xl text-white/60 max-w-2xl mx-auto leading-relaxed">
          Where the science of the earth meets the poetry of human imagination
        </p>
      </div>

      <div className="max-w-3xl mx-auto space-y-10">
        {/* Mission */}
        <section className="glass-card p-8">
          <h2 className="font-display text-2xl font-semibold text-white mb-4">Our Mission</h2>
          <div className="space-y-4 text-white/70 leading-relaxed">
            <p>
              GemLore exists to bridge the gap between scientific understanding and human wonder. Gemstones are
              among the most extraordinary objects in the natural world — formed under conditions of almost
              unimaginable heat and pressure, over timescales that dwarf human civilization, and endowed by human
              cultures with meanings and mythologies that span every continent and every era.
            </p>
            <p>
              We believe that understanding why a ruby is red makes it more beautiful, not less — just as knowing
              that a sapphire formed 450 million years ago in the collision of ancient continents deepens, rather
              than diminishes, the experience of holding one. GemLore is built on the conviction that science and
              wonder are not opposites but partners, each enriching the other.
            </p>
          </div>
        </section>

        {/* What you can do */}
        <section>
          <h2 className="font-display text-2xl font-semibold text-white mb-6">What You Can Do on GemLore</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                icon: <Gem className="w-5 h-5" />,
                title: 'Browse the Catalog',
                description: 'Explore our growing library of gemstones with detailed descriptions, geological properties, and rich lore. Filter by category, color, or search by name.',
              },
              {
                icon: <BookOpen className="w-5 h-5" />,
                title: 'Read In-Depth Articles',
                description: 'Our editorial team publishes detailed articles on gem geology, buyer\'s guides, birthstone history, care techniques, and cultural mythology.',
              },
              {
                icon: <Sparkles className="w-5 h-5" />,
                title: 'Save Your Favorites',
                description: 'Create a free account and build a personal collection of your favorite gemstones. Your favorites are always accessible from your profile.',
              },
              {
                icon: <Users className="w-5 h-5" />,
                title: 'Join the Discussion',
                description: 'Comment on gemstone pages and articles to share your knowledge, experiences, and passion with a community of fellow enthusiasts.',
              },
            ].map((feature) => (
              <div key={feature.title} className="glass-card p-5 flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-gold-500/15 flex items-center justify-center text-gold-400 flex-shrink-0">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="font-medium text-white mb-1">{feature.title}</h3>
                  <p className="text-sm text-white/60 leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Why gemstones matter */}
        <section className="glass-card p-8">
          <h2 className="font-display text-2xl font-semibold text-white mb-4">Why Gemstones Matter</h2>
          <div className="space-y-4 text-white/70 leading-relaxed">
            <p>
              Humans have collected, treasured, and adorned themselves with gemstones for at least 100,000 years.
              Long before the first civilization, our ancestors recognized something special in these glittering
              objects from the earth. This universal impulse — to seek beauty, to mark the precious, to connect
              the material to the sacred — is one of the most distinctly human characteristics we possess.
            </p>
            <p>
              Gemstones are also remarkable scientific objects. A diamond is the hardest natural substance on
              earth, composed of carbon atoms arranged with extraordinary precision. An opal contains up to 20%
              water and produces its colors not through pigment but through the physics of light diffraction.
              Ruby and sapphire are the same mineral — corundum — differentiated only by trace amounts of
              chromium or iron and titanium. Every gem tells a story of chemistry, geology, and time.
            </p>
            <p>
              We hope that GemLore becomes a trusted companion in your exploration of this remarkable world —
              whether you are a collector building a serious collection, a student fascinated by mineralogy, a
              jeweler seeking deeper knowledge of your materials, or simply someone who has always been
              captivated by a beautiful stone.
            </p>
          </div>
        </section>

        <div className="text-center pt-4">
          <Link href="/gemstones" className="btn-primary inline-flex items-center gap-2">
            Start Exploring
          </Link>
        </div>
      </div>
    </div>
  )
}
