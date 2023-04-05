const Mock = require('mockjs')
const { formatTime } = require('./utils')

Mock.Random.extend({
  openTime: function () {
    const hour1 = formatTime(Mock.Random.integer(0, 23))
    const hour2 = formatTime(Mock.Random.integer(hour1, 23))
    const minute1 = formatTime(Mock.Random.integer(0, 59))
    const minute2 = formatTime(Mock.Random.integer(0, 59))
    return `${hour1}:${minute1} - ${hour2}:${minute2}`
  }
})