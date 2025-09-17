import { listSiteAndCategory } from "@/api/cms/site";
import { listTheme } from "@/api/cms/theme"

const useCmsStore = defineStore(
  'cms',
  {
    state: () => ({
      siteCode: '',  //curr_site_code
      site: {},
      sites: [],
      themes: []
    }),

    actions: {
      // 获取站点信息
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
            //console.log("store.cms.GetSitesInfo return ", sites)

            listTheme({themeEnabled: "Y"}).then(res => {
              this.themes = res.rows;
              //console.log("store.cms.GetSitesInfo listTheme return ", this.themes)
              resolve(res)
            }).catch(error => {
              reject(error)
            })

            //resolve(res);  //listTheme返回后才完成
          }).catch(error => {
            reject(error);
          })

         
        })
      },

    }
})

export default useCmsStore
