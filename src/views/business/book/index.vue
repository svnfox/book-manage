<template>
  <CommonPage>
    <template #action>
      <n-button type="primary" @click="handleAdd()">
        <i class="i-material-symbols:add mr-4 text-18" />
        新建
      </n-button>
    </template>

    <MeCrud
      ref="$table"
      v-model:query-items="queryItems"
      :scroll-x="1200"
      :columns="columns"
      :get-data="getBookList"
    >
      <MeQueryItem label="书名" :label-width="50">
        <n-input v-model:value="queryItems.title" type="text" placeholder="请输入书名" clearable />
      </MeQueryItem>
      <MeQueryItem label="作者" :label-width="50">
        <n-input v-model:value="queryItems.author" type="text" placeholder="请输入作者" clearable />
      </MeQueryItem>
      <MeQueryItem label="ISBN" :label-width="50">
        <n-input v-model:value="queryItems.isbn" type="text" placeholder="请输入ISBN" clearable />
      </MeQueryItem>
    </MeCrud>

    <MeModal ref="modalRef" width="520px">
      <n-form
        ref="modalFormRef"
        label-placement="left"
        label-align="left"
        :label-width="80"
        :model="modalForm"
        :disabled="modalAction === 'view'"
      >
        <n-form-item
          label="书名"
          path="title"
          :rule="{
            required: true,
            message: '请输入书名',
            trigger: ['input', 'blur'],
          }"
        >
          <n-input v-model:value.trim="modalForm.title" />
        </n-form-item>

        <n-form-item
          label="作者"
          path="title"
          :rule="{
            required: true,
            message: '请输入作者名',
            trigger: ['input', 'blur'],
          }"
        >
          <n-input v-model:value.trim="modalForm.author" />
        </n-form-item>

        <n-form-item
          label="年份"
          path="title"
          :rule="{
            required: true,
            message: '请选择年份',
            trigger: ['input', 'blur'],
          }"
        >
          <n-date-picker
            v-model:formatted-value="modalForm.date"
            type="date"
            value-format="yyyy-MM-dd"
          />
        </n-form-item>

        <n-form-item
          label="ISBN"
          path="title"
          :rule="{
            required: true,
            message: '请输入ISBN',
            trigger: ['input', 'blur'],
          }"
        >
          <n-input v-model:value.trim="modalForm.isbn" />
        </n-form-item>
      </n-form>
    </MeModal>
  </CommonPage>
</template>

<script setup>
import { NAvatar, NButton, NSwitch, NTag } from 'naive-ui'
import { formatDateTime } from '@/utils'
import { MeCrud, MeQueryItem, MeModal } from '@/components'
import { useCrud } from '@/composables'
import api from './api'

defineOptions({ name: 'UserMgt' })

const $table = ref(null)
/** QueryBar筛选参数（可选） */
const queryItems = ref({})

onMounted(() => {
  $table.value?.handleSearch()
})

const genders = [
  { label: '男', value: 1 },
  { label: '女', value: 2 },
]
const roles = ref([])
api.getAllRoles().then(({ data = [] }) => (roles.value = data))

let data = reactive([])
data.value = [
  {
    id: 0,
    title: '朝花夕拾',
    author: '老舍',
    date: '2019-02-02',
    isbn: 'YSN2332323',
  },
]

let originData = toRaw(data.value)
console.log(originData, 'bbb')

function getBookList() {
  console.log(originData, 'originValue')
  data.value = originData

  return new Promise((resolve) => {
    if (queryItems.value.title) {
      data.value = data.value.filter(
        (item) =>
          item.title.includes(queryItems.value.title)
      )
    }
    if (queryItems.value.author) {
      data.value = data.value.filter(
        (item) =>
          item.author.includes(queryItems.value.author)
      )
    }
    if (queryItems.value.isbn) {
      data.value = data.value.filter(
        (item) =>
          item.isbn.includes(queryItems.value.isbn)
      )
    }

    setTimeout(() => {
      resolve({
        data: data.value,
      })
    }, 1000)
  })
}

const columns = [
  {
    title: '序号',
    key: 'no',
    width: 50,
    render: (_, index) => {
      return `${index + 1}`
    },
  },
  { title: '书名', key: 'title', width: 150, ellipsis: { tooltip: true } },
  { title: '作者', key: 'author', width: 150, ellipsis: { tooltip: true } },
  { title: '年份', key: 'date', width: 150, ellipsis: { tooltip: true } },
  { title: 'ISBN', key: 'isbn', width: 150, ellipsis: { tooltip: true } },
  {
    title: '创建时间',
    key: 'createDate',
    width: 180,
    render(row) {
      return h('span', formatDateTime(row['createTime']))
    },
  },
  {
    title: '操作',
    key: 'actions',
    width: 320,
    align: 'right',
    fixed: 'right',
    hideInExcel: true,
    render(row) {
      return [
        h(
          NButton,
          {
            size: 'small',
            type: 'primary',
            style: 'margin-left: 12px;',
            disabled: row.code === 'SUPER_ADMIN',
            onClick: () => handleEdit(row),
          },
          {
            default: () => '编辑',
            icon: () => h('i', { class: 'i-material-symbols:edit-outline text-14' }),
          }
        ),

        h(
          NButton,
          {
            size: 'small',
            type: 'error',
            style: 'margin-left: 12px;',
            onClick: () => handleDelete(row.id),
          },
          {
            default: () => '删除',
            icon: () => h('i', { class: 'i-material-symbols:delete-outline text-14' }),
          }
        ),
      ]
    },
  },
]

const {
  modalRef,
  modalFormRef,
  modalForm,
  modalAction,
  handleAdd,
  handleDelete,
  handleSave,
  handleEdit,
} = useCrud({
  name: '书籍',
  initForm: { enable: true },
  doCreate: handleCreate,
  doDelete: doDelete,
  doUpdate: doEdit,
  refresh: () => $table.value?.handleSearch(),
})

function handleCreate() {
  return new Promise((resolve) => {
    resolve({
      data: {},
    })
    data.value.push({
      id: data.value.length,
      ...modalForm.value,
    })
    originData = data.value
    $message.success('添加成功')
  })
}

function doEdit(rowP) {
  let row = toRaw(rowP)
  console.log(row, 'hh')
  data.value.forEach((item) => {
    if (item.id === row.id) {
      item.title = row.title
      item.author = row.author
      item.isbn = row.isbn
      item.date = row.date
      item.year = row.year
    }
  })
  originData = data.value
  $message.success('编辑成功')
}

function doDelete(id) {
  let targetIndex = data.value.findIndex((item) => item.id === id)
  data.value.splice(targetIndex, 1)
  originData = data.value
}
</script>
