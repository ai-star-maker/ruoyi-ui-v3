/**
 * 主题注册表 (Theme Registry) 
 * ---------------------------------------------------------------
 * 参照 Ghost 主题的模板层级设计：
 *   config.json (主题元数据)
 *   index.vue   (首页，必需)
 *   default.vue (通用兜底，仅系统默认主题必需)
 *   post.vue    (文章详情，可选)
 *   category.vue (栏目/分类列表，可选)
 *   page.vue    (独立页面，可选)
 *
 * 解析规则
 *   1. 请求主题不存在               -> 使用系统默认主题（THEME_DEFAULT）
 *   2. 主题存在但没有该具体模板      -> 在同一主题内回退到 default.vue
 *   3. 主题连 default.vue 都没有    -> 整体回退到系统默认主题的同一模板链
 *      （系统默认主题在构建期被强制校验必须有 index.vue + default.vue，
 *       所以第 3 步保证一定能解析成功）
 */


// modules[path].default 就是解析后的对象，不需要额外 JSON.parse。
const manifestModules = import.meta.glob('./*/config.json', { eager: true })
const templateModules = import.meta.glob('./*/*.vue')

export const THEME_DEFAULT = 'default'

// 每个主题必须实现的模板；只有系统默认主题（THEME_DEFAULT）会被强制校验。
const REQUIRED_TEMPLATES = ['index', 'default']

// config.json 必须包含的字段；缺失会在构建期报错，防止把不完整的主题发布上线。
const REQUIRED_CONFIG_FIELDS = ['label', 'version', 'author']

// 内容类模板的回退链：找不到具体模板时，在同一主题内按此顺序尝试。
// 未在此声明的模板名默认回退链为 [模板名, 'default']。
const TEMPLATE_FALLBACK_CHAIN = {
  index: ['index'],           // 首页没有回退，必须显式存在
  default: ['default'],
  post: ['post', 'default'],
  page: ['page', 'default'],
  category: ['category', 'default']
}

function extractThemeName(path) {
  const match = path.match(/^\.\/([^/]+)\//)
  return match ? match[1] : null
}

function extractTemplateName(path, themeName) {
  return path.slice(`./${themeName}/`.length).replace(/\.vue$/, '')
}

const registry = {}

for (const path in manifestModules) {
  const name = extractThemeName(path)
  if (!name) continue

  const config = manifestModules[path].default ?? manifestModules[path]
  const missingFields = REQUIRED_CONFIG_FIELDS.filter(field => !config?.[field])
  if (missingFields.length) {
    console.error(`[theme] "${name}/config.json" 缺少必填字段: ${missingFields.join(', ')}，已跳过注册。`)
    continue
  }

  registry[name] = { config, templates: {} }
}

for (const path in templateModules) {
  const name = extractThemeName(path)
  if (!name || !registry[name]) continue // 没有合法 config.json 的目录不算合法主题
  const templateName = extractTemplateName(path, name)
  registry[name].templates[templateName] = templateModules[path]
}

// 校验：每个主题至少要有 index.vue 才能注册；系统默认主题必须实现全部必需模板。
for (const name of Object.keys(registry)) {
  const missing = REQUIRED_TEMPLATES.filter(t => !registry[name].templates[t])
  if (name === THEME_DEFAULT && missing.length) {
    throw new Error(`[theme] 系统默认主题缺少必需模板: ${missing.join(', ')}，系统无法启动。`)
  }
  if (!registry[name].templates.index) {
    console.error(`[theme] 主题 "${name}" 缺少 index.vue，已跳过注册。`)
    delete registry[name]
  }
}

if (!registry[THEME_DEFAULT]) {
  throw new Error(`[theme] 必需的 "${THEME_DEFAULT}" 主题缺失或 config.json 配置有误，系统无法启动。`)
}

/**
 * 解析主题名 -> { name, config }（仅元数据，来自 config.json，用于主题市场/后台展示）。
 * 找不到时回退到系统默认主题并打印告警。
 */
export function resolveTheme(themeName) {
  if (themeName && registry[themeName]) {
    return { name: themeName, config: registry[themeName].config }
  }
  if (themeName) {
    console.warn(`[theme] 未知主题 "${themeName}"，已回退到 "${THEME_DEFAULT}"。`)
  }
  return { name: THEME_DEFAULT, config: registry[THEME_DEFAULT].config }
}

/**
 * 解析 (主题名, 模板名) -> { name, template, load }，用于实际渲染。
 * 这是 index.vue、post.vue 等所有"页面级"组件加载的唯一入口。
 *
 * @param {string} themeName     期望使用的主题名（可能来自 site.theme 或路由预览参数）
 * @param {string} templateName  'index' | 'post' | 'page' | ...
 */
export function resolveThemeTemplate(themeName, templateName) {
  const { name } = resolveTheme(themeName) // 第 1 步：主题不存在 -> 落到系统默认主题名
  const chain = TEMPLATE_FALLBACK_CHAIN[templateName] || [templateName, 'default']

  for (const candidate of chain) {
    const load = registry[name]?.templates[candidate]
    if (load) {
      if (candidate !== templateName) {
        console.info(`[theme] 主题 "${name}" 未提供 "${templateName}" 模板，已在主题内回退到 "${candidate}"。`)
      }
      return { name, template: candidate, load }
    }
  }

  // 第 3 步：该主题连自己的 default.vue 都没有 -> 整体回退到系统默认主题
  if (name !== THEME_DEFAULT) {
    console.warn(`[theme] 主题 "${name}" 未提供 "${templateName}" 也没有 default.vue 兜底，已整体回退到系统默认主题。`)
    return resolveThemeTemplate(THEME_DEFAULT, templateName)
  }

  // 理论上不会走到这里，因为系统默认主题已在构建期校验过 REQUIRED_TEMPLATES。
  throw new Error(`[theme] 系统默认主题也无法解析模板 "${templateName}"，主题系统配置有误。`)
}

/** 供"主题市场/切换主题"等管理界面使用 */
export function listThemes() {
  return Object.keys(registry).map(name => ({
    name,
    ...registry[name].config,
    templates: Object.keys(registry[name].templates)
  }))
}

export function hasTheme(themeName) {
  return !!registry[themeName]
}
