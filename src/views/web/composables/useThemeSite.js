/**
 * useThemeSite()
 * ---------------------------------------------------------------
 * 所有主题根组件（theme/<name>/index.vue）必须通过这个 composable
 * 获取站点数据，禁止在主题组件里自己 watch(siteCode) 再手动赋值。
 *    ThemeLoader 层用 `:key="siteCode+theme"` 整体重挂载主题组件，
 *    主题组件内部就不再需要任何手动重置技巧。
 *
 * @returns {{
*   siteCode: import('vue').Ref<string>,
*   site: import('vue').Ref<object>,
*   categories: import('vue').Ref<Array>,
*   ready: import('vue').Ref<boolean>
* }}
*/

import useCmsStore from '@/store/modules/cms'

export function useThemeSite() {
  const cmsStore = useCmsStore()
  const { siteCode, site } = storeToRefs(cmsStore)

  const categories = ref(site.value?.categories ?? [])
  const ready = ref(categories.value.length > 0)

  watch(
    site,
    (newSite) => {
      categories.value = newSite?.categories ?? []
      ready.value = true
    },
    { immediate: true, deep: false }
  )

  return { siteCode, site, categories, ready }
}
