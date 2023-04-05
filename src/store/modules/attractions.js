import { fetchList, fetchTotal } from '@/api/attractions'

const state = {
  currentList: { page: 0, size: 0, list: {} },
  total: 0
}

const mutations = {
  UPDATE_LIST(state, info) {
    Object.keys(state.currentList).forEach(key => {
      state.currentList[key] = info[key] ?? null
    })
  },
  SET_TOTAL(state, count) {
    state.total = count
  }
}

const actions = {
  fetchList({ commit }, { page = 1, size = 10 }) {
    return new Promise((resolve, reject) => {
      fetchList({ page, size }).then(
        res => {
          if (res.code === -1) reject(res.errorMsg)

          commit('UPDATE_LIST', { page, ...res.data })

          resolve(res.data)
        },
        err => {
          reject(err)
        }
      )
    })
  },
  fetchTotal({ commit }, info) {
    return new Promise((resolve, reject) => {
      fetchTotal(info).then(
        res => {
          if (res.code === -1) reject(res)

          const { total } = res.data
          commit('SET_TOTAL', total)

          resolve(total)
        },
        err => {
          reject(err)
        }
      )
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}