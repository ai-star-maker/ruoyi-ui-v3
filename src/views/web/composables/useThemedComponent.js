/**
 * useThemedComponent(templateName, explicitTheme?, options?)
 * ---------------------------------------------------------------
 * 统一的"页面级模板加载"入口。任何需要"按当前主题渲染不同组件"的场景
 * 都必须用这个 composable
 *
 * @param {string} templateName
 *   'index' | 'post' | 'page' | ... 参见 theme/registry.js 的模板回退链。
 * @param {import('vue').Ref<string>|string} [explicitTheme]
 *   可选的主题覆盖（例如 /web/:siteCode/:theme? 路由里的预览主题参数）。
 *   不传时使用当前站点 (store) 配置的 site.theme。
 * @param {{ enabled?: import('vue').Ref<boolean>|boolean }} [options]
 *   enabled: 可选的就绪开关。当调用方在渲染前还需要等待异步数据
 *   （典型场景：article/info.vue 需要先 fetch 到文章、必要时切换站点，
 *   才知道该用哪个站点的主题），必须传入这个开关，并配合模板里的
 *   `v-if="ready"` 使用。不传则视为一直启用（如 index / category 场景，
 *   数据本来就已经就绪，不存在"解析时机过早"的问题）
 * 
 * @returns {{ component: Ref, componentKey: Ref<string> }}
 *   componentKey 建议直接绑定到 <component :key="componentKey">，
 *   保证切换站点/主题/模板时该组件被彻底销毁重建，而不是复用旧实例。
 */

import { resolveThemeTemplate } from '@/views/web/theme/registry'
import ThemeError from '@/views/web/theme/ThemeError.vue'
import { useThemeSite } from './useThemeSite'

export function useThemedComponent(templateName, explicitTheme, options = {}) {
  const { enabled } = options
  const { siteCode, site } = useThemeSite()

  const component = shallowRef(null)
  const componentKey = ref('')

  function currentThemeOverride() {
    if (!explicitTheme) return ''
    return typeof explicitTheme === 'string' ? explicitTheme : explicitTheme.value
  }

  function isEnabled() {
    if (enabled === undefined) return true
    return typeof enabled === 'boolean' ? enabled : enabled.value
  }

  function load() {
    // 未就绪时不解析：避免用"当前（可能是错误站点的）主题"抢先解析一次，
    // 紧接着又因为调用方切换站点而整体作废重来一遍——那一次多余的解析
    // 还会在 registry 里打印一条容易让人误解的回退日志。
    if (!isEnabled()) return

    const themeName = currentThemeOverride() || site.value?.theme
    const resolved = resolveThemeTemplate(themeName, templateName)

    componentKey.value = `${siteCode.value}::${resolved.name}::${resolved.template}`

    component.value = defineAsyncComponent({
      loader: resolved.load,
      errorComponent: ThemeError,
      onError(error, retry, fail) {
        console.error(
          `[theme] 模板 "${templateName}" (主题=${resolved.name}, 实际文件=${resolved.template}.vue) 加载失败:`,
          error
        )
        fail()
      }
    })
  }

  watch(
    () => [siteCode.value, site.value?.theme, currentThemeOverride(), isEnabled()],
    load,
    { immediate: true }
  )

  return { component, componentKey }
}
