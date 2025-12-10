// pages/_app.tsx

// 1. 用于公式渲染 (可选)
import 'katex/dist/katex.min.css'

// 2. 代码高亮主题设置
// 原本的亮色主题被我注释掉了，改用了适合暗黑模式的 okaidia 主题
// import 'prismjs/themes/prism-coy.css' 
import 'prismjs/themes/prism-okaidia.css' 

// 3. 核心样式 (必须)
import 'react-notion-x/src/styles.css'

// 4. 全局样式
import 'styles/global.css'

// 5. Notion 样式覆盖
import 'styles/notion.css'

// 6. Prism 代码高亮样式覆盖
import 'styles/prism-theme.css'

import type { AppProps } from 'next/app'
import * as Fathom from 'fathom-client'
import { useRouter } from 'next/router'
import { posthog } from 'posthog-js'
import * as React from 'react'
// 引入主题管理组件
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
    // 这里是关键修改：强制默认使用 dark 模式，并且不跟随系统设置
    <ThemeProvider attribute='class' defaultTheme='dark' enableSystem={false}>
      <Component {...pageProps} />
    </ThemeProvider>
  )
}
