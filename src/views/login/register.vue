<template>
  <div class="login-container">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" autocomplete="on" label-position="left">

      <div class="title-container">
        <h3 class="title">注册</h3>
      </div>

      <el-form-item prop="phone">
        <span class="svg-container">
          <svg-icon icon-class="phone" />
        </span>
        <el-input
          ref="phone"
          v-model="loginForm.phone"
          placeholder="手机号"
          name="phone"
          type="phone"
          tabindex="1"
          autocomplete="on"
        />
      </el-form-item>

      <el-tooltip v-model="capsTooltip" content="Caps lock is On" placement="right" manual>
        <el-form-item prop="password">
          <span class="svg-container">
            <svg-icon icon-class="password" />
          </span>
          <el-input
            :key="passwordType"
            ref="password"
            v-model="loginForm.password"
            :type="passwordType"
            placeholder="密码"
            name="password"
            tabindex="2"
            autocomplete="on"
            @keyup.native="checkCapslock"
            @blur="capsTooltip = false"
            @keyup.enter.native="handleRegister"
          />
          <span class="show-pwd" @click="showPwd">
            <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
          </span>
        </el-form-item>
      </el-tooltip>

      <el-form-item prop="email">
        <span class="svg-container">
          <svg-icon icon-class="email" />
        </span>
        <el-input
          ref="email"
          v-model="loginForm.email"
          placeholder="邮箱"
          name="email"
          type="email"
          tabindex="3"
          autocomplete="on"
        />
        <el-button class="verifyEmail-button" type="info" @click.native.prevent="handleVertifyEmail">发送验证码</el-button>
      </el-form-item>

      <el-form-item prop="code" :error="codeErrorMessage">
        <span class="svg-container">
          <svg-icon icon-class="code" />
        </span>
        <el-input
          ref="code"
          v-model="loginForm.code"
          placeholder="验证码"
          name="code"
          type="code"
          tabindex="4"
          autocomplete="on"
        />
      </el-form-item>

      <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;" @click.native.prevent="handleRegister">Register</el-button>
    </el-form></div>
</template>

<script>
import { validEmail, validPhone } from '@/utils/validate'
import { Message } from 'element-ui'

export default {
  name: 'Login',
  data() {
    const validatePhone = (rule, value, callback) => {
      if (!validPhone(value)) {
        callback(new Error('请输入正确的手机号'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码长度不能小于 6 位'))
      } else {
        callback()
      }
    }
    const validateEmail = (rule, value, callback) => {
      if (!validEmail(value)) {
        callback(new Error('请输入正确的邮箱'))
      } else {
        callback()
      }
    }
    const validateCode = (rule, value, callback) => {
      if (value.length !== 6) {
        callback(new Error('验证码格式错误'))
      } else {
        callback()
      }
    }

    return {
      loginForm: {
        phone: '19830441067',
        password: '111111',
        email: '1372137936@qq.com',
        code: ''
      },
      loginRules: {
        phone: [{ required: true, trigger: 'blur', validator: validatePhone }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }],
        email: [{ required: true, trigger: 'blur', validator: validateEmail }],
        code: [{ required: true, trigger: 'blur', validator: validateCode }]
      },
      passwordType: 'password',
      capsTooltip: false,
      // isSended: false,
      loading: false,
      showDialog: false,
      codeErrorMessage: ''
    }
  },
  created() {
    // window.addEventListener('storage', this.afterQRScan)
  },
  mounted() {
    if (this.loginForm.email === '') {
      this.$refs.email.focus()
    }
  },
  destroyed() {
    // window.removeEventListener('storage', this.afterQRScan)
  },
  methods: {
    checkCapslock(e) {
      const { key } = e
      this.capsTooltip = key && key.length === 1 && (key >= 'A' && key <= 'Z')
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleRegister() {
      this.$refs.loginForm.validate(valid => {
        if (!valid) {
          console.log('error submit!!')
          return false
        }

        this.loading = true

        this.$store.dispatch('user/register', this.loginForm)
          .then(res => {
            Message.success({
              message: '注册成功',
              onClose: () => {
                this.$router.push({ path: '/login' })
                this.loading = false
              }
            })
          })
          .catch(error => {
            this.loading = false

            if (error === '验证码错误') {
              this.loginForm.code = ''
              this.codeErrorMessage = error
            }
          })
      })
    },
    handleVertifyEmail() {
      this.$refs.loginForm.validateField('email', error => {
        if (!error) {
          this.$store.dispatch('user/registerEmail', this.loginForm)
            .then(() => {
            // this.$router.push({ path: this.redirect || '/', query: this.otherQuery })
            // this.loading = false
            })
            .catch(() => {
              this.loading = false
            })
        }
      })
    }
  }
  // afterQRScan() {
  //   if (e.key === 'x-admin-oauth-code') {
  //     const code = getQueryObject(e.newValue)
  //     const codeMap = {
  //       wechat: 'code',
  //       tencent: 'code'
  //     }
  //     const type = codeMap[this.auth_type]
  //     const codeName = code[type]
  //     if (codeName) {
  //       this.$store.dispatch('LoginByThirdparty', codeName).then(() => {
  //         this.$router.push({ path: this.redirect || '/' })
  //       })
  //     } else {
  //       alert('第三方登录失败')
  //     }
  //   }
  // }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg:#283443;
$light_gray:#fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }

  .thirdparty-button {
    position: absolute;
    right: 0;
    bottom: 6px;
  }

  .verifyEmail-button {
    position: absolute;
    right: -10px;
    top: 50%;
    transform: translate(100%, -50%);
  }

  @media only screen and (max-width: 470px) {
    .thirdparty-button {
      display: none;
    }
  }
}
</style>
