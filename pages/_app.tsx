// pages/_app.tsx
import 'katex/dist/katex.min.css'
// 使用适合暗黑模式的代码高亮主题
import 'prismjs/themes/prism-okaidia.css'
import 'react-notion-x/src/styles.css'
import 'styles/global.css'
import 'styles/notion.css'
import 'styles/prism-theme.css'

import type { AppProps } from 'next/app'
import * as Fathom from 'fathom-client'
import { useRouter } from 'next/router'
import { posthog } from 'posthog-js'
import * as React from 'react'
// 引入 next-themes
import { ThemeProvider } from 'next-themes'

import { bootstrap } from '@/lib/bootstrap-client'
import {
  fathomConfig,
  fathomId,
  isServer,
  posthogConfig,
  posthogId
} from '@/lib/config'

if (!isServer) {
  bootstrap()
}

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter()

  React.useEffect(() => {
    function onRouteChangeComplete() {
      if (fathomId) { Fathom.trackPageview() }
      if (posthogId) { posthog.capture('$pageview') }
    }

    if (fathomId) { Fathom.load(fathomId, fathomConfig) }
    if (posthogId) { posthog.init(posthogId, posthogConfig) }

    router.events.on('routeChangeComplete', onRouteChangeComplete)
    return () => {
      router.events.off('routeChangeComplete', onRouteChangeComplete)
    }
  }, [router.events])

  return (
    // 强制默认暗黑模式
    <ThemeProvider attribute='class' defaultTheme='dark' enableSystem={false} value={{ dark: 'dark-mode', light: 'light-mode' }}>
      <Component {...pageProps} />
    </ThemeProvider>
  )
}
