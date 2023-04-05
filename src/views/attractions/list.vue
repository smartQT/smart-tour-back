<script>
import { mapActions } from 'vuex'

export default {
  data() {
    return {
      products: [], // 旅游产品数据
      product: { // 当前编辑的旅游产品数据
        id: '',
        name: '',
        level: '',
        address: '',
        latitude: '',
        longitude: '',
        max_people: '',
        open_time: '',
        status: ''
      },
      dialogVisible: false, // 编辑旅游产品对话框的显示状态
      dialogTitle: '', // 编辑旅游产品对话框的标题
      dialogWidth: '50%', // 编辑旅游产品对话框的宽度
      rules: { // 编辑旅游产品表单的校验规则
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        level: [
          { required: true, message: '请输入级别', trigger: 'blur' }
        ],
        address: [
          { required: true, message: '请输入地址', trigger: 'blur' }
        ],
        longitude: [
          { required: true, message: '请输入经度', trigger: 'blur' }
        ],
        latitude: [
          { required: true, message: '请输入纬度', trigger: 'blur' }
        ],
        max_people: [
          { required: true, message: '请输入最大人数', trigger: 'blur' }
        ],
        open_time: [
          { required: true, message: '请输入开放时间', trigger: 'blur' }
        ]
      },

      currentPage: 1, // 当前页码
      pageSize: 10, // 每页显示的条数
      total: 100 // 总记录数
    }
  },
  mounted() {
    // TODO: 发送请求获取旅游产品数据
    this.fetchAccractionCount().then(
      res => {
        this.total = res
      },
      err => {
        console.log(err)
      }
    )
    this.getTableData() // 在组件挂载后，获取第一页的数据
  },
  methods: {
    ...mapActions({
      fetchAccractionList: 'attractions/fetchList',
      fetchAccractionCount: 'attractions/fetchTotal'
    }),
    // 编辑旅游产品
    editProduct(row) {
      this.dialogTitle = '编辑旅游产品'
      this.dialogWidth = '50%'
      this.product = Object.assign({}, row)
      this.dialogVisible = true
    },
    // 删除旅游产品
    deleteProduct(row) {
      // TODO: 发送请求删除旅游产品
      console.log(`删除旅游产品 ${row.id}`)
    },
    // 提交旅游产品表单
    submitForm() {
      this.$refs.productForm.validate(valid => {
        if (valid) {
          // TODO: 发送请求保存旅游产品
          console.log(`保存旅游产品 ${this.product.id}`)
          this.dialogVisible = false
        }
      })
    },
    // 关闭编辑旅游产品对话框前的处理
    beforeCloseDialog(done) {
      this.$confirm('确定关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    },

    // 发布景区
    handlePublish(row) {
      this.$confirm('您确定要发布该景区吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
      // 确认发布操作
        row.status = '已发布' // 假设修改状态成功
        this.$message({
          type: 'success',
          message: '发布成功!'
        })
      }).catch(() => {
      // 取消操作
        this.$message({
          type: 'info',
          message: '已取消发布'
        })
      })
    },

    // 下架景区
    handleUnpublish(row) {
      // 这里可以添加您的逻辑代码，比如向后端发送请求来修改状态为“草稿”
      this.$confirm('您确定要下架该景区吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
      // 确认发布操作
        row.status = '草稿' // 假设修改状态成功
        this.$message({
          type: 'success',
          message: '下架成功!'
        })
      }).catch(() => {
      // 取消操作
        this.$message({
          type: 'info',
          message: '已取消下架'
        })
      })
    },

    // 编辑景区
    edit(row) {
      // 这里可以添加您的逻辑代码，比如跳转到编辑页面
      console.log('编辑景区', row)
    },

    // 删除景区
    remove(row) {
      // 这里可以添加您的逻辑代码，比如向后端发送请求来删除该景区
      console.log('删除景区', row)
    },

    // 获取表格数据的方法
    getTableData() {
      // 根据 currentPage 和 pageSize 获取对应的数据
      // 例如：this.tableData = getDataFromServer(this.currentPage, this.pageSize);
      const { currentPage, pageSize } = this
      this.fetchAccractionList({ page: currentPage, size: pageSize }).then(
        ({ list, size }) => {
          this.pageSize = Number(size)
          this.products = list
        },
        err => {
          console.log(err)
        }
      )
    },

    // 当用户点击页码时，调用该方法
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage
      this.getTableData()
    },

    // 当用户更改每页内容条数时，调用该方法
    handleSizeChange(newSize) {
      this.pageSize = newSize
      this.getTableData()
    }
  }
}
</script>

<template>
  <div class="app-container">
    <el-table :data="products" stripe border>
      <el-table-column prop="id" label="编号" />
      <el-table-column prop="name" label="名称" />
      <el-table-column prop="level" label="级别" />
      <el-table-column prop="address" label="地址" />
      <el-table-column prop="latitude" label="纬度" />
      <el-table-column prop="longitude" label="经度" />
      <el-table-column prop="max_people" label="最大人数" />
      <el-table-column prop="open_time" label="开放时间" />
      <el-table-column prop="status" label="状态" width="100">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status === '已发布' ? 'success' : 'warning'">{{ scope.row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="300">
        <template slot-scope="scope">
          <el-button type="success" @click="editProduct(scope.row)">编辑</el-button>
          <el-button v-if="scope.row.status === '草稿'" type="primary" @click="handlePublish(scope.row)">发布</el-button>
          <el-button v-if="scope.row.status === '已发布'" type="danger" @click="handleUnpublish(scope.row)">下架</el-button>
          <el-button @click="deleteProduct(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      :current-page="currentPage"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      class="my-pagination"
      background
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    />

    <el-dialog :visible.sync="dialogVisible" :title="dialogTitle" :width="dialogWidth" :before-close="beforeCloseDialog">
      <el-form ref="productForm" :model="product" :rules="rules">
        <el-form-item label="名称" prop="name">
          <el-input v-model="product.name" />
        </el-form-item>
        <el-form-item label="级别" prop="level">
          <el-input v-model="product.level" />
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model="product.address" />
        </el-form-item>
        <el-form-item label="经度" prop="longitude">
          <el-input v-model="product.longitude" />
        </el-form-item>
        <el-form-item label="纬度" prop="latitude">
          <el-input v-model="product.latitude" />
        </el-form-item>
        <el-form-item label="最大人数" prop="max_people">
          <el-input v-model="product.max_people" />
        </el-form-item>
        <el-form-item label="开放时间" prop="open_time">
          <el-input v-model="product.open_time" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="product.status">
            <el-radio :label="0">已上架</el-radio>
            <el-radio :label="1">草稿</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<style>
.product-list {
  margin-top: 20px;
}
.product-list .el-table .cell {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.product-list .el-table .cell.ellipsis {
  max-width: 100px;
}
.product-list .el-dialog__body {
  padding: 20px;
}
.product-list .el-dialog__footer {
  padding: 10px 20px;
  text-align: right;
}
</style>