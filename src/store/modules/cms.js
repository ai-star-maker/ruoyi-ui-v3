import { listSiteAndCategory } from "@/api/cms/site";
import { listThemeAndConfig } from "@/api/cms/theme"
import { defineStore } from 'pinia'

const useCmsStore = defineStore(
  'cms',
  {
    state: () => ({
      siteCode: '',  // 当前站点编码
      site: {},      // 当前站点完整信息
      sites: [],     // 所有站点列表
      themes: [],    // 所有主题列表
      themeConfigs: {}, // 主题配置映射表 {themeName: config}
      loading: false,
      error: null
    }),

    getters: {
      /**
       * 获取当前站点
       */
      currentSite: (state) => state.site,

      /**
       * 获取当前主题名称
       */
      currentTheme: (state) => state.site?.theme,

      /**
       * 获取当前主题配置
       */
      currentThemeConfig: (state) => {
        const themeName = state.site?.theme
        return themeName ? state.themeConfigs[themeName] : {}
      },

      /**
       * 获取当前站点的分类树
       */
      categoriesTree: (state) => {
        return state.site?.categories || []
      },

      /**
       * 获取当前站点可用主题
       */
      availableThemes: (state) => {
        return state.themes.filter(t => t.themeEnabled === 'Y')
      }
    },

    actions: {
      /**
       * 获取站点和主题信息
       * 原有的 GetSitesInfo 方法，保持兼容性
       */
      GetSitesInfo() {
        return new Promise((resolve, reject) => {
          listSiteAndCategory({status: 0}).then(res => {
            const sites = res.rows;
            if (this.siteCode == "") {
              this.site = sites[0];
              this.siteCode = sites[0].siteCode; //暂时设定第一个为当前站点
            }
            else {
              this.site = sites.filter(site => site.siteCode == this.siteCode)[0];
            }
            this.sites = sites
            console.log("store.cms.GetSitesInfo return ", sites)

            listThemeAndConfig({themeEnabled: "Y"}).then(res => {
              this.themes = res.rows;
              
              // 规范化主题配置为 Map
              if (res.rows && res.rows.length > 0) {
                res.rows.forEach(theme => {
                  this.themeConfigs[theme.themeName] = {
                    ...theme,
                    cssVariables: this.parseThemeVariables(theme.configValue)
                  }
                })
              }

              console.log("store.cms.GetSitesInfo listTheme return ", this.themes)
              resolve(res)
            }).catch(error => {
              reject(error)
            })
          }).catch(error => {
            reject(error);
          })
        })
      },

      /**
       * 初始化 CMS 数据（新方法，更清晰）
       */
      async initCMS() {
        this.loading = true
        try {
          // 并行加载
          const [sitesRes, themesRes] = await Promise.all([
            listSiteAndCategory({ status: 0 }),
            listThemeAndConfig({ themeEnabled: 'Y' })
          ])

          this.sites = sitesRes.rows || []
          this.themes = themesRes.rows || []

          // 规范化主题配置为 Map
          const newThemeConfigs = {}
          if (this.themes && this.themes.length > 0) {
            this.themes.forEach(theme => {
              newThemeConfigs[theme.themeName] = {
                ...theme,
                cssVariables: this.parseThemeVariables(theme.configValue)
              }
            })
          }
          this.themeConfigs = newThemeConfigs

          // 设置默认站点
          if (this.sites.length > 0 && !this.siteCode) {
            this.setSite(this.sites[0].siteCode)
          }

          this.error = null
        } catch (err) {
          this.error = err.message
          console.error('[CMS Store] Failed to init CMS:', err)
        } finally {
          this.loading = false
        }
      },

      /**
       * 切换站点
       * @param {string} siteCode - 站点编码
       */
      setSite(siteCode) {
        const site = this.sites.find(s => s.siteCode === siteCode)
        if (!site) {
          console.warn(`[CMS Store] Site not found: ${siteCode}`)
          return false
        }

        this.siteCode = siteCode
        this.site = site

        // 自动设置该站点的主题
        if (site.theme) {
          this.setTheme(site.theme)
        }

        return true
      },

      /**
       * 切换主题（同一站点内预览不同主题）
       * @param {string} themeName - 主题名称
       */
      setTheme(themeName) {
        if (!this.themeConfigs[themeName]) {
          console.warn(`[CMS Store] Theme not found: ${themeName}`)
          return false
        }

        // 更新当前站点的主题
        if (this.site) {
          this.site = {
            ...this.site,
            theme: themeName
          }
        }

        return true
      },

      /**
       * 解析主题变量配置
       * @param {string} configValue - 配置值（可能是 JSON）
       * @returns {Object} 解析后的变量对象
       */
      parseThemeVariables(configValue) {
        try {
          if (!configValue) return {}
          const parsed = typeof configValue === 'string' ? JSON.parse(configValue) : configValue
          return parsed.cssVariables || {}
        } catch (err) {
          console.warn('[CMS Store] Error parsing theme variables:', err)
          return {}
        }
      },

      /**
       * 重置存储状态
       */
      reset() {
        this.siteCode = ''
        this.site = {}
        this.sites = []
        this.themes = []
        this.themeConfigs = {}
        this.error = null
      }
    }
  }
)

export default useCmsStore
