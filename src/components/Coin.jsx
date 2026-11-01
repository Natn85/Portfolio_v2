import { lazy, Suspense } from 'react'
import './Coin.css'

function CoinFallback() {
  return (
    <span className="coin">
      <img className="coin__fallback" src="/favicon.svg" alt="" />
    </span>
  )
}

// three.js is only pulled in here, as its own chunk. If the chunk can't load, keep the favicon.
const CoinLogo = lazy(() =>
  import('./CoinLogo.jsx').catch(() => ({ default: CoinFallback })),
)

// The 3D coin, sized by its parent. Shows /favicon.svg until three.js is ready.
export default function Coin() {
  return (
    <Suspense fallback={<CoinFallback />}>
      <CoinLogo />
    </Suspense>
  )
}
