<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="站点编码" prop="siteCode">
        <el-input
          v-model="queryParams.siteCode"
          placeholder="请输入站点编码"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="站点名称" prop="siteName">
        <el-input
          v-model="queryParams.siteName"
          placeholder="请输入站点名称"
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
          v-hasPermi="['cms:site:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['cms:site:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['cms:site:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['cms:site:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="siteList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="站点ID" align="center" prop="siteId" />
      <el-table-column label="站点编码" align="center" prop="siteCode" />
      <el-table-column label="站点名称" align="center" prop="siteName" />
      <el-table-column label="站点标题" align="center" prop="title" />
      <el-table-column label="站点Logo" align="center" prop="logo" width="100">
        <template #default="scope">
          <image-preview :src="scope.row.logo" :width="50" :height="50"/>
        </template>
      </el-table-column>
      <el-table-column label="主题" align="center" prop="theme" />
      <el-table-column label="状态" align="center" prop="status">
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
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['cms:site:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['cms:site:remove']">删除</el-button>
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

    <!-- 添加或修改站点管理对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="siteRef" :model="form" :rules="rules" label-width="80px">
        <el-row>
        <el-col :span="12">
          <el-form-item label="站点编码" prop="siteCode">
            <el-input v-model="form.siteCode" placeholder="请输入站点编码" />
          </el-form-item>
          <el-form-item label="站点名称" prop="siteName">
            <el-input v-model="form.siteName" placeholder="请输入站点名称" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="站点序号" prop="siteSort">
            <el-input v-model="form.siteSort" placeholder="请输入站点排序号" />
          </el-form-item>
          <el-form-item label="站点状态" prop="status">
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
        <el-col :span="24">
        <el-form-item label="站点标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入站点标题" />
        </el-form-item>
        <el-form-item label="站点Logo" prop="logo">
          <image-upload v-model="form.logo" :action="uploadFileAction"/>
        </el-form-item>
        <el-form-item label="站点域名" prop="domain">
          <el-input v-model="form.domain" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="关键字" prop="keywords">
          <el-input v-model="form.keywords" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="form.description" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        </el-col>

        <el-col :span="12">
        <el-form-item label="主题" prop="theme">
          <el-input v-model="form.theme" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="联系电话" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入联系电话" />
        </el-form-item>
        </el-col>
        <el-col :span="12">
        <el-form-item label="电子邮箱" prop="email">
          <el-input v-model="form.email" placeholder="请输入电子邮箱" />
        </el-form-item>
        <el-form-item label="公司地址" prop="address">
          <el-input v-model="form.address" placeholder="请输入公司地址" />
        </el-form-item>
        </el-col>
        <el-col :span="24">
        <el-form-item label="版权信息" prop="copyright">
          <el-input v-model="form.copyright" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="备注信息" prop="remarks">
          <el-input v-model="form.remarks" placeholder="请输入内容" />
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

<script setup name="Site">
import { listSite, getSite, delSite, addSite, updateSite } from "@/api/cms/site"

const { proxy } = getCurrentInstance()
const { sys_normal_disable } = proxy.useDict("sys_normal_disable")


const siteList = ref([])
const open = ref(false)
const loading = ref(true)
const showSearch = ref(true)
const ids = ref([])
const single = ref(true)
const multiple = ref(true)
const total = ref(0)
const title = ref("")
const uploadFileAction = ref("/cms/utils/upload")

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    siteCode: null,
    siteName: null,
  },
  rules: {
    siteCode: [
      { required: true, message: "站点编码不能为空", trigger: "blur" }
    ],
    siteName: [
      { required: true, message: "站点名称不能为空", trigger: "blur" }
    ],
    title: [
      { required: true, message: "站点标题不能为空", trigger: "blur" }
    ],
    status: [
      { required: true, message: "状态不能为空", trigger: "change" }
    ],
  }
})

const { queryParams, form, rules } = toRefs(data)

/** 查询站点管理列表 */
function getList() {
  loading.value = true
  listSite(queryParams.value).then(response => {
    siteList.value = response.rows
    total.value = response.total
    loading.value = false
  })
}

// 取消按钮
function cancel() {
  open.value = false
  reset()
}

// 表单重置
function reset() {
  form.value = {
    siteId: null,
    siteCode: null,
    siteName: null,
    siteSort: null,
    title: null,
    logo: null,
    domain: null,
    keywords: null,
    description: null,
    theme: null,
    phone: null,
    email: null,
    address: null,
    copyright: null,
    status: null,
    createBy: null,
    createTime: null,
    updateBy: null,
    updateTime: null,
    remarks: null
  }
  proxy.resetForm("siteRef")
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
  ids.value = selection.map(item => item.siteId)
  single.value = selection.length != 1
  multiple.value = !selection.length
}

/** 新增按钮操作 */
function handleAdd() {
  reset()
  open.value = true
  title.value = "添加站点管理"
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset()
  const _siteId = row.siteId || ids.value
  getSite(_siteId).then(response => {
    form.value = response.data
    open.value = true
    title.value = "修改站点管理"
  })
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["siteRef"].validate(valid => {
    if (valid) {
      if (form.value.siteId != null) {
        updateSite(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功")
          open.value = false
          getList()
        })
      } else {
        addSite(form.value).then(response => {
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
  const _siteIds = row.siteId || ids.value
  proxy.$modal.confirm('是否确认删除站点管理编号为"' + _siteIds + '"的数据项？').then(function() {
    return delSite(_siteIds)
  }).then(() => {
    getList()
    proxy.$modal.msgSuccess("删除成功")
  }).catch(() => {})
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('cms/site/export', {
    ...queryParams.value
  }, `site_${new Date().getTime()}.xlsx`)
}

getList()
</script>
