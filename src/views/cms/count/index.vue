<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="文章编号" prop="articleId">
        <el-input
          v-model="queryParams.articleId"
          placeholder="请输入文章编号"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="统计日期" prop="countDate">
        <el-date-picker clearable
          v-model="queryParams.countDate"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="请选择统计日期">
        </el-date-picker>
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
          v-hasPermi="['cms:count:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['cms:count:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['cms:count:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['cms:count:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="countList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="统计编号" align="center" prop="countId" />
      <el-table-column label="文章编号" align="center" prop="articleId" />
      <el-table-column label="统计日期" align="center" prop="countDate" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.countDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="总访问数" align="center" prop="views" />
      <el-table-column label="总评论数" align="center" prop="comments" />
      <el-table-column label="总下载数" align="center" prop="downloads" />
      <el-table-column label="总顶数" align="center" prop="ups" />
      <el-table-column label="总踩数" align="center" prop="downs" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['cms:count:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['cms:count:remove']">删除</el-button>
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

    <!-- 添加或修改文章统计对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="countRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="文章编号" prop="articleId">
          <el-input v-model="form.articleId" placeholder="请输入文章编号" />
        </el-form-item>
        <el-form-item label="统计日期" prop="countDate">
          <el-date-picker clearable
            v-model="form.countDate"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择统计日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="总访问数" prop="views">
          <el-input v-model="form.views" placeholder="请输入总访问数" />
        </el-form-item>
        <el-form-item label="总评论数" prop="comments">
          <el-input v-model="form.comments" placeholder="请输入总评论数" />
        </el-form-item>
        <el-form-item label="总下载数" prop="downloads">
          <el-input v-model="form.downloads" placeholder="请输入总下载数" />
        </el-form-item>
        <el-form-item label="总顶数" prop="ups">
          <el-input v-model="form.ups" placeholder="请输入总顶数" />
        </el-form-item>
        <el-form-item label="总踩数" prop="downs">
          <el-input v-model="form.downs" placeholder="请输入总踩数" />
        </el-form-item>
        <el-form-item label="备注信息" prop="remarks">
          <el-input v-model="form.remarks" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="扩展 String 1" prop="extendS1">
          <el-input v-model="form.extendS1" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="扩展 String 2" prop="extendS2">
          <el-input v-model="form.extendS2" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="扩展 Integer 1" prop="extendI1">
          <el-input v-model="form.extendI1" placeholder="请输入扩展 Integer 1" />
        </el-form-item>
        <el-form-item label="扩展 Integer 2" prop="extendI2">
          <el-input v-model="form.extendI2" placeholder="请输入扩展 Integer 2" />
        </el-form-item>
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

<script setup name="Count">
import { listCount, getCount, delCount, addCount, updateCount } from "@/api/cms/count"

const { proxy } = getCurrentInstance()

const countList = ref([])
const open = ref(false)
const loading = ref(true)
const showSearch = ref(true)
const ids = ref([])
const single = ref(true)
const multiple = ref(true)
const total = ref(0)
const title = ref("")

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    articleId: null,
    countDate: null,
  },
  rules: {
    articleId: [
      { required: true, message: "文章编号不能为空", trigger: "blur" }
    ],
    countDate: [
      { required: true, message: "统计日期不能为空", trigger: "blur" }
    ],
    views: [
      { required: true, message: "总访问数不能为空", trigger: "blur" }
    ],
    comments: [
      { required: true, message: "总评论数不能为空", trigger: "blur" }
    ],
    downloads: [
      { required: true, message: "总下载数不能为空", trigger: "blur" }
    ],
    ups: [
      { required: true, message: "总顶数不能为空", trigger: "blur" }
    ],
    downs: [
      { required: true, message: "总踩数不能为空", trigger: "blur" }
    ],
  }
})

const { queryParams, form, rules } = toRefs(data)

/** 查询文章统计列表 */
function getList() {
  loading.value = true
  listCount(queryParams.value).then(response => {
    countList.value = response.rows
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
    countId: null,
    articleId: null,
    countDate: null,
    views: null,
    comments: null,
    downloads: null,
    ups: null,
    downs: null,
    remarks: null,
    extendS1: null,
    extendS2: null,
    extendI1: null,
    extendI2: null
  }
  proxy.resetForm("countRef")
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
  ids.value = selection.map(item => item.countId)
  single.value = selection.length != 1
  multiple.value = !selection.length
}

/** 新增按钮操作 */
function handleAdd() {
  reset()
  open.value = true
  title.value = "添加文章统计"
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset()
  const _countId = row.countId || ids.value
  getCount(_countId).then(response => {
    form.value = response.data
    open.value = true
    title.value = "修改文章统计"
  })
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["countRef"].validate(valid => {
    if (valid) {
      if (form.value.countId != null) {
        updateCount(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功")
          open.value = false
          getList()
        })
      } else {
        addCount(form.value).then(response => {
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
  const _countIds = row.countId || ids.value
  proxy.$modal.confirm('是否确认删除文章统计编号为"' + _countIds + '"的数据项？').then(function() {
    return delCount(_countIds)
  }).then(() => {
    getList()
    proxy.$modal.msgSuccess("删除成功")
  }).catch(() => {})
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('cms/count/export', {
    ...queryParams.value
  }, `count_${new Date().getTime()}.xlsx`)
}

getList()
</script>
