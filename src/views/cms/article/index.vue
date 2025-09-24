<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="站点编码" prop="siteCode" style="width: 250px">
        <el-select v-model="queryParams.siteCode"  @change="getTreeselect" placeholder="请输入站点编码">
          <el-option
            v-for="site in sites"
            :key="site.siteCode"
            :label="site.siteCode"
            :value="site.siteCode"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="栏目编码" prop="categoryCode" style="width: 250px">
        <el-tree-select
          v-model="queryParams.categoryCode"
          :data="categoryOptions"
          :props="{ value: 'categoryCode', label: 'categoryName', children: 'children' }"
          :default-expand-all="true"
          value-key="categoryCode"
          placeholder="请输入栏目编码"
          @node-click="categoryTreeClick"
          check-strictly
        />
      </el-form-item>
      <el-form-item label="内容标题" prop="title">
        <el-input
          v-model="queryParams.title"
          placeholder="请输入内容标题"
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
          v-hasPermi="['cms:article:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['cms:article:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['cms:article:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['cms:article:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="articleList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="文章编号" align="center" prop="articleId" />
      <el-table-column label="站点编码" align="center" prop="siteCode" />
      <el-table-column label="栏目编码" align="center" prop="categoryCode" />
      <el-table-column label="内容标题" align="center" prop="title" />
      <el-table-column label="关键字" align="center" prop="keywords" />
      <el-table-column label="宣传图片" align="center" prop="image" width="100">
        <template #default="scope">
          <image-preview :src="scope.row.image" :width="50" :height="50"/>
        </template>
      </el-table-column>
      <el-table-column label="通过审核" align="center" prop="isAudited">
        <template #default="scope">
          <dict-tag :options="sys_yes_no" :value="scope.row.isAudited"/>
        </template>
      </el-table-column>
      <el-table-column label="审核者" align="center" prop="auditBy" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['cms:article:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['cms:article:remove']">删除</el-button>
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

    <!-- 添加或修改文章管理对话框 -->
    <el-dialog :title="title" v-model="open" width="800px" append-to-body>
      <el-form ref="articleRef" :model="form" :rules="rules" label-width="80px">
        <el-row>
        <el-col :span="12">
          <el-form-item label="站点编码" prop="siteCode">
            <el-select v-model="form.siteCode" @change="getTreeselect" placeholder="请输入站点编码">
              <el-option
                v-for="site in sites"
                :key="site.siteCode"
                :label="site.siteCode"
                :value="site.siteCode"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
        <el-form-item label="栏目编码" prop="categoryCode">
          <el-tree-select
              v-model="form.categoryCode"
              :data="categoryOptions"
              :props="{ value: 'categoryCode', label: 'categoryName', children: 'children' }"
              value-key="categoryCode"
              placeholder="请选择栏目编码"
              check-strictly
              @node-click="categoryTreeClick"
            />
        </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="内容标题" prop="title">
            <el-input v-model="form.title" placeholder="请输入内容标题" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="关键字" prop="keywords">
            <el-input v-model="form.keywords" placeholder="请输入内容" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
        <el-form-item label="描述" prop="description">
          <el-input v-model="form.description" placeholder="请输入内容" />
        </el-form-item>
        </el-col>
        <el-form-item label="宣传图片" prop="image">
          <image-upload v-model="form.image"/>
        </el-form-item>
        <el-form-item label="文章内容">
          <editor v-model="form.content" :min-height="192"/>
        </el-form-item>
        <el-col :span="8">
          <el-form-item label="外部链接" prop="href">
            <el-input v-model="form.href" placeholder="请输入内容" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="权重" prop="weight">
            <el-input v-model="form.weight" placeholder="请输入权重" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="来源" prop="source">
            <el-input v-model="form.source" placeholder="请输入来源" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="文章出处" prop="copyFrom">
            <el-input v-model="form.copyFrom" placeholder="请输入文章出处" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="视图配置" prop="viewConfig">
            <el-input v-model="form.viewConfig" placeholder="请输入视图配置" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="通过审核" prop="isAudited">
            <el-select v-model="form.isAudited" placeholder="请选择通过审核">
              <el-option
                v-for="dict in sys_yes_no"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="审核者" prop="auditBy">
            <el-input v-model="form.auditBy" placeholder="请输入审核者" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
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
        <el-col :span="8">
          <el-form-item label="状态" prop="status">
            <el-radio-group v-model="form.status">
              <el-radio
                v-for="dict in sys_normal_disable"
                :key="dict.value"
                :label="dict.value"
              >{{dict.label}}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="24">
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

<script setup name="Article">
import { listArticle, getArticle, delArticle, addArticle, updateArticle } from "@/api/cms/article"
import useCmsStore from '@/store/modules/cms'
import { getSiteCategoryTree } from "@/utils/cms"

const cmsStore = useCmsStore()
const { sites } = storeToRefs(cmsStore)
const { proxy } = getCurrentInstance()
const { sys_yes_no, sys_normal_disable } = proxy.useDict('sys_yes_no', 'sys_normal_disable')

const articleList = ref([])
const open = ref(false)
const loading = ref(true)
const showSearch = ref(true)
const ids = ref([])
const single = ref(true)
const multiple = ref(true)
const total = ref(0)
const title = ref("")
const categoryOptions = ref([])

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    siteCode: null,
    categoryCode: null,
    title: null,
  },
  rules: {
    siteCode: [
      { required: true, message: "站点编码不能为空", trigger: "blur" }
    ],
    categoryCode: [
      { required: true, message: "栏目编码不能为空", trigger: "blur" }
    ],
    title: [
      { required: true, message: "内容标题不能为空", trigger: "blur" }
    ],
    status: [
      { required: true, message: "状态不能为空", trigger: "change" }
    ],
  }
})

const { queryParams, form, rules } = toRefs(data)

/** 查询文章管理列表 */
function getList() {
  loading.value = true
  listArticle(queryParams.value).then(response => {
    articleList.value = response.rows
    total.value = response.total
    loading.value = false
  })
}

/** 查询栏目管理下拉树结构 */
function getTreeselect(siteCode_) {
  categoryOptions.value = []
  categoryOptions.value.push(getSiteCategoryTree(siteCode_))
}

/** 栏目树点击事件处理 */
function categoryTreeClick(data, node, vm) {
  console.log("categoryTreeClick", data, node, vm, data.siteCode)
  if (data && data.siteCode) {
    queryParams.value.siteCode = data.siteCode;
    form.value.siteCode = data.siteCode;
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
    articleId: null,
    siteCode: null,
    categoryCode: null,
    title: null,
    keywords: null,
    description: null,
    image: null,
    content: null,
    href: null,
    weight: null,
    source: null,
    copyFrom: null,
    viewConfig: null,
    isAudited: null,
    auditBy: null,
    isCanComment: null,
    status: null,
    createBy: null,
    createTime: null,
    updateBy: null,
    updateTime: null,
    remarks: null,
    extendS1: null,
    extendS2: null
  }
  proxy.resetForm("articleRef")
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1
  getList()
}

/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm("queryRef")
  getTreeselect()
  handleQuery()
}

// 多选框选中数据
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.articleId)
  single.value = selection.length != 1
  multiple.value = !selection.length
}

/** 新增按钮操作 */
function handleAdd() {
  reset()
  open.value = true
  title.value = "添加文章管理"
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset()
  const _articleId = row.articleId || ids.value
  getArticle(_articleId).then(response => {
    form.value = response.data
    open.value = true
    title.value = "修改文章管理"
  })
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["articleRef"].validate(valid => {
    if (valid) {
      if (form.value.articleId != null) {
        updateArticle(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功")
          open.value = false
          getList()
        })
      } else {
        addArticle(form.value).then(response => {
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
  const _articleIds = row.articleId || ids.value
  proxy.$modal.confirm('是否确认删除文章管理编号为"' + _articleIds + '"的数据项？').then(function() {
    return delArticle(_articleIds)
  }).then(() => {
    getList()
    proxy.$modal.msgSuccess("删除成功")
  }).catch(() => {})
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('cms/article/export', {
    ...queryParams.value
  }, `article_${new Date().getTime()}.xlsx`)
}

getList()
getTreeselect()

</script>
