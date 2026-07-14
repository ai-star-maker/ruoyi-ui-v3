/**
 * 主题加载和管理 Composable
 * 提供统一的主题组件加载接口，支持错误降级
 * 
 * 支持加载的组件类型:
 * - index: 主题首页
 * - post: 文章详情页
 * - list: 文章列表页
 * - sidebar: 侧边栏（可选）
 * 以及其他任意自定义组件
 */
import { defineAsyncComponent, shallowRef, computed, watch, readonly, ref, onMounted } from 'vue'
import useCmsStore from '@/store/modules/cms'

const themeComponentCache = new Map()

/**
 * 主题组件规范定义
 * 用于定义各个主题组件的属性、是否必需、备用方案等
 */
const THEME_COMPONENTS = {
  // 必需组件
  index: {
    name: 'ThemeIndex',
    required: true,
    fallback: 'DefaultIndex',
    description: '主题首页组件'
  },
  post: {
    name: 'ThemePost',
    required: false,  // 可选，如果主题没有自定义则使用默认
    fallback: 'DefaultPost',
    description: '文章详情页组件'
  },
  list: {
    name: 'ThemeList',
    required: false,
    fallback: 'DefaultList',
    description: '文章列表页组件'
  },
  sidebar: {
    name: 'ThemeSidebar',
    required: false,
    fallback: null,
    description: '侧边栏组件'
  },
  search: {
    name: 'ThemeSearch',
    required: false,
    fallback: 'DefaultSearch',
    description: '搜索结果页组件'
  }
}

/**
 * 使用主题系统
 * @returns {Object} 主题相关的方法和状态
 */
export function useTheme() {
  const cmsStore = useCmsStore()

  /**
   * 加载主题组件
   * @param {string} componentType - 组件类型 (index, post, list, sidebar 等)
   * @param {string} themeName - 主题名称，默认使用当前主题
   * @returns {Promise<Component>} 异步组件
   */
  async function loadThemeComponent(componentType, themeName = null) {
    const theme = themeName || cmsStore.site?.theme
    const config = THEME_COMPONENTS[componentType]

    if (!config) {
      console.warn(`[Theme] Unknown component type: ${componentType}`)
      return null
    }

    if (!theme) {
      console.warn(`[Theme] No theme specified for loading ${componentType}`)
      return null
    }

    const cacheKey = `${theme}:${componentType}`

    // 检查缓存
    if (themeComponentCache.has(cacheKey)) {
      console.log(`[Theme] Load ${componentType} from cache (theme: ${theme})`)
      return themeComponentCache.get(cacheKey)
    }

    try {
      const component = defineAsyncComponent({
        loader: async () => {
          // 尝试从主题目录加载组件
          try {
            return await import(
              /* @vite-ignore */ `../views/web/theme/${theme}/${componentType}.vue`
            )
          } catch (themeErr) {
            console.warn(
              `[Theme] Component ${componentType} not found in theme ${theme}, falling back to default`
            )
            
            // 如果主题没有该组件且有备用方案，加载备用组件
            if (config.fallback) {
              return await import(
                /* @vite-ignore */ `../views/web/theme/shared/${config.fallback}.vue`
              )
            }
            throw themeErr
          }
        },
        loadingComponent: () => import('@/components/LoadingFallback.vue').catch(() => null),
        errorComponent: () => import('@/views/error/404'),
        delay: 200,
        timeout: 10000,
        onError(error, retry, fail, attempts) {
          console.error(
            `[Theme] Failed to load ${componentType} from theme ${theme}:`,
            error.message
          )
          if (attempts <= 2) {
            retry()
          } else {
            fail()
          }
        }
      })

      themeComponentCache.set(cacheKey, component)
      console.log(`[Theme] Loaded ${componentType} from theme ${theme}`)
      return component
    } catch (err) {
      console.error(`[Theme] Error loading ${componentType}:`, err)
      return null
    }
  }

  /**
   * 预加载主题的所有必需组件
   * @param {string} themeName - 主题名称
   */
  async function preloadTheme(themeName) {
    const requiredComponents = Object.entries(THEME_COMPONENTS)
      .filter(([, config]) => config.required)
      .map(([type]) => loadThemeComponent(type, themeName))

    try {
      await Promise.all(requiredComponents)
      console.log(`[Theme] Theme ${themeName} preloaded successfully`)
    } catch (err) {
      console.error(`[Theme] Error preloading theme ${themeName}:`, err)
    }
  }

  /**
   * 清除组件缓存
   * @param {string} themeName - 主题名称，不指定则清除所有
   */
  function clearComponentCache(themeName = null) {
    if (themeName) {
      const keysToDelete = Array.from(themeComponentCache.keys()).filter(key =>
        key.startsWith(themeName + ':')
      )
      keysToDelete.forEach(key => themeComponentCache.delete(key))
      console.log(`[Theme] Cleared ${keysToDelete.length} components from theme ${themeName}`)
    } else {
      themeComponentCache.clear()
      console.log('[Theme] Cleared all component cache')
    }
  }

  /**
   * 获取当前主题信息
   */
  const currentTheme = computed(() => cmsStore.site?.theme)

  /**
   * 获取主题配置
   */
  const themeConfig = computed(() => {
    const themeName = currentTheme.value
    if (!themeName) return {}
    return cmsStore.themeConfigs?.[themeName] || {}
  })

  /**
   * 获取主题 CSS 变量
   */
  const themeCSSVars = computed(() => {
    const config = themeConfig.value
    return config.cssVariables || {}
  })

  /**
   * 应用主题 CSS 变量到 DOM
   */
  function applyThemeCSSVars() {
    const vars = themeCSSVars.value
    Object.entries(vars).forEach(([key, value]) => {
      document.documentElement.style.setProperty(key, value)
    })
  }

  /**
   * 切换主题（同一站点内）
   * @param {string} themeName - 新主题名称
   */
  function switchTheme(themeName) {
    if (themeName && themeName !== currentTheme.value) {
      clearComponentCache(currentTheme.value)
      cmsStore.setTheme(themeName)
      preloadTheme(themeName)
      applyThemeCSSVars()
    }
  }

  // 监听主题变化，自动应用 CSS 变量
  watch(
    () => currentTheme.value,
    () => {
      applyThemeCSSVars()
    },
    { immediate: true }
  )

  return {
    loadThemeComponent,
    preloadTheme,
    clearComponentCache,
    switchTheme,
    currentTheme,
    themeConfig,
    themeCSSVars,
    applyThemeCSSVars,
    THEME_COMPONENTS  // 暴露组件规范供外部使用
  }
}

/**
 * 使用单个主题组件
 * 简化组件加载的 Composable
 */
export function useThemeComponent(componentType) {
  const { loadThemeComponent } = useTheme()
  const component = shallowRef(null)
  const loading = ref(false)
  const error = ref(null)

  async function loadComponent() {
    loading.value = true
    error.value = null
    try {
      component.value = await loadThemeComponent(componentType)
    } catch (err) {
      error.value = err
      console.error(`[Theme] Failed to load theme component ${componentType}:`, err)
    } finally {
      loading.value = false
    }
  }

  onMounted(() => loadComponent())

  return {
    component: readonly(component),
    loading: readonly(loading),
    error: readonly(error)
  }
}
