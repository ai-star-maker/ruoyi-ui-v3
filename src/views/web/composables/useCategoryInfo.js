import { getCategoryInfo } from '@/utils/cms.js'

/**
 * useCategoryInfo(categoryCodeRef)
 * ---------------------------------------------------------------
 * 根据 categoryCode（可以是一个 ref，也可以是一个静态字符串）反查栏目信息，
 * 并在 categoryCode 变化时自动重新查询。
 *
 * @param {import('vue').Ref<string>|string} categoryCodeRef
 * @returns {import('vue').Ref<object>} category（查不到时为 {}）
 */

export function useCategoryInfo(categoryCodeRef) {
  const resolve = (code) => getCategoryInfo(code) || {}

  const category = ref(resolve(unref(categoryCodeRef)))

  watch(
    () => unref(categoryCodeRef),
    (code) => {
      category.value = resolve(code)
    }
  )

  return category
}
