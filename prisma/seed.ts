import { PrismaClient, Role } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Clear existing data
  await prisma.favorite.deleteMany()
  await prisma.comment.deleteMany()
  await prisma.passwordResetToken.deleteMany()
  await prisma.article.deleteMany()
  await prisma.gemstone.deleteMany()
  await prisma.user.deleteMany()

  // Create users
  const adminHash = await bcrypt.hash('Admin@123', 12)
  const userHash = await bcrypt.hash('User@123', 12)
  const demoHash = await bcrypt.hash('Demo@123', 12)

  const admin = await prisma.user.create({
    data: {
      email: 'admin@gemlore.com',
      passwordHash: adminHash,
      name: 'Site Admin',
      role: Role.ADMIN,
    },
  })

  const regularUser = await prisma.user.create({
    data: {
      email: 'user@gemlore.com',
      passwordHash: userHash,
      name: 'Alex Stone',
      role: Role.USER,
    },
  })

  const demoUser = await prisma.user.create({
    data: {
      email: 'demo@gemlore.com',
      passwordHash: demoHash,
      name: 'Jordan Crystals',
      role: Role.USER,
    },
  })

  console.log('Users created')

  // Create gemstones
  const gemstones = await Promise.all([
    prisma.gemstone.create({
      data: {
        slug: 'ruby',
        name: 'Ruby',
        category: 'Precious',
        color: 'Deep red',
        hardness: 9.0,
        origin: 'Myanmar',
        visualKey: 'ruby',
        description: `Ruby is one of the most celebrated gemstones in the world, prized for its intense crimson hue that ranges from pinkish-red to deep blood-red. It belongs to the corundum family, achieving its extraordinary color from trace amounts of chromium within the crystal lattice. The finest specimens, known as "pigeon's blood" rubies, come from the Mogok Valley of Myanmar and command prices that rival diamonds. Rubies form deep within the earth's crust under intense heat and pressure, emerging through metamorphic processes over millions of years. Their exceptional hardness of 9 on the Mohs scale makes them superbly durable gemstones for everyday wear.`,
        lore: `Throughout history, ruby has been revered as the king of gemstones. Ancient Hindus called it "ratnaraj," meaning king of precious stones, and believed wearing it would grant safety and bring peace. Burmese warriors embedded rubies in their skin before battle, believing the stones would render them invincible. In medieval Europe, rubies were thought to protect against plague and banish sorrow. The Bible references rubies as the most valuable of all gems, and countless royal crowns have featured these fiery stones. Ruby is the traditional gift for 40th and 80th wedding anniversaries, symbolizing enduring passion and undying love.`,
      },
    }),
    prisma.gemstone.create({
      data: {
        slug: 'sapphire',
        name: 'Sapphire',
        category: 'Precious',
        color: 'Royal blue',
        hardness: 9.0,
        origin: 'Sri Lanka',
        visualKey: 'sapphire',
        description: `Sapphire, the regal blue variety of corundum, has captivated humanity for millennia with its deep celestial hues. While most famous in vivid royal blue, sapphires actually occur in every color except red (which becomes ruby). The prized "cornflower blue" sapphires from Sri Lanka, known as Ceylon sapphires, display a velvety medium blue that is considered among the most beautiful in the world. Color in blue sapphires comes from trace amounts of iron and titanium within the aluminum oxide crystal structure. Sri Lanka has been producing exceptional sapphires for over 2,000 years, and its gem-bearing alluvial gravels continue to yield spectacular specimens that grace the world's finest jewelry collections.`,
        lore: `Sapphire has long been associated with the heavens, wisdom, and divine favor. Ancient Persians believed the earth rested on a giant sapphire whose reflection painted the sky blue. Medieval clergy favored sapphires because they symbolized heaven and were believed to attract divine blessings. The ancient Greeks wore sapphires when consulting the Oracle at Delphi, believing the stone enhanced wisdom and prophetic vision. Kings and queens throughout history wore sapphires as protection from harm and envy. In modern times, sapphire gained renewed fame when Prince Charles chose a 12-carat Ceylon sapphire for Princess Diana's engagement ring, a piece now worn by Princess Catherine.`,
      },
    }),
    prisma.gemstone.create({
      data: {
        slug: 'emerald',
        name: 'Emerald',
        category: 'Precious',
        color: 'Vivid green',
        hardness: 7.5,
        origin: 'Colombia',
        visualKey: 'emerald',
        description: `Emerald, the lush green variety of beryl, is one of the most valuable gemstones per carat in the world. Its signature vivid green color results from trace amounts of chromium and vanadium within the beryl crystal structure. Colombian emeralds, particularly those from the Muzo and Chivor mines, are considered the world's finest due to their exceptional color saturation and clarity. Unlike many other gemstones, inclusions in emeralds are accepted and even expected — they are called "jardin" (French for garden) and are considered part of the stone's character. Emeralds have a slightly lower hardness than rubies and sapphires, making them somewhat more susceptible to chipping and requiring careful handling.`,
        lore: `Emerald has been treasured since antiquity. Ancient Egyptians mined emeralds as early as 1500 BCE, and Cleopatra was famously obsessed with them, claiming ownership of all emerald mines in Egypt. The Incas and Aztecs considered emeralds sacred stones, and Spanish conquistadors looted enormous quantities from South America. In Hindu astrology, emerald is associated with the planet Mercury and is believed to bring intelligence, eloquence, and business acumen to its wearer. Ancient Romans dedicated emeralds to Venus, goddess of love and beauty. Today, emerald remains the traditional birthstone for May and is associated with rebirth, fertility, and eternal youth.`,
      },
    }),
    prisma.gemstone.create({
      data: {
        slug: 'diamond',
        name: 'Diamond',
        category: 'Precious',
        color: 'Colorless',
        hardness: 10.0,
        origin: 'South Africa',
        visualKey: 'diamond',
        description: `Diamond stands alone as the hardest natural substance known to science, scoring a perfect 10 on the Mohs scale. Composed of pure carbon atoms arranged in a cubic crystal lattice, diamonds form approximately 100 miles beneath the earth's surface under extreme pressure and temperature conditions exceeding 2,000°F. They are transported to the surface through volcanic pipes called kimberlites. South Africa became the world's leading diamond producer following the discovery at Kimberley in 1867, which sparked a massive diamond rush. The optical properties of diamond are extraordinary — its high refractive index and strong dispersion create the legendary brilliance and fire that make cut diamonds display dazzling spectral colors when illuminated.`,
        lore: `Diamonds have symbolized invincibility, purity, and eternal love across cultures for thousands of years. The ancient Romans believed diamonds were tears of the gods, while the Greeks thought they were splinters of fallen stars. The tradition of diamond engagement rings began in 1477 when Archduke Maximilian of Austria gave a diamond ring to Mary of Burgundy. De Beers' famous 1947 campaign "A Diamond is Forever" cemented the diamond's cultural status as the ultimate symbol of enduring love. The Hope Diamond, a 45.52-carat blue diamond, is one of the most famous gemstones in history, with a legend of a curse following all who possess it. Diamonds remain the world's best-known precious stone.`,
      },
    }),
    prisma.gemstone.create({
      data: {
        slug: 'amethyst',
        name: 'Amethyst',
        category: 'Semi-precious',
        color: 'Violet',
        hardness: 7.0,
        origin: 'Brazil',
        visualKey: 'amethyst',
        description: `Amethyst is the most celebrated variety of quartz, renowned for its enchanting purple to violet hues that range from pale lavender to deep royal purple. Its color arises from irradiation and iron impurities within silicon dioxide crystals. Brazil is the world's largest producer of amethyst, with the state of Rio Grande do Sul containing enormous geode deposits that yield spectacular crystals weighing hundreds of pounds. Uruguay produces smaller but particularly intensely colored specimens. The color distribution in amethysts is often uneven, appearing in bands or patches within the crystal — skilled gem cutters orient stones to maximize color concentration. Unlike rubies, sapphires, and emeralds, amethyst is abundant enough that exceptional specimens remain relatively affordable.`,
        lore: `The name amethyst derives from the ancient Greek word "amethystos," meaning "not intoxicated," reflecting the widespread ancient belief that the stone prevented drunkenness. Greeks and Romans wore amethyst amulets and crafted wine goblets from the stone, believing it would keep them sober during feasts. In medieval Europe, amethyst was considered a stone of royalty — its purple color associated with the bishops of the Catholic Church, who still wear amethyst rings today. Tibetan Buddhists consider amethyst sacred to the Buddha and use it for meditation beads. In crystal healing traditions, amethyst is believed to calm the mind, enhance intuition, and promote spiritual awareness. It is the traditional birthstone for February.`,
      },
    }),
    prisma.gemstone.create({
      data: {
        slug: 'topaz',
        name: 'Topaz',
        category: 'Semi-precious',
        color: 'Golden yellow',
        hardness: 8.0,
        origin: 'Pakistan',
        visualKey: 'topaz',
        description: `Topaz is an aluminum silicate fluoride hydroxide mineral that occurs in a remarkable range of colors, though the name most commonly evokes the rich golden-yellow or orange-brown "precious topaz" hue. Pakistan's Katlang deposit and the Shigar Valley produce some of the finest golden topaz specimens in the world, along with spectacular blue and pink varieties. Colorless topaz is quite common, and much of the blue topaz on the market has been heat-treated or irradiated from colorless material. Imperial topaz, the most valuable variety, displays rich orange with pink undertones and is found almost exclusively in Ouro Preto, Brazil. Topaz has perfect cleavage in one direction, meaning it can split cleanly with a hard blow — a property gem cutters and owners must respect.`,
        lore: `The word topaz likely derives from Topazios, the ancient Greek name for St. John's Island in the Red Sea, where yellow gems were historically mined. Ancient Romans associated yellow topaz with Jupiter, king of the gods, and believed the stone increased strength and made its wearer invincible. Medieval Europeans believed topaz could break evil spells and calm anger. In Renaissance Europe, it was thought that topaz could detect poison — a critical concern in an era of political intrigue — by changing color in the presence of toxins. Ayurvedic traditions prize topaz as a stone that promotes wisdom, longevity, and beauty. Golden topaz remains the traditional birthstone for November.`,
      },
    }),
    prisma.gemstone.create({
      data: {
        slug: 'aquamarine',
        name: 'Aquamarine',
        category: 'Semi-precious',
        color: 'Sky blue',
        hardness: 7.5,
        origin: 'Pakistan',
        visualKey: 'aquamarine',
        description: `Aquamarine is the light blue to greenish-blue variety of beryl, sharing its mineral family with emerald, morganite, and heliodor. Its name perfectly captures its essence — derived from the Latin "aqua marina," meaning sea water. The finest aquamarines display a clear, saturated medium blue without any greenish secondary hues, though many collectors prize the natural sea-green tones. Pakistan's Karakorum and Hindu Kush mountain ranges yield exceptional large crystals of exceptional clarity, making them prized by collectors. Aquamarine typically forms as large, well-terminated hexagonal crystals in granite pegmatites, and stones of 100 carats or more are not uncommon. Heat treatment is standard practice to remove any greenish hues and enhance the blue color.`,
        lore: `Sailors throughout history treasured aquamarine as a protective talisman against the perils of the sea. Ancient mariners believed the stone was the treasure of mermaids and that carrying it would guarantee a safe voyage and calm storms. The Romans believed fish were sacred to Neptune and that aquamarine would appease the god of the sea. Greek sailors wore aquamarine amulets engraved with Poseidon on their triremes. Medieval Europeans believed aquamarine reawakened the love of married couples who had grown apart, and it was given as a gift to encourage reconciliation. Today, aquamarine is the traditional birthstone for March and is associated with courage, clarity of mind, and youthful vitality.`,
      },
    }),
    prisma.gemstone.create({
      data: {
        slug: 'garnet',
        name: 'Garnet',
        category: 'Semi-precious',
        color: 'Wine red',
        hardness: 7.0,
        origin: 'India',
        visualKey: 'garnet',
        description: `Garnet is not a single mineral but a family of silicate minerals sharing a common crystal structure, occurring in virtually every color except blue. The most familiar variety is the deep wine-red almandine garnet, which is found in abundance across India, particularly in the states of Rajasthan and Andhra Pradesh. India has been a major source of garnets for international markets for centuries. Other notable varieties include the vivid green tsavorite from Kenya, the rare orange-to-red spessartine from Namibia, and the color-change alexandrite-like garnets from East Africa. Almandine garnets form in metamorphic rocks under heat and pressure, and their isometric crystal system produces the characteristic dodecahedral (12-faced) shape that makes them immediately recognizable.`,
        lore: `Garnet's history as a gemstone spans more than 5,000 years. Ancient Egyptians used garnets as inlays in gold jewelry, and pharaohs were buried with garnet necklaces as symbols of light to guide them in the afterlife. Ancient Romans engraved garnet signet rings to stamp wax seals on important documents. In Norse mythology, the god Odin wore a garnet to provide him with vitality and strength in battle. Travelers in the Middle Ages carried garnets as protection against accident and attack during long journeys. The Bohemian garnet jewelry tradition, using pyrope garnets from what is now the Czech Republic, has flourished for hundreds of years. Garnet is the traditional birthstone for January.`,
      },
    }),
    prisma.gemstone.create({
      data: {
        slug: 'opal',
        name: 'Opal',
        category: 'Semi-precious',
        color: 'Iridescent',
        hardness: 6.0,
        origin: 'Australia',
        visualKey: 'opal',
        description: `Opal is one of the most extraordinary and visually complex gemstones in existence, celebrated for its unique optical phenomenon called "play of color" — a dazzling display of spectral hues that shift and dance as the stone is moved. This effect results from the diffraction of light by a regular internal structure of submicroscopic silica spheres arranged in a three-dimensional grid pattern. Australia produces approximately 95% of the world's precious opals, primarily from the arid outback regions of South Australia, Queensland, and New South Wales. Opals contain between 5% and 21% water, which means they can crack if dehydrated too quickly. Black opal, found almost exclusively at Lightning Ridge in New South Wales, is considered the most valuable variety.`,
        lore: `Opal holds a unique and sometimes contradictory place in gemstone folklore. Ancient Romans regarded opal as the most precious and powerful of all gemstones, calling it "opalus" and believing it combined the beauty of all gems. The ancient Arab world believed opals fell from the sky during lightning storms, carrying flashes of lightning within them. However, a superstition arose in 19th-century Europe, partly fueled by Sir Walter Scott's 1829 novel "Anne of Geierstein," that opals brought bad luck to anyone who was not born in October. This belief severely damaged opal sales until diamond merchants reportedly spread the superstition to boost diamond sales. Aboriginal Australians regard opals as sacred gifts from the creation spirits.`,
      },
    }),
    prisma.gemstone.create({
      data: {
        slug: 'tourmaline',
        name: 'Tourmaline',
        category: 'Semi-precious',
        color: 'Multi-color',
        hardness: 7.5,
        origin: 'Afghanistan',
        visualKey: 'tourmaline',
        description: `Tourmaline is one of the most chemically complex and color-diverse of all gem minerals, occurring in virtually every hue the imagination can conjure. It is a boron silicate mineral with a complex chemical formula that varies significantly between varieties, and its color range is unmatched in the mineral kingdom. Afghanistan's Kunar and Nuristan provinces have produced some of the world's most spectacular tourmalines, including vibrant pinks, lush greens, and the extraordinary bicolor "watermelon" tourmaline that shows green on the outside and pink in the center. The most valuable variety, Paraíba tourmaline from Brazil, displays a neon blue-green caused by copper impurities and commands extraordinarily high prices. Tourmaline crystals are pyroelectric and piezoelectric, generating an electrical charge when heated or compressed.`,
        lore: `An ancient Egyptian legend tells that tourmaline made its long journey from the earth's center to the sun along a rainbow, absorbing all the colors along the way — which explains its extraordinary chromatic variety. In 16th-century Holland, Dutch traders discovered that tourmaline could attract and repel ash particles by heating it, calling it "aschentrekker" (ash attractor). This electric property made it a curiosity throughout Europe. Chinese Empress Dowager Cixi of the Qing dynasty had such a passion for pink tourmaline that she purchased vast quantities from California's San Diego County mines in the early 20th century. In various healing traditions, tourmaline is believed to promote creativity, inspiration, and the balancing of the chakras. October babies share tourmaline as one of their birthstones.`,
      },
    }),
  ])

  console.log('Gemstones created')

  // Create articles
  const articles = await Promise.all([
    prisma.article.create({
      data: {
        slug: 'geology-of-gemstone-formation',
        title: 'The Geology of Gemstone Formation',
        excerpt: 'Discover how the earth\'s tremendous forces of heat, pressure, and chemistry conspire over millions of years to create the stunning gems we prize today.',
        authorName: 'GemLore Editorial',
        publishedAt: new Date('2025-11-01'),
        content: `Deep within the earth, a process of breathtaking complexity and timescale creates the gemstones that captivate us. Understanding how gems form requires a journey into geology — the science of how our planet works from its molten core to its surface.

Most gemstones form through one of three geological processes: igneous activity, metamorphism, or sedimentary processes, though some require very specific combinations of all three. Each pathway produces distinct types of gems and influences their properties in profound ways.

Igneous formation begins in the mantle, the semi-molten layer beneath the earth's crust. Here, temperatures exceed 1,000°C (1,832°F) and pressures are immense. Diamonds form at depths of 100 to 200 kilometers, where carbon atoms are forced into their unique cubic crystal structure by pressures exceeding 45 kilobars. These diamonds are then carried to the surface in violent volcanic eruptions through pipe-shaped channels of a rock called kimberlite. If you have ever handled a diamond and paused to consider it, you were touching something that formed between one and three billion years ago — older than most life on Earth.

Pegmatites are another igneous formation environment, responsible for a remarkable diversity of gemstones including tourmaline, topaz, aquamarine, and many others. These coarse-grained rocks form from the final stages of magma cooling, when water and other volatile compounds concentrate and allow atoms to migrate over distances, creating large, well-formed crystals. The extraordinary size of some pegmatite crystals — tourmalines the length of a human arm are not uncommon — results from these unusually favorable growth conditions.

Metamorphic processes transform existing rocks through heat and pressure without melting them. Rubies and sapphires form this way when aluminum-rich rocks are subjected to intense heat and pressure during mountain-building events. The aluminum oxide recrystallizes into corundum — pure sapphire or ruby depending on trace element impurities. The famous ruby deposits of Myanmar formed approximately 450 million years ago when proto-Asian continental plates collided, generating the heat and pressure needed to crystallize rubies in marble. Sri Lanka's sapphires formed similarly in high-grade metamorphic rocks.

Emeralds have a particularly complex origin requiring the rare meeting of two distinct geological environments. The beryllium needed for the beryl crystal structure typically comes from granitic magmas, while the chromium and vanadium that give emeralds their green color come from ancient oceanic crust called ophiolite. These two normally separate worlds only meet in very specific tectonic settings, which is why fine emerald deposits are extraordinarily rare compared to other precious gems.

Sedimentary processes create gems through the accumulation and compression of materials. Opal forms when silica-rich groundwater percolates through sedimentary rocks, depositing microscopic silica spheres in cavities. Given just the right conditions of concentration and slow evaporation, these spheres arrange themselves in orderly arrays that diffract light into spectacular colors. Australia's vast opal fields formed this way around 65 million years ago, during a period when the continent was partially covered by an inland sea.

The journey from geological formation to your hand is often equally dramatic. Erosion breaks rocks apart, concentrating dense, durable gemstones in river gravels called alluvial deposits — the source of many of Sri Lanka's and Thailand's gemstones. Tectonic forces push mountain ranges upward, exposing ancient metamorphic rocks that were once buried kilometers deep. Volcanic eruptions bring diamonds to the surface from depths we could never otherwise reach.

What makes gemstones particularly remarkable is that their formation requires not just any geological process, but a very specific and often improbable combination of chemistry, temperature, pressure, time, and circumstance. For every gem that reaches the surface in gem quality, countless others formed incorrectly, fractured on the journey upward, or still lie undiscovered beneath the earth. The gem in your hand is the survivor of an almost impossibly selective natural process spanning geological time.`,
      },
    }),
    prisma.article.create({
      data: {
        slug: 'mohs-scale-buyers-guide',
        title: "Reading the Mohs Scale: A Buyer's Guide to Hardness",
        excerpt: 'The Mohs scale is the most important number you\'ll encounter when buying gemstones. Here\'s what it means in practice and how to use it to make better purchasing decisions.',
        authorName: 'GemLore Editorial',
        publishedAt: new Date('2025-11-08'),
        content: `When you shop for gemstones, you will inevitably encounter the Mohs Hardness Scale — a number between 1 and 10 assigned to every mineral. Understanding what this number means, and more importantly what it means for how you can wear and care for your gem, is one of the most practical pieces of knowledge you can acquire as a collector or jewelry buyer.

Friedrich Mohs, a German geologist, devised the scale in 1812. His method was elegantly simple: line up ten minerals in order of hardness and assign them numbers. Each mineral can scratch any mineral below it on the scale but cannot scratch those above. The ten reference minerals are: talc (1), gypsum (2), calcite (3), fluorite (4), apatite (5), orthoclase feldspar (6), quartz (7), topaz (8), corundum (9), and diamond (10).

The first thing to understand is that the Mohs scale is ordinal, not linear. The hardness difference between adjacent steps is not equal. Diamond at 10 is not merely one unit harder than corundum at 9 — it is approximately four times harder in absolute terms. The jump from 9 to 10 represents the most dramatic hardness increase in the natural mineral world. This is why diamonds are used industrially to cut and grind virtually everything else.

**What the numbers mean for your gemstone:**

Stones rated 7 and above (quartz hardness) are generally suitable for everyday wear in rings. This is because the most common abrasive that jewelry encounters in daily life is ordinary dust and dirt, which contains significant amounts of quartz. Any stone softer than quartz will gradually lose its polish and eventually become scratched from routine handling. Diamonds, sapphires, and rubies (all 9-10) are exceptionally well-suited to rings because they resist everyday abrasion easily.

Emeralds and aquamarines, both beryl varieties at 7.5, are in the acceptable zone for rings but require more care. The emerald's additional vulnerability comes not from softness but from its characteristically high inclusion level, which can make the stone brittle. A clean blow can chip an emerald even though its surface resists scratching well.

Stones in the 6 to 7 range — including tanzanite (6.5-7), opal (5.5-6.5), and moonstone (6-6.5) — are best suited for earrings, pendants, and brooches where they are less exposed to impact and abrasion. If worn in rings, they should be in protective settings (bezel settings are better than prong settings for these stones) and removed during physical activities.

Anything below 6 should generally be considered collector's material rather than everyday jewelry. Calcite, at 3, will lose its polish simply from being stored with other harder stones. These materials are beautiful but fragile.

**Practical tips for buyers:**

When evaluating a piece for purchase, consider the ring position. An engagement ring worn daily on the dominant hand faces far more abrasion than a pendant worn occasionally. A sapphire is an excellent choice for an engagement ring; a pearl is not, as it rates between 2.5 and 4.5 and will scratch and dull with regular wear.

Check the setting design. For softer stones, bezel settings that wrap metal around the stone's edge offer far better protection than prong settings that leave the sides exposed. Channel settings for small stones also offer excellent protection.

Consider how you will store your jewelry. A collection stored loose in a jewelry box is a recipe for damage — harder stones will scratch softer ones. Each piece should be stored separately in a pouch or compartment. Many collectors keep their softer stones in padded individual boxes.

Remember that hardness is only one dimension of durability. Toughness (resistance to breaking) and stability (resistance to heat, light, and chemicals) are equally important. Jade, for example, has only moderate hardness (6-7) but exceptional toughness due to its interlocking crystalline structure — it will not shatter. Diamond is supremely hard but has perfect cleavage and can split with a well-directed blow.

The Mohs scale is a starting point for understanding your gem, not the complete picture. Use it as one factor among several when making purchasing and wearing decisions.`,
      },
    }),
    prisma.article.create({
      data: {
        slug: 'birthstones-through-history',
        title: 'Birthstones Through History',
        excerpt: 'The tradition of wearing birthstones is older than you might think, with roots stretching back through biblical history, medieval Europe, and across diverse world cultures.',
        authorName: 'GemLore Editorial',
        publishedAt: new Date('2025-11-15'),
        content: `The practice of wearing a gemstone associated with one's birth month is so widespread today that it can seem like a modern commercial invention. In fact, birthstones have a history stretching back thousands of years, with roots embedded in biblical scripture, astrological tradition, and the gem lore of cultures spanning from India to ancient Israel.

The story traditionally begins with the Breastplate of Aaron, described in the Book of Exodus. This sacred ceremonial garment worn by the High Priest of the Israelites was set with twelve gemstones arranged in four rows, each bearing the name of one of the twelve tribes of Israel. The stones mentioned are carnelian, chrysolite, emerald, turquoise, sapphire, diamond (likely rock crystal in the original), jacinth, agate, amethyst, topaz, onyx, and jasper. The precise identification of each stone with its Hebrew and Greek names has been a subject of scholarly debate for centuries, but the essential concept — twelve sacred stones, each associated with a tribe — became the template for all subsequent birthstone traditions.

The connection between these twelve stones and the twelve months of the year, and later the twelve signs of the zodiac, developed gradually. The first century CE historian Josephus drew explicit parallels between the breastplate stones, the twelve months, and the signs of the zodiac. The scholar St. Jerome made similar connections in the fourth century. However, the idea that a person should own all twelve stones and wear each one during its corresponding month — rotating them for maximum benefit — was a distinctly medieval concept.

Medieval European gem lore assigned specific virtues and planetary correspondences to each stone. Astrological thinking held that gems were concentrations of planetary energies, and wearing the appropriate stone during its associated period enhanced its beneficial qualities. These were talismanic uses rather than the purely decorative tradition we know today.

The first formal list connecting specific birth months to specific gemstones for individual wearers appeared in Poland in the 18th century, likely among Jewish gem traders. The custom of wearing only one's own birth month stone, rather than rotating through all twelve, seems to have crystallized during this period. German and English gem traders promoted the practice throughout the 18th century, and it spread rapidly through European aristocratic circles.

The modern standardization of birthstones was established in 1912 by the American National Retail Jewelers Association (now Jewelers of America), which created a standardized list partly to resolve inconsistencies in the tradition and partly to promote gem sales. This list has been updated several times since — tanzanite was added as a December stone in 2002, and spinel was added for August in 2016.

Different cultures maintain different birthstone traditions. The Hindu tradition uses gems associated with the nine planets (navaratna) rather than birth months. Indian astrology assigns specific gemstones based on the position of planets at birth, and these recommendations are taken seriously by many families even today — a Jyotishi (astrologer) may prescribe wearing a specific gem set in a specific metal for health, prosperity, or protection.

The Japanese, Korean, and Chinese traditions developed their own gem associations, often centered on jade, pearl, and coral, which were the most culturally significant gems in East Asia. The rarity and prestige of particular stones varied considerably between cultures — while diamonds dominated European gem culture, jade held an even more exalted position in Chinese civilization, representing virtue, immortality, and imperial power.

What is striking about the global birthstone tradition is how universally humans have felt the need to connect the progression of time with the beauty of gems. Whether one attributes this to practical trade motives, astrological belief, or a simple human desire to mark life's passages with beautiful objects, the tradition has proven remarkably enduring. Today, birthstone jewelry is given at births, birthdays, graduations, and christenings worldwide — a living continuation of a tradition that spans three millennia.`,
      },
    }),
    prisma.article.create({
      data: {
        slug: 'caring-for-your-gemstone-collection',
        title: 'Caring for Your Gemstone Collection',
        excerpt: 'A gemstone collection is a long-term investment of both money and passion. These practical techniques will help you maintain your gems in perfect condition for generations.',
        authorName: 'GemLore Editorial',
        publishedAt: new Date('2025-11-22'),
        content: `Gemstones are among the most durable materials in the natural world, yet the jewelry settings that hold them, the oils from our skin, and the everyday chemicals we expose them to can dull their brilliance over time. Proper care is not complicated — it requires only knowledge and consistency. Whether your collection consists of a single cherished ring or dozens of specimens, these principles will help you preserve its beauty indefinitely.

**Cleaning your gemstones:**

The safest method for cleaning almost any gemstone set in jewelry is warm water, a drop of mild dish soap, and a soft toothbrush. Dip the piece, gently work the brush into all the crevices of the setting where oil and dirt accumulate, rinse thoroughly with clean water, and dry with a soft lint-free cloth. This method is effective and safe for diamonds, sapphires, rubies, and most other hard gemstones.

However, there are important exceptions. Opals, pearls, and coral must never be soaked in water — they are porous or organic materials that can absorb water and deteriorate. Wipe these with only a barely damp cloth. Emeralds are typically treated with oils or resins to fill surface fractures (a centuries-old practice called "jardin filling"), and soaking them in water or using ultrasonic cleaners can remove these treatments, dramatically altering the stone's appearance.

Ultrasonic cleaners — devices that clean with high-frequency sound waves — are extremely effective for hard, durable gemstones with no fractures. Diamonds, sapphires, and rubies generally respond well to ultrasonic cleaning. However, avoid using them for emeralds, opals, tanzanite, pearls, any stone with significant inclusions, or any stone you are uncertain about. The vibrations can propagate fractures or dislodge stones from their settings.

Steam cleaners are similarly effective for durable gems but should be used with the same cautions as ultrasonics. The thermal shock of steam can crack some stones, and it will certainly remove oil treatments from emeralds.

**Storage:**

How you store your collection may matter more than how you clean it. The cardinal rule is: do not store gemstone jewelry in contact with other pieces. Diamonds will scratch emeralds, rubies will scratch aquamarines, and virtually everything will scratch pearls. Each piece should be stored separately.

Individual pouches made of soft, non-abrasive fabric (velvet, satin, or microfiber) are excellent for most jewelry. Compartmentalized jewelry boxes with individual padded sections work well. For loose gemstone specimens or particularly valuable pieces, small ziplock bags wrapped in tissue paper are both cheap and effective.

Sunlight and heat are underappreciated threats to some gemstones. Amethyst and rose quartz can fade with prolonged exposure to direct sunlight. Opals should be kept from extreme heat changes, which can cause cracking due to their water content. Store your collection away from direct sunlight and extreme temperature fluctuations.

Humidity is another consideration, particularly for organic gems. Pearls actually benefit from some ambient humidity — extremely dry conditions can cause them to crack. Opals also prefer moderate humidity. Keep your collection in a space that maintains relatively stable temperature and humidity year-round.

**Wearing your gems:**

The best times to remove your jewelry are during activities that expose it to physical impact, abrasive materials, or harsh chemicals. Gardening, cleaning with household chemicals, exercise, and cooking are all situations where removing your jewelry is sensible. Chlorine bleach is particularly damaging to gold alloys, causing them to become brittle and crack over time — always remove gold jewelry before swimming in chlorinated pools.

Apply perfume, hairspray, lotions, and sunscreens before putting on jewelry, not after. These products contain chemicals that can dull the surfaces of some gems and damage the finish of metal settings. Build the habit of jewelry being the last thing you put on and the first thing you take off.

Have your jewelry settings professionally checked once a year if you wear pieces regularly. Prongs and claw settings can bend and loosen with wear, and the cost of having a prong retipped is trivial compared to losing a stone. A good jeweler can also professionally clean and polish your pieces to restore their original brilliance.

With consistent care, quality gemstones will outlast their owners and become the heirlooms they deserve to be.`,
      },
    }),
    prisma.article.create({
      data: {
        slug: 'mythology-and-folklore-of-precious-stones',
        title: 'Mythology and Folklore of Precious Stones',
        excerpt: 'From the tears of gods to the eyes of dragon statues, precious stones have gathered extraordinary legends across every culture. Here are some of the most fascinating.',
        authorName: 'GemLore Editorial',
        publishedAt: new Date('2025-11-29'),
        content: `Long before gemologists and mineralogists gave us scientific accounts of how gems form, human beings developed a rich and often wildly imaginative body of lore to explain these beautiful, rare, and durable objects from the earth. Gemstone mythology reflects the values, fears, and aspirations of the cultures that created it — and exploring these legends is a journey through the human imagination as much as through natural history.

**The origins of diamonds:**

The ancient Greeks believed diamonds were tears wept by the gods, or fragments of stars that had fallen to earth. They called the stone "adamas," meaning invincible or untameable, which gave us both the English word "diamond" and the scientific term for the allotrope of carbon. The Greeks believed diamonds strengthened the bonds of marriage, which likely contributed to their eventual adoption in engagement rings.

Hindu mythology offered a more dramatic origin story: diamonds were created when bolts of lightning struck rocks, leaving behind crystallized thunderbolts. The Hindu term "vajra" means both thunderbolt and diamond, reflecting this belief. Ancient Indian rulers placed diamonds in the eyes of religious statues, believing the hardest material on earth was a worthy vessel for divine sight.

**Ruby and the fire within:**

Burmese legend held that rubies were not merely found in the earth but were grown there like seeds. Miners who found a raw ruby nurtured the surrounding ground, believing that more rubies would grow nearby if the conditions were right. More dramatically, Burmese warriors of ancient times believed rubies could render them invincible in battle — but only if the stone was inserted beneath the skin, making it literally part of the warrior's body.

In the Islamic world, rubies were believed to be a cure against poison, plagues, and all manner of disease. The reasoning was sympathetic magic: the red fire within the stone could drive out the cold darkness of illness. Medieval European physicians incorporated rubies into elaborate medicinal preparations, prescribing powdered ruby dissolved in wine for everything from fever to grief.

**Emerald and the serpents:**

One of the stranger recurring motifs in emerald mythology is the connection to serpents and dragons. Pliny the Elder, the Roman naturalist, wrote that emeralds were so soothing to the eyes that lapidaries (gem cutters) rested their vision by gazing at emerald stones after the fine detail work of cutting other gems. This optical legend grew into claims that emeralds could cure diseases of the eye.

But snakes appear repeatedly in emerald lore across cultures. In some European traditions, emeralds were believed to be found in the nests of griffins and were guarded by serpents. When you looked a serpent in the eye while holding an emerald, the stone was believed to destroy the reptile's sight. The Grail legends of medieval Europe sometimes describe the Holy Grail not as a cup but as an emerald — a green stone fallen from heaven.

**Pearl and the moon:**

Across Asian and Western traditions independently, pearl was associated with the moon. The resemblance is obvious: round, luminescent, pale, and found in the sea (as the moon governs the tides). In Hindu mythology, the pearl was the gem of the moon goddess Chandra, formed in the shell of an oyster that surfaced at night to collect the moonlight it contained.

In Persian mythology, pearls were the tears of the gods. In Chinese mythology, they were produced by sea dragons and were carried between their teeth — a cultural connection so strong that Chinese architectural decoration still often features pearls alongside dragons. Japanese divers who harvested pearls followed strict ritual protocols, believing the pearls were alive and sensitive to human emotion.

**Opal and its dual reputation:**

Few gemstones have been subject to as wildly contradictory a reputation as opal. In antiquity, it was universally beloved. Pliny called it the most precious of all gems, comparing its display of color to the best qualities of all other stones combined. Mark Antony was said to have exiled a Roman senator for refusing to sell him an opal the size of a hazelnut intended as a gift for Cleopatra.

The fatal shift in opal's reputation came with the publication of Sir Walter Scott's novel "Anne of Geierstein" in 1829, in which a character who wears an opal suffers terrible consequences. The novel was enormously popular, and opal sales in Europe plummeted by half within a year. This single work of fiction managed to overturn two thousand years of positive reputation. The damage was long-lasting — even today, some people believe opal brings bad luck to non-October-born wearers, an entirely modern superstition.

**The living gemstone tradition:**

What these stories share is a common impulse: the need to explain extraordinary beauty with extraordinary origins. In a world before spectroscopy and crystallography, it made sense that something as remarkable as a diamond must come from somewhere remarkable — the tears of gods, the heart of lightning. The myths also reveal practical wisdom encoded in memorable form: the ruby against plague, the emerald against eye disease, the pearl against the moon's influence. Some of these connections are fanciful; others reflect genuine observation and experience.

The tradition is not extinct. Crystal healing, birthstone traditions, and astrological gem recommendations remain active today, updating ancient impulses in contemporary forms. The human relationship with gemstones has always been as much imaginative and emotional as material — and these myths are the most eloquent expression of that relationship.`,
      },
    }),
  ])

  console.log('Articles created')

  // Create comments
  await prisma.comment.createMany({
    data: [
      {
        content: 'The description of the Mogok Valley rubies is spot on. I visited Myanmar last year and the quality of stones coming out of there is absolutely breathtaking.',
        userId: regularUser.id,
        gemstoneId: gemstones[0].id,
      },
      {
        content: 'The lore section really captures why rubies have been so valued throughout history. The Burmese warrior tradition of embedding them in skin is fascinating and a little terrifying.',
        userId: demoUser.id,
        gemstoneId: gemstones[0].id,
      },
      {
        content: 'I have a Ceylon sapphire in my engagement ring and the "cornflower blue" description here is perfect. Mine has exactly that velvety quality.',
        userId: demoUser.id,
        gemstoneId: gemstones[1].id,
      },
      {
        content: 'The "jardin" concept for emeralds is something I wish I had known before purchasing. I initially thought my stone was flawed — turns out those inclusions are part of what makes it authentic.',
        userId: regularUser.id,
        gemstoneId: gemstones[2].id,
      },
      {
        content: 'The detail about opal containing water is something most people don\'t know. I learned the hard way when I left a ring in a very dry room and it developed a crack.',
        userId: regularUser.id,
        gemstoneId: gemstones[8].id,
      },
      {
        content: 'This article completely changed my understanding of gem formation. I had no idea diamonds form 100 miles underground and are brought up by volcanic activity.',
        userId: demoUser.id,
        articleId: articles[0].id,
      },
      {
        content: 'The point about the Mohs scale being ordinal rather than linear is something every gem buyer needs to understand. A rating of 9 does NOT mean just one unit harder than 8.',
        userId: regularUser.id,
        articleId: articles[1].id,
      },
      {
        content: 'Fascinating article on birthstones. I had no idea the tradition had such deep roots in the High Priest\'s breastplate from Exodus.',
        userId: demoUser.id,
        articleId: articles[2].id,
      },
      {
        content: 'The care guide saved one of my opals — I had been keeping it in a very dry environment. Moved it and the surface has recovered significantly.',
        userId: regularUser.id,
        articleId: articles[3].id,
      },
      {
        content: 'The detail about Sir Walter Scott\'s novel destroying opal\'s reputation is remarkable. A single piece of fiction changed market prices for decades.',
        userId: demoUser.id,
        articleId: articles[4].id,
      },
    ],
  })

  console.log('Comments created')

  // Create favorites
  await prisma.favorite.createMany({
    data: [
      { userId: regularUser.id, gemstoneId: gemstones[0].id },
      { userId: regularUser.id, gemstoneId: gemstones[2].id },
      { userId: regularUser.id, gemstoneId: gemstones[8].id },
    ],
  })

  console.log('Favorites created')
  console.log('✅ Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
