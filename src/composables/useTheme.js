/**
 * 主题加载和管理 Composable
 * 提供统一的主题组件加载接口，支持错误降级
 */
import { defineAsyncComponent, shallowRef, computed, watch, readonly, ref, onMounted } from 'vue'
import useCmsStore from '@/store/modules/cms'

const themeComponentCache = new Map()

/**
 * 主题组件规范
 */
const THEME_COMPONENTS = {
  index: {
    name: 'ThemeIndex',
    required: true,
    fallback: 'DefaultIndex'
  },
  post: {
    name: 'ThemePost',
    required: true,
    fallback: 'DefaultPost'
  },
  list: {
    name: 'ThemeList',
    required: false,
    fallback: 'DefaultList'
  },
  sidebar: {
    name: 'ThemeSidebar',
    required: false,
    fallback: null
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
   * @param {string} componentType - 组件类型 (index, post, list, sidebar)
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
      return themeComponentCache.get(cacheKey)
    }

    try {
      const component = defineAsyncComponent({
        loader: () =>
          import(
            /* @vite-ignore */ `../views/web/theme/${theme}/${componentType}.vue`
          ),
        loadingComponent: () => import('@/components/LoadingFallback.vue').catch(() => null),
        errorComponent: () =>
          import(
            /* @vite-ignore */ `../views/web/article/${config.fallback}.vue`
          ).catch(() => null),
        delay: 200,
        timeout: 10000,
        onError(error, retry, fail, attempts) {
          console.warn(
            `[Theme] Failed to load ${componentType} from theme ${theme}:`,
            error.message
          )
          if (attempts <= 3) {
            retry()
          } else {
            fail()
          }
        }
      })

      themeComponentCache.set(cacheKey, component)
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
    } else {
      themeComponentCache.clear()
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
    applyThemeCSSVars
  }
}

/**
 * 使用主题组件
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
      console.error(`Failed to load theme component ${componentType}:`, err)
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
