'use client'

function RollingDigit({ digit }: { digit: number }) {
  return (
    <span className="relative inline-block overflow-hidden">
      <span
        className="block transition-transform duration-500 ease-out"
        style={{ transform: `translateY(-${digit * 10}%)` }}
      >
        {Array.from({ length: 10 }, (_, i) => (
          <span key={i} className="block">
            {i}
          </span>
        ))}
      </span>
      <span className="absolute inset-0 flex items-center justify-center opacity-0">
        {digit}
      </span>
    </span>
  )
}

export function RollingNumber({ value }: { value: number }) {
  const str = value.toString().replace('.', '')
  const parts = str.split('')

  return (
    <span className="inline-flex items-baseline">
      {parts.map((part, index) => {
        if (part === '.') {
          return <span key={index} className="mx-0.5">.</span>
        }
        return (
          <RollingDigit key={index} digit={parseInt(part, 10)} />
        )
      })}
    </span>
  )
}
