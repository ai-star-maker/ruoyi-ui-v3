import useCmsStore from '@/store/modules/cms'

export function initSite(path) {
  const cmsStore = useCmsStore()
  return new Promise((resolve, reject) => {
    let paths = path.split("/");
    if (!cmsStore.sites || cmsStore.sites == null || cmsStore.sites.length == 0) {
      cmsStore.GetSitesInfo().then(res => {
        console.log("initSite,setSite=%s site_num=%d themes_num=%d", cmsStore.siteCode, 
          cmsStore.sites.length, cmsStore.themes.length, cmsStore.sites);
        //直接访问/web/article/:categoryCode/:articleId|more 需要设定站点
        if (paths[1] == "web" && paths[2] == "article") {
          if (String(paths[3]).match(/^[a-zA-Z0-9]*$/)
            && (paths[4] == 'more' || String(paths[5]).match(/^\d*$/))) {
            let category = getCategoryInfo(paths[3]);
            setSiteInfo(category.siteCode);
          }
        }
        
        //theme预览时 /web/site_code/theme_name 设定站点
        if (paths.length == 4 && paths[1] == "web") {
          let site2 = getSiteInfo(paths[2])
          let theme2 = getThemeInfo(paths[3])
          if (site2 && theme2 && paths[2] != cmsStore.siteCode) {
            console.log("theme preview set siteCode = ", paths[2])
            setSiteInfo(site2.siteCode)
          }
        }

        resolve(res);
      }).catch(error => {
        reject(error);
      });
    }
    else {
      resolve();
    }

    //直接访问/web/main|sub1时 根据path设定当前站点  
    if (paths.length == 3 && paths[1] == "web") {
      //cmsStore.siteCode == null 还没初始化完
      if (cmsStore.siteCode != null && paths[2] != cmsStore.siteCode && getSiteInfo(paths[2]) != null) {
        setSiteInfo(paths[2]);
        //TODO 日志cmsStore.site=undefined 为啥setSiteInfon成功？
        console.log("by path set sitecode=" + paths[2]);
      }
    }
  })
}

export function setSiteInfo(siteCode) {
  useCmsStore().siteCode = siteCode;
  useCmsStore().site = getSiteInfo(siteCode);
}

export function getSiteInfo(siteCode) {
  const site = useCmsStore().sites.filter(site => site.siteCode == siteCode)[0];
  return site;
}

export function getThemeInfo(themeName) {
  const theme = useCmsStore().themes.filter(theme => theme.themeName == themeName)[0];
  return theme;
}

//根据用户具有管理权限的站列表，返回站编码，如果有2个以上返回null 查询所有的
export function getSiteCodeByList(siteList) {
  return siteList.length == 1 ? siteList[0].siteCode : null;
}

export function getCategoryInfo(categoryCode) {
  for (let site of useCmsStore().sites) {
    let categories = site.categories.filter(category => category.categoryCode == categoryCode)
    if (categories.length > 0) return categories[0];
  }
}

/**
 * 根据siteCode返回栏目列表，如果是空返回所有的
 * @param {*} siteCode 
 * @returns 
 */
export function getSiteCategory(siteCode) {
  let cats = [];
  for (let site of useCmsStore().sites) {
    if (siteCode == null || siteCode == site.siteCode ) cats = cats.concat(site.categories);
  }
  return cats;
}

/**
 * 获得当前用户具有管理权限的站点列表
 * 在menu表中设定cms:site:siteCodeAdmin权限
 */
export function getPermiSites() {
  let permiSites = [];
  const permi = store.getters.permissions;
  if (permi == null) return ['undefined'];
  else if (permi.length > 0 && permi[0] === "*:*:*") {
    return useCmsStore().sites; 
  }
  else {
    const permiSites0 = permi.filter(function(item) {
      return /^cms:site:.*Admin$/.test(item)
    });
    
    for (let item of permiSites0) {
      //cms:site:.*Admin 取站编码
      let code = item.substring(9, item.length - 5);
      permiSites.push(getSiteInfo(code));
    }
    return permiSites;
  }
}

export function getImagePath(path) {
  return process.env.VUE_APP_BASE_API + path;
}

export function getHomePath(path) {
  const site = path ? path : useCmsStore().site;
  //return '/web/' + site.siteCode + (site.theme == 'default' ? '/index' : '/' + site.theme);
  return '/web/' + site.siteCode
}