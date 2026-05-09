interface GemstoneVisualProps {
  visualKey: string
  size?: number
  className?: string
}

const gemVariants: Record<string, {
  mainColor: string
  lightColor: string
  darkColor: string
  shape: React.ReactNode
}> = {
  ruby: {
    mainColor: '#e0115f',
    lightColor: '#ff6b9d',
    darkColor: '#8b0036',
    shape: (
      <g>
        <polygon points="100,10 180,60 160,140 40,140 20,60" fill="url(#rubyGrad)" />
        <polygon points="100,10 180,60 100,50" fill="rgba(255,255,255,0.2)" />
        <polygon points="100,10 20,60 100,50" fill="rgba(255,255,255,0.1)" />
        <polygon points="100,50 180,60 160,140" fill="rgba(0,0,0,0.15)" />
        <polygon points="100,50 20,60 40,140" fill="rgba(0,0,0,0.1)" />
        <polygon points="40,140 100,50 160,140" fill="rgba(0,0,0,0.2)" />
        <line x1="100" y1="10" x2="100" y2="50" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" />
        <line x1="20" y1="60" x2="180" y2="60" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
      </g>
    ),
  },
  sapphire: {
    mainColor: '#0f52ba',
    lightColor: '#4d94ff',
    darkColor: '#062b6e',
    shape: (
      <g>
        <polygon points="100,5 165,35 190,100 165,165 100,195 35,165 10,100 35,35" fill="url(#sapphireGrad)" />
        <polygon points="100,5 165,35 100,60" fill="rgba(255,255,255,0.2)" />
        <polygon points="100,5 35,35 100,60" fill="rgba(255,255,255,0.12)" />
        <polygon points="165,35 190,100 100,60" fill="rgba(0,0,0,0.1)" />
        <polygon points="35,35 10,100 100,60" fill="rgba(0,0,0,0.05)" />
        <polygon points="100,60 190,100 165,165 100,140" fill="rgba(0,0,0,0.15)" />
        <polygon points="100,60 10,100 35,165 100,140" fill="rgba(0,0,0,0.1)" />
        <polygon points="100,140 165,165 100,195 35,165" fill="rgba(0,0,0,0.2)" />
      </g>
    ),
  },
  emerald: {
    mainColor: '#218451',
    lightColor: '#50c878',
    darkColor: '#0d3d25',
    shape: (
      <g>
        <polygon points="60,10 140,10 190,60 190,140 140,190 60,190 10,140 10,60" fill="url(#emeraldGrad)" />
        <polygon points="60,10 140,10 120,45 80,45" fill="rgba(255,255,255,0.2)" />
        <polygon points="10,60 60,10 80,45 45,80" fill="rgba(255,255,255,0.1)" />
        <polygon points="140,10 190,60 155,80 120,45" fill="rgba(255,255,255,0.08)" />
        <polygon points="80,45 120,45 155,80 45,80" fill="rgba(255,255,255,0.12)" />
        <polygon points="10,140 45,80 80,155 60,190" fill="rgba(0,0,0,0.12)" />
        <polygon points="190,140 140,190 120,155 155,80" fill="rgba(0,0,0,0.15)" />
        <polygon points="80,155 120,155 140,190 60,190" fill="rgba(0,0,0,0.2)" />
        <polygon points="45,80 155,80 120,155 80,155" fill="rgba(0,0,0,0.08)" />
      </g>
    ),
  },
  diamond: {
    mainColor: '#b8d4e8',
    lightColor: '#e8f4ff',
    darkColor: '#6a9ab8',
    shape: (
      <g>
        <polygon points="100,5 185,65 185,135 100,195 15,135 15,65" fill="url(#diamondGrad)" />
        <polygon points="100,5 185,65 100,55" fill="rgba(255,255,255,0.45)" />
        <polygon points="100,5 15,65 100,55" fill="rgba(255,255,255,0.3)" />
        <polygon points="100,55 185,65 185,135 100,110" fill="rgba(255,255,255,0.15)" />
        <polygon points="100,55 15,65 15,135 100,110" fill="rgba(255,255,255,0.2)" />
        <polygon points="100,110 185,135 100,195" fill="rgba(100,180,255,0.3)" />
        <polygon points="100,110 15,135 100,195" fill="rgba(100,180,255,0.2)" />
        <line x1="100" y1="5" x2="100" y2="55" stroke="rgba(255,255,255,0.5)" strokeWidth="1" />
        <line x1="15" y1="65" x2="185" y2="65" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" />
        <line x1="15" y1="135" x2="185" y2="135" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
      </g>
    ),
  },
  amethyst: {
    mainColor: '#9966cc',
    lightColor: '#c8a0f0',
    darkColor: '#4a2070',
    shape: (
      <g>
        <polygon points="100,5 175,50 200,130 150,195 50,195 0,130 25,50" fill="url(#amethystGrad)" />
        <polygon points="100,5 175,50 100,60" fill="rgba(255,255,255,0.2)" />
        <polygon points="100,5 25,50 100,60" fill="rgba(255,255,255,0.12)" />
        <polygon points="175,50 200,130 100,60" fill="rgba(0,0,0,0.1)" />
        <polygon points="25,50 0,130 100,60" fill="rgba(255,255,255,0.08)" />
        <polygon points="100,60 200,130 150,195 100,140" fill="rgba(0,0,0,0.15)" />
        <polygon points="100,60 0,130 50,195 100,140" fill="rgba(0,0,0,0.1)" />
        <polygon points="100,140 150,195 50,195" fill="rgba(0,0,0,0.2)" />
      </g>
    ),
  },
  topaz: {
    mainColor: '#c8860a',
    lightColor: '#ffc87c',
    darkColor: '#7a4d00',
    shape: (
      <g>
        <ellipse cx="100" cy="100" rx="90" ry="75" fill="url(#topazGrad)" />
        <ellipse cx="100" cy="100" rx="90" ry="75" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
        <polygon points="100,25 175,70 175,130 100,175 25,130 25,70" fill="url(#topazInner)" opacity="0.6" />
        <polygon points="100,25 175,70 100,65" fill="rgba(255,255,255,0.25)" />
        <polygon points="100,25 25,70 100,65" fill="rgba(255,255,255,0.15)" />
        <polygon points="100,65 175,70 175,130 100,110" fill="rgba(0,0,0,0.1)" />
        <polygon points="100,65 25,70 25,130 100,110" fill="rgba(255,255,255,0.1)" />
        <polygon points="100,110 175,130 100,175 25,130" fill="rgba(0,0,0,0.2)" />
      </g>
    ),
  },
  aquamarine: {
    mainColor: '#4fb0c6',
    lightColor: '#9de0f0',
    darkColor: '#1a6b80',
    shape: (
      <g>
        <ellipse cx="100" cy="100" rx="85" ry="95" fill="url(#aquamarineGrad)" />
        <polygon points="100,10 170,45 185,100 170,155 100,190 30,155 15,100 30,45" fill="url(#aquaInner)" opacity="0.7" />
        <polygon points="100,10 170,45 100,55 30,45" fill="rgba(255,255,255,0.2)" />
        <polygon points="30,45 100,55 15,100" fill="rgba(255,255,255,0.12)" />
        <polygon points="170,45 185,100 100,55" fill="rgba(0,0,0,0.08)" />
        <polygon points="100,55 185,100 170,155 100,130 15,100" fill="rgba(0,0,0,0.1)" />
        <polygon points="100,130 170,155 100,190 30,155" fill="rgba(0,0,0,0.18)" />
      </g>
    ),
  },
  garnet: {
    mainColor: '#6b1a2e',
    lightColor: '#c0395a',
    darkColor: '#3d0012',
    shape: (
      <g>
        <polygon points="100,5 160,30 190,90 180,160 120,195 80,195 20,160 10,90 40,30" fill="url(#garnetGrad)" />
        <polygon points="100,5 160,30 100,50" fill="rgba(255,255,255,0.18)" />
        <polygon points="100,5 40,30 100,50" fill="rgba(255,255,255,0.1)" />
        <polygon points="160,30 190,90 100,50" fill="rgba(0,0,0,0.12)" />
        <polygon points="40,30 10,90 100,50" fill="rgba(255,255,255,0.08)" />
        <polygon points="100,50 190,90 180,160 120,195 100,120" fill="rgba(0,0,0,0.15)" />
        <polygon points="100,50 10,90 20,160 80,195 100,120" fill="rgba(0,0,0,0.1)" />
        <polygon points="100,120 120,195 80,195" fill="rgba(0,0,0,0.25)" />
      </g>
    ),
  },
  opal: {
    mainColor: '#b0c8e8',
    lightColor: '#ffffff',
    darkColor: '#6080a0',
    shape: (
      <g>
        <ellipse cx="100" cy="100" rx="90" ry="80" fill="url(#opalBase)" />
        <ellipse cx="100" cy="100" rx="70" ry="60" fill="url(#opalShimmer)" opacity="0.6" />
        <ellipse cx="80" cy="75" rx="25" ry="20" fill="rgba(80,200,120,0.3)" />
        <ellipse cx="120" cy="90" rx="20" ry="15" fill="rgba(100,150,255,0.3)" />
        <ellipse cx="100" cy="115" rx="22" ry="18" fill="rgba(255,100,150,0.25)" />
        <ellipse cx="70" cy="110" rx="15" ry="12" fill="rgba(255,200,50,0.3)" />
        <ellipse cx="130" cy="118" rx="18" ry="14" fill="rgba(150,50,255,0.25)" />
        <ellipse cx="100" cy="100" rx="90" ry="80" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
        <ellipse cx="100" cy="100" rx="90" ry="80" fill="url(#opalGloss)" />
      </g>
    ),
  },
  tourmaline: {
    mainColor: '#2a8a4a',
    lightColor: '#ff80aa',
    darkColor: '#0d4020',
    shape: (
      <g>
        <rect x="40" y="15" width="120" height="170" rx="8" fill="url(#tourmalineGrad)" />
        <rect x="40" y="15" width="120" height="85" rx="8" fill="rgba(255,100,160,0.4)" />
        <polygon points="40,100 160,100 155,15 45,15" fill="rgba(255,150,180,0.15)" />
        <line x1="100" y1="15" x2="100" y2="185" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
        <line x1="40" y1="70" x2="160" y2="70" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
        <line x1="40" y1="100" x2="160" y2="100" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
        <line x1="40" y1="130" x2="160" y2="130" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
        <rect x="40" y="15" width="120" height="170" rx="8" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
        <polygon points="40,15 100,30 45,15" fill="rgba(255,255,255,0.2)" />
      </g>
    ),
  },
}

export default function GemstoneVisual({ visualKey, size = 200, className = '' }: GemstoneVisualProps) {
  const variant = gemVariants[visualKey] || gemVariants.diamond
  const gradId = `${visualKey}Grad`
  const innerGradId = `${visualKey}Inner`

  return (
    <div
      className={`relative inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-2xl gem-shine"
        aria-label={`${visualKey} gemstone illustration`}
      >
        <defs>
          <radialGradient id={gradId} cx="35%" cy="30%" r="70%">
            <stop offset="0%" stopColor={variant.lightColor} />
            <stop offset="50%" stopColor={variant.mainColor} />
            <stop offset="100%" stopColor={variant.darkColor} />
          </radialGradient>

          <radialGradient id={innerGradId} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={variant.lightColor} stopOpacity="0.3" />
            <stop offset="100%" stopColor={variant.darkColor} stopOpacity="0" />
          </radialGradient>

          {visualKey === 'opal' && (
            <>
              <radialGradient id="opalBase" cx="40%" cy="35%" r="65%">
                <stop offset="0%" stopColor="#e8f4ff" />
                <stop offset="40%" stopColor="#b0c8e8" />
                <stop offset="100%" stopColor="#6080a0" />
              </radialGradient>
              <radialGradient id="opalShimmer" cx="60%" cy="60%" r="50%">
                <stop offset="0%" stopColor="#ff90c0" stopOpacity="0.5" />
                <stop offset="30%" stopColor="#90d0ff" stopOpacity="0.4" />
                <stop offset="60%" stopColor="#90ff90" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#ffe080" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="opalGloss" cx="30%" cy="25%" r="40%">
                <stop offset="0%" stopColor="white" stopOpacity="0.4" />
                <stop offset="100%" stopColor="white" stopOpacity="0" />
              </radialGradient>
            </>
          )}
          {visualKey === 'tourmaline' && (
            <linearGradient id="tourmalineGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ff80aa" />
              <stop offset="45%" stopColor="#ff6090" />
              <stop offset="50%" stopColor="#218851" />
              <stop offset="100%" stopColor="#0d5530" />
            </linearGradient>
          )}
          {visualKey === 'topaz' && (
            <radialGradient id="topazInner" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffe090" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#7a4d00" stopOpacity="0" />
            </radialGradient>
          )}
          {(visualKey === 'aquamarine') && (
            <radialGradient id="aquaInner" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#9de0f0" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#1a6b80" stopOpacity="0" />
            </radialGradient>
          )}
        </defs>

        {variant.shape}

        {/* Highlight glare */}
        <ellipse cx="75" cy="60" rx="18" ry="12" fill="rgba(255,255,255,0.15)" transform="rotate(-20, 75, 60)" className="gem-shine" />
        <ellipse cx="65" cy="52" rx="8" ry="5" fill="rgba(255,255,255,0.25)" transform="rotate(-20, 65, 52)" />
      </svg>
    </div>
  )
}
