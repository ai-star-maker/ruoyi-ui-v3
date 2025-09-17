<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="栏目编码" prop="categoryCode">
        <el-input
          v-model="queryParams.categoryCode"
          placeholder="请输入栏目编码"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="栏目名称" prop="categoryName">
        <el-input
          v-model="queryParams.categoryName"
          placeholder="请输入栏目名称"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="站点编码" prop="siteCode">
        <el-input
          v-model="queryParams.siteCode"
          placeholder="请输入站点编码"
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
          v-hasPermi="['cms:category:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="info"
          plain
          icon="Sort"
          @click="toggleExpandAll"
        >展开/折叠</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table
      v-if="refreshTable"
      v-loading="loading"
      :data="categoryList"
      row-key="categoryCode"
      :default-expand-all="isExpandAll"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column label="栏目编码" prop="categoryCode" />
      <el-table-column label="父级编号" align="center" prop="parentCode" />
      <el-table-column label="栏目名称" align="center" prop="categoryName" />
      <el-table-column label="栏目ID" prop="categoryId" />
      <el-table-column label="站点编码" align="center" prop="siteCode" />
      <el-table-column label="栏目图片" align="center" prop="image" width="100">
        <template #default="scope">
          <image-preview :src="scope.row.image" :width="50" :height="50"/>
        </template>
      </el-table-column>
      <el-table-column label="展现模式" align="center" prop="showModes" />
      <el-table-column label="状态" align="center" prop="status" >
        <template #default="scope">
          <dict-tag :options="sys_normal_disable" :value="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="View" @click="handleInfo(scope.row)" v-hasPermi="['monitor:category:query']">详情</el-button>
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['cms:category:edit']">修改</el-button>
          <el-button link type="primary" icon="Plus" @click="handleAdd(scope.row)" v-hasPermi="['cms:category:add']">新增</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['cms:category:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加或修改栏目管理对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="categoryRef" :model="form" :rules="rules" label-width="100px" :disabled="formDisabled">
        <el-row>
        <el-col :span="12">
          <el-form-item label="栏目编码" prop="categoryCode" >
            <el-input v-model="form.categoryCode" placeholder="请输入栏目编码" />
          </el-form-item>
          <el-form-item label="父级编号" prop="parentCode">
            <el-tree-select
              v-model="form.parentCode"
              :data="categoryOptions"
              :props="{ value: 'categoryCode', label: 'categoryName', children: 'children' }"
              value-key="categoryCode"
              placeholder="请选择父级编号"
              check-strictly
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="栏目名称" prop="categoryName">
            <el-input v-model="form.categoryName" placeholder="请输入栏目名称" />
          </el-form-item>
          <el-form-item label="站点编码" prop="siteCode">
            <el-input v-model="form.siteCode" placeholder="请输入站点编码" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="栏目图片" prop="image">
            <image-upload v-model="form.image" :action="uploadFileAction"/>
          </el-form-item>
          <el-form-item label="链接" prop="href">
            <el-input v-model="form.href" placeholder="请输入链接" />
          </el-form-item>
          </el-col>
          <el-col :span="12">
          <el-form-item label="关键字" prop="keywords">
            <el-input v-model="form.keywords" type="textarea" placeholder="请输入内容" />
          </el-form-item>
          </el-col>
          <el-col :span="12">
          <el-form-item label="描述" prop="description">
            <el-input v-model="form.description" type="textarea" placeholder="请输入内容" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="在导航中显示" prop="inMenu">
            <el-select v-model="form.inMenu" placeholder="请选择在导航中显示">
              <el-option
                v-for="dict in sys_yes_no"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="分类页中显示" prop="inList">
            <el-select v-model="form.inList" placeholder="请选择在分类页中显示列表">
              <el-option
                v-for="dict in sys_yes_no"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
        <el-form-item label="展现模式" prop="showModes">
          <el-input v-model="form.showModes" placeholder="请输入展现模式" />
        </el-form-item>
        </el-col>
        <el-col :span="12">
        <el-form-item label="需要审核" prop="isNeedAudit">
          <el-select v-model="form.isNeedAudit" placeholder="请选择需要审核">
            <el-option
              v-for="dict in sys_yes_no"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item>
        </el-col>
        <el-col :span="12">
        <el-form-item label="允许评论" prop="isCanComment">
          <el-select v-model="form.isCanComment" placeholder="请选择允许评论">
            <el-option
              v-for="dict in sys_yes_no"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item>
        </el-col>
        <el-col :span="12">
        <el-form-item label="栏目状态" prop="status">
          <el-select v-model="form.status" placeholder="请选择状态">
            <el-option
              v-for="dict in sys_normal_disable"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item>
        </el-col>
        <el-col :span="12">
        <el-form-item label="视图配置" prop="viewConfig">
          <el-input v-model="form.viewConfig" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        </el-col>
        <el-col :span="12">
        <el-form-item label="备注信息" prop="remarks">
          <el-input v-model="form.remarks" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="Category">
import { listCategory, getCategory, delCategory, addCategory, updateCategory } from "@/api/cms/category"

const { proxy } = getCurrentInstance()
const { sys_yes_no, sys_normal_disable } = proxy.useDict('sys_yes_no', 'sys_normal_disable')

const categoryList = ref([])
const categoryOptions = ref([])
const open = ref(false)
const loading = ref(true)
const showSearch = ref(true)
const title = ref("")
const isExpandAll = ref(true)
const refreshTable = ref(true)
const formDisabled = ref(false)
const uploadFileAction = ref("/cms/utils/upload")

const data = reactive({
  form: {},
  queryParams: {
    categoryCode: null,
    categoryName: null,
    siteCode: null,
  },
  rules: {
    categoryCode: [
      { required: true, message: "栏目编码不能为空", trigger: "blur" }
    ],
    parentCode: [
      { required: true, message: "父级编号不能为空", trigger: "blur" }
    ],
    categoryName: [
      { required: true, message: "栏目名称不能为空", trigger: "blur" }
    ],
    siteCode: [
      { required: true, message: "站点编码不能为空", trigger: "blur" }
    ],
    status: [
      { required: true, message: "状态不能为空", trigger: "change" }
    ],
  }
})

const { queryParams, form, rules } = toRefs(data)

/** 查询栏目管理列表 */
function getList() {
  loading.value = true
  listCategory(queryParams.value).then(response => {
    categoryList.value = proxy.handleTree(response.data, "categoryCode", "parentCode")
    loading.value = false
  })
}

/** 查询栏目管理下拉树结构 */
function getTreeselect() {
  listCategory().then(response => {
    categoryOptions.value = []
    const data = { categoryCode: 0, categoryName: '顶级节点', children: [] }
    data.children = proxy.handleTree(response.data, "categoryCode", "parentCode")
    categoryOptions.value.push(data)
  })
}
	
// 取消按钮
function cancel() {
  open.value = false
  reset()
}

// 表单重置
function reset() {
  formDisabled.value = false
  form.value = {
    categoryId: null,
    categoryCode: null,
    parentCode: null,
    ancestors: null,
    categoryName: null,
    siteCode: null,
    moduleType: null,
    image: null,
    href: null,
    keywords: null,
    description: null,
    inMenu: null,
    inList: null,
    showModes: null,
    isNeedAudit: null,
    isCanComment: null,
    viewConfig: null,
    status: null,
    createBy: null,
    createTime: null,
    updateBy: null,
    updateTime: null,
    remarks: null,
    extendS1: null,
    extendS2: null,
    extendI1: null,
    extendI2: null,
    extendF1: null,
    extendF2: null,
    extendD1: null,
    extendD2: null
  }
  proxy.resetForm("categoryRef")
}

/** 搜索按钮操作 */
function handleQuery() {
  getList()
}

/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm("queryRef")
  handleQuery()
}

/** 新增按钮操作 */
function handleAdd(row) {
  formDisabled.value = false
  getTreeselect()
  if (row != null && row.categoryCode) {
    form.value.parentCode = row.categoryCode
  } else {
    form.value.parentCode = 0
  }
  open.value = true
  title.value = "添加栏目管理"
}

/** 展开/折叠操作 */
function toggleExpandAll() {
  refreshTable.value = false
  isExpandAll.value = !isExpandAll.value
  nextTick(() => {
    refreshTable.value = true
  })
}

/** 修改按钮操作 */
async function handleUpdate(row) {
  reset()
  await getTreeselect()
  if (row != null) {
    form.value.parentCode = row.parentCode
  }
  getCategory(row.categoryId).then(response => {
    form.value = response.data
    open.value = true
    title.value = "修改栏目管理"
  })
}

/** 详情按钮操作 */
function handleInfo(row) {
  open.value = true
  formDisabled.value = true
  form.value = row
  title.value = "栏目管理详情"
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["categoryRef"].validate(valid => {
    if (valid) {
      if (form.value.categoryId != null) {
        updateCategory(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功")
          open.value = false
          getList()
        })
      } else {
        addCategory(form.value).then(response => {
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
  proxy.$modal.confirm('是否确认删除栏目管理编号为"' + row.categoryId + '"的数据项？').then(function() {
    return delCategory(row.categoryId)
  }).then(() => {
    getList()
    proxy.$modal.msgSuccess("删除成功")
  }).catch(() => {})
}

getList()
</script>
