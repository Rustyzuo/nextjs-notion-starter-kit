// pages/_app.tsx

// 1. 先引入第三方包 (按字母顺序)
import * as Fathom from 'fathom-client'
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import { ThemeProvider } from 'next-themes'
import { posthog } from 'posthog-js'
import * as React from 'react'

// 2. 再引入本地模块
import { bootstrap } from '@/lib/bootstrap-client'
import {
  fathomConfig,
  fathomId,
  isServer,
  posthogConfig,
  posthogId
} from '@/lib/config'

// 3. 最后引入样式文件 (按字母顺序)
import 'katex/dist/katex.min.css'
// 注意：在这里我也开启了暗黑代码主题
import 'prismjs/themes/prism-okaidia.css'
import 'react-notion-x/src/styles.css'
import 'styles/global.css'
import 'styles/notion.css'
import 'styles/prism-theme.css'

if (!isServer) {
  bootstrap()
}

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter()

  React.useEffect(() => {
    function onRouteChangeComplete() {
      if (fathomId) {
        Fathom.trackPageview()
      }

      if (posthogId) {
        posthog.capture('$pageview')
      }
    }

    if (fathomId) {
      Fathom.load(fathomId, fathomConfig)
    }

    if (posthogId) {
      posthog.init(posthogId, posthogConfig)
    }

    router.events.on('routeChangeComplete', onRouteChangeComplete)

    return () => {
      router.events.off('routeChangeComplete', onRouteChangeComplete)
    }
  }, [router.events])

  return (
    <ThemeProvider attribute='class' defaultTheme='dark' enableSystem={false} value={{ dark: 'dark-mode', light: 'light-mode' }}>
      <Component {...pageProps} />
    </ThemeProvider>
  )
}
