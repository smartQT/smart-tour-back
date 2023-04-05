<script>
import { isEmpty } from '@/utils/validate'

export default {
  data() {
    return {
      form: {
        productName: '',
        productLevel: '',
        address: '',
        longitude: '',
        latitude: '',
        maxAttendees: '',
        openTime: []
      },
      addressOptions: [
        {
          value: 'beijing',
          label: '北京市',
          children: [
            {
              value: 'dongcheng',
              label: '东城区'
            },
            {
              value: 'xicheng',
              label: '西城区'
            }
            // 其他区县
          ]
        },
        {
          value: 'shanghai',
          label: '上海市',
          children: [
            {
              value: 'huangpu',
              label: '黄浦区'
            },
            {
              value: 'xuhui',
              label: '徐汇区'
            }
            // 其他区县
          ]
        }
        // 其他省市
      ],
      addressProps: {
        value: 'value',
        label: 'label',
        children: 'children'
      },
      activeStep: 0
    }
  },
  methods: {
    submitForm() {
      this.$refs.form.validate(valid => {
        if (valid) {
          // 表单验证通过后在此处理添加操作
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm() {
      this.$refs.form.resetFields()

      this.activeStep = 0
    },

    // 点击下一步，触发方法
    handleNextClick() {
      this.activeStep++
    },
    // 点击上一步，触发方法
    handlePrevClick() {
      this.activeStep--
    }
  },
  beforeRouteEnter(to, from, next) {
    // 进入路由前，读取本地存储是否以及拥有相关信息
    const attractionInfo = JSON.parse(localStorage.getItem('new-acctraction-info'))

    if (!attractionInfo) {
      return next()
    }

    next(vm => {
      // 提醒用户是否使用本地存储的数据
      vm.$confirm('检测到之前已经填写相关数据, 是否恢复上次编辑?', '友情提醒', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        vm.form = attractionInfo
        vm.$message({
          type: 'success',
          message: '恢复数据成功!'
        })
      }).catch(() => {
        vm.$message({
          type: 'info',
          message: '取消恢复数据'
        })
      })
    })
  },

  beforeRouteLeave(to, from, next) {
    // 因为 form 里的 openTime 受组件影响，初始化加载后就一直保持有值，所以这里直接认为 openTime 为空数组，而经纬度初始化后默认为 0 ，为 0 默认认为是 空字符串
    const formInfo = { ...this.form, openTime: [], longitude: this.longitude === 0 ? '' : this.longitude, latitude: this.latitude === 0 ? '' : this.latitude }

    if (isEmpty(formInfo)) {
      return next()
    }

    // 离开页面前，提示用户进行相关操作
    this.$confirm('数据未提交，是否要离开此页面', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
      center: true
    }).then(() => {
      this.$message({ // 弹窗提示
        type: 'success',
        message: '离开成功!'
      })

      // 本地持久化存储数据
      localStorage.setItem('new-acctraction-info', JSON.stringify(this.form))

      // // 右上角消息提示
      this.$notify({
        title: '友情提醒',
        message: '数据已保存，重新进入后可以重新编辑',
        type: 'warning'
      })

      next()
    }).catch(() => {
      this.$message({
        type: 'info',
        message: '已取消离开'
      })
    })
  }
}
</script>

<template>
  <div class="app-container">
    <el-steps :active="activeStep" simple class="lvyou-attraction-add__step">
      <el-step title="基本信息" icon="el-icon-edit" />
      <!-- <el-step title="地理位置" icon="el-icon-upload" /> -->
      <el-step title="详细信息" icon="el-icon-picture" />
    </el-steps>

    <el-form ref="form" :model="form" label-width="100px">
      <el-form-item v-show="activeStep === 0" label="名称">
        <el-input v-model="form.productName" />
      </el-form-item>

      <el-form-item v-show="activeStep === 0" label="级别">
        <el-select v-model="form.productLevel">
          <el-option label="5A" value="5" />
          <el-option label="4A" value="4" />
          <el-option label="3A" value="3" />
        </el-select>
      </el-form-item>

      <el-form-item v-show="activeStep === 0" label="地址">
        <el-cascader
          v-model="form.address"
          :options="addressOptions"
          :props="addressProps"
          placeholder="请选择地址"
        />
      </el-form-item>

      <el-form-item v-show="activeStep === 0" label="最大人数">
        <el-input v-model="form.maxAttendees" />
      </el-form-item>

      <el-form-item v-show="activeStep === 1" label="经纬度">
        <div class="picker-group">
          <el-input-number v-model="form.longitude" :step="0.000001" :min="-180" :max="180" label="经度" />
          <span class="picker-separator" />
          <el-input-number v-model="form.latitude" :step="0.000001" :min="-90" :max="90" label="纬度" />
        </div>
      </el-form-item>

      <el-form-item v-show="activeStep === 1" label="开放时间">
        <el-time-picker
          v-model="form.openTime"
          is-range
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          placeholder="选择时间范围"
        />
      </el-form-item>

      <el-form-item v-show="activeStep === 1" label="相关图片">
        <el-upload
          class="upload-demo"
          drag
          action="https://jsonplaceholder.typicode.com/posts/"
          multiple
          list-type="picture"
        >
          <i class="el-icon-upload" />
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload>
      </el-form-item>

      <el-form-item v-show="activeStep === 1" class="lvyou-attraction-add__item">
        <el-button class="lvyou-attraction-add__btn" type="primary" @click="submitForm">确认</el-button>
        <el-button class="lvyou-attraction-add__btn" @click="resetForm">取消</el-button>
      </el-form-item>

      <el-form-item v-show="activeStep === 0" class="lvyou-attraction-add__item">
        <el-button v-show="activeStep === 1" class="lvyou-attraction-add__btn" type="primary" @click="handlePrevClick">上一步</el-button>
        <el-button class="lvyou-attraction-add__btn" type="primary" @click="handleNextClick">下一步</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<style lang="scss" scoped>
@import '@/styles/mixin.scss';

.lvyou-attraction-add__step {
  margin-bottom: 20px;
}

.lvyou-attraction-add__btn {
  width: 200px;
}

.picker-group {
  display: flex;
  align-items: center;
}
.picker-separator {
  margin-left: 10px;
  margin-right: 10px;
}
</style>
