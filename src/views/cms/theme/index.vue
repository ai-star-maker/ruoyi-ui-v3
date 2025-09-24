<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="主题名称" prop="themeName">
        <el-select v-model="queryParams.themeName" style="width: 200px">
          <el-option
            v-for="item in themeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="主题作者" prop="themeAuthor">
        <el-input
          v-model="queryParams.themeAuthor"
          placeholder="请输入主题作者"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="Plus"
          @click="handleAdd"
          v-hasPermi="['cms:theme:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['cms:theme:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['cms:theme:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['cms:theme:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="themeList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="主题编号" align="center" prop="themeId" />
      <el-table-column label="主题名称" align="center" prop="themeName" >
        <template #default="scope">
            <router-link :to="'/cms/themeConfig/index/' + scope.row.themeName" class="link-type">
              <span>{{ scope.row.themeName }}</span>
            </router-link>
        </template>        
      </el-table-column>
      <el-table-column label="主题样式图" align="center" prop="themeStyle" width="100">
        <template #default="scope">
          <image-preview :src="scope.row.themeStyle" :width="50" :height="50"/>
        </template>
      </el-table-column>
      <el-table-column label="主题作者" align="center" prop="themeAuthor" />
      <el-table-column label="主题介绍" align="center" prop="themeInfo" />
      <el-table-column label="主题版本号" align="center" prop="themeVersion" />
      <el-table-column label="是否启用" align="center" prop="themeEnabled">
        <template #default="scope">
          <dict-tag :options="sys_yes_no" :value="scope.row.themeEnabled"/>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="view" @click="handleView(scope.row)" v-hasPermi="['cms:theme:edit']">预览</el-button>
          <el-button link type="primary" icon="view" @click="handleActivate(scope.row)" v-hasPermi="['cms:theme:edit']">激活</el-button>
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['cms:theme:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['cms:theme:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <pagination
      v-show="total>0"
      :total="total"
      v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改网站主题对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="themeRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="主题名称" prop="themeName">
          <el-input v-model="form.themeName" placeholder="请输入主题名称" />
        </el-form-item>
        <el-form-item label="主题样式图" prop="themeStyle">
          <image-upload v-model="form.themeStyle"/>
        </el-form-item>
        <el-form-item label="主题作者" prop="themeAuthor">
          <el-input v-model="form.themeAuthor" placeholder="请输入主题作者" />
        </el-form-item>
        <el-form-item label="主题介绍" prop="themeInfo">
          <el-input v-model="form.themeInfo" placeholder="请输入主题介绍" />
        </el-form-item>
        <el-form-item label="主题版本号" prop="themeVersion">
          <el-input v-model="form.themeVersion" placeholder="请输入主题版本号" />
        </el-form-item>
        <el-form-item label="是否启用" prop="themeEnabled">
          <el-select v-model="form.themeEnabled" placeholder="请选择是否启用0启用 1停用">
            <el-option
              v-for="dict in sys_yes_no"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否更新" prop="themeUpdate">
          <el-select v-model="form.themeUpdate" placeholder="请选择是否可以更新0可以 1否">
            <el-option
              v-for="dict in sys_yes_no"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 预览或激活网站主题对话框 -->
    <el-dialog :title="previewOrActiveTitle" v-model="previewOrActiveFlag" width="600px" append-to-body>
      <el-table :data="siteThemes">
        <el-table-column label="网站编码" align="center" prop="siteCode" />
        <el-table-column label="网站名称" align="center" prop="siteName" />
        <el-table-column label="原主题" align="center" prop="themeName" >
          <!-- <template #default="scope">
            <el-radio-group v-model="scope.row.themeName"> 
              <el-radio 
                v-for="theme in themeOptions" 
                :key="theme.value" 
                :value="theme.value"
              >
              {{ theme.label }}
            </el-radio>
            </el-radio-group>
          </template> -->
        </el-table-column>
        <el-table-column label="目标主题" align="center" prop="themeNew" ></el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-button link type="primary" icon="view" v-if="previewFlag" @click="handleView(scope.row)" >预览</el-button>
            <el-button link type="primary" icon="view" v-if="!previewFlag" @click="handleActivate(scope.row)" v-hasPermi="['cms:theme:edit']">激活</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

  </div>
</template>

<script setup name="Theme">
import { listTheme, getTheme, delTheme, addTheme, updateTheme } from "@/api/cms/theme"
import { updateSite } from "@/api/cms/site"
import { getSiteInfo } from "@/utils/cms"
import useCmsStore from '@/store/modules/cms'

const { proxy } = getCurrentInstance()
const { sys_yes_no } = proxy.useDict('sys_yes_no')
const cmsStore = useCmsStore()
/**
 * const { themes, sites } = storeToRefs(cmsStore)
 * themes解构出来是空 ？
 */
const { sites } = storeToRefs(cmsStore)
const themeOptions = ref([])

const themeList = ref([])
const open = ref(false)
const loading = ref(true)
const showSearch = ref(true)
const ids = ref([])
const single = ref(true)
const multiple = ref(true)
const total = ref(0)
const title = ref("")

const previewOrActiveFlag = ref(false)
const previewOrActiveTitle = ref("")
const siteThemes = ref([])
const previewFlag = ref(true)

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    themeName: null,
    themeAuthor: null,
  },
  rules: {
    themeName: [
      { required: true, message: "主题名称不能为空", trigger: "blur" }
    ],
    themeEnabled: [
      { required: true, message: "是否启用0启用 1停用不能为空", trigger: "change" }
    ],
    themeUpdate: [
      { required: true, message: "是否可以更新0可以 1否不能为空", trigger: "change" }
    ],
  }
})

const { queryParams, form, rules } = toRefs(data)

/** 查询网站主题列表 */
function getList() {
  loading.value = true
  //TODO use themes
  listTheme(queryParams.value).then(response => {
    themeList.value = response.rows
    total.value = response.total
    loading.value = false
  })

  if (siteThemes.value.length < 1) {
    sites.value.forEach(element => {
      siteThemes.value.push({siteCode: element.siteCode, siteName: element.siteName, 
        themeName: element.theme})
    });
    cmsStore.themes.forEach(element => {
      themeOptions.value.push({value: element.themeName, label: element.themeName})
    });
  }
}

// 取消按钮
function cancel() {
  open.value = false
  reset()
}

// 表单重置
function reset() {
  form.value = {
    themeId: null,
    themeName: null,
    themeStyle: null,
    themeAuthor: null,
    themeInfo: null,
    themeVersion: null,
    themeEnabled: null,
    createBy: null,
    createTime: null,
    updateBy: null,
    updateTime: null,
    themeUpdate: null,
    themeTouch: null
  }
  proxy.resetForm("themeRef")
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1
  getList()
}

/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm("queryRef")
  handleQuery()
}

// 多选框选中数据
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.themeId)
  single.value = selection.length != 1
  multiple.value = !selection.length
}

/** 新增按钮操作 */
function handleAdd() {
  reset()
  open.value = true
  title.value = "添加网站主题"
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset()
  const _themeId = row.themeId || ids.value
  getTheme(_themeId).then(response => {
    form.value = response.data
    open.value = true
    title.value = "修改网站主题"
  })
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["themeRef"].validate(valid => {
    if (valid) {
      if (form.value.themeId != null) {
        updateTheme(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功")
          open.value = false
          getList()
        })
      } else {
        addTheme(form.value).then(response => {
          proxy.$modal.msgSuccess("新增成功")
          open.value = false
          getList()
        })
      }
    }
  })
}

/** 删除按钮操作 */
function handleDelete(row) {
  const _themeIds = row.themeId || ids.value
  proxy.$modal.confirm('是否确认删除网站主题编号为"' + _themeIds + '"的数据项？').then(function() {
    return delTheme(_themeIds)
  }).then(() => {
    getList()
    proxy.$modal.msgSuccess("删除成功")
  }).catch(() => {})
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('cms/theme/export', {
    ...queryParams.value
  }, `theme_${new Date().getTime()}.xlsx`)
}

/** 预览按钮操作 */
function handleView(row) {
  let url = window.location.origin;
  if (sites.value.length == 1) {
    url += '/web/' + sites.value[0].site_code + '/' + row.themeName
    window.open(url, '_blank', 'noopener,noreferrer');
  } else if ("siteCode" in row) {
    url += '/web/' + row.siteCode + '/' + row.themeNew
    window.open(url, '_blank', 'noopener,noreferrer');
  } else {
    previewOrActiveFlag.value = true
    previewOrActiveTitle.value = "预览网站主题"
    siteThemes.value.forEach(element => { element.themeNew = row.themeName } )
    previewFlag.value = true
  }
}

/** 激活按钮操作 */
function handleActivate(row) {
  let msg = ""
  let updateFlag = false
  let site = ""
  let themeOld = ""
  let themeNew = ""
  
  if (sites.value.length == 1) {
    themeOld = sites.value[0].theme
    themeNew = row.themeName
    site = sites.value[0]
  } else if ("siteCode" in row) {
     /* 在多个网站的dialog中点击预览*/
    themeOld = row.themeName
    themeNew = row.themeNew
    site = getSiteInfo(row.siteCode)
  } else {
    /* 多个网站情况显示dialog并return*/
    previewOrActiveFlag.value = true
    previewOrActiveTitle.value = "激活网站主题"
    siteThemes.value.forEach(element => { element.themeNew = row.themeName } )
    previewFlag.value = false
    return
  }
  
  if (themeOld == themeNew) msg = "当前网站的主题已经是【" + themeNew + '】,不需要修改'
  else {
    updateFlag = true
    msg = "是否确认将网站主题【" + themeOld + "】 修改为 【" + themeNew + '】 ?'
  }

  proxy.$modal.confirm(msg).then(function() {
    return 
  }).then(() => {
    if (updateFlag) {
      site.theme = themeNew
      updateSite(site).then(response => {
        //多网站diaglog激活后 页面回显
        siteThemes.value.forEach(element => { 
          if (element.siteCode == row.siteCode) element.themeName = themeNew } )
        proxy.$modal.msgSuccess("修改成功")
      })
    }
  }).catch(() => {});
    
}

getList()
</script>
