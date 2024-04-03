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
      :get-data="api.read"
    >
      <MeQueryItem label="标题" :label-width="50">
        <n-input
          v-model:value="queryItems.title"
          type="text"
          placeholder="请输入标题"
          clearable
        />
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
          label="用户名"
          path="title"
          :rule="{
            required: true,
            message: '请输入用户名',
            trigger: ['input', 'blur'],
          }"
        >
          <n-input v-model:value="modalForm.title" :disabled="modalAction !== 'add'" />
        </n-form-item>

        <n-form-item v-if="['add', 'setRole'].includes(modalAction)" label="角色" path="roleIds">
          <n-select
            v-model:value="modalForm.roleIds"
            :options="roles"
            label-field="name"
            value-field="id"
            clearable
            filterable
            multiple
          />
        </n-form-item>
      </n-form>
      <n-alert v-if="modalAction === 'add'" type="warning" closable>
        详细信息需由用户本人补充修改
      </n-alert>
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

const columns = [
  {
    title: '序号',
    key: 'no',
    width: 50,
    render: (_, index) => {
      return `${index + 1}`
    },
  },
  { title: '标题', key: 'title', width: 150, ellipsis: { tooltip: true } },
  {
    title: '创建时间',
    key: 'createDate',
    width: 180,
    render(row) {
      return h('span', formatDateTime(row['createTime']))
    },
  },
  {
    title: '状态',
    key: 'enable',
    width: 120,
    render: (row) =>
      h(
        NSwitch,
        {
          size: 'small',
          rubberBand: false,
          value: row.enable,
          loading: !!row.enableLoading,
          onUpdateValue: () => handleEnable(row),
        },
        {
          checked: () => '启用',
          unchecked: () => '停用',
        }
      ),
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

async function handleEnable(row) {
  row.enableLoading = true
  try {
    await api.update({ id: row.id, enable: !row.enable })
    row.enableLoading = false
    $message.success('操作成功')
    $table.value?.handleSearch()
  } catch (error) {
    row.enableLoading = false
  }
}

function handleOpenRolesSet(row) {
  const roleIds = row.roles.map((item) => item.id)
  handleOpen({
    action: 'setRole',
    title: '分配角色',
    row: { id: row.id, title: row.title, roleIds },
    onOk: onSave,
  })
}

const {
  modalRef,
  modalFormRef,
  modalForm,
  modalAction,
  handleAdd,
  handleDelete,
  handleOpen,
  handleSave,
  handleEdit,
} = useCrud({
  name: '用户',
  initForm: { enable: true },
  doCreate: api.create,
  doDelete: api.delete,
  doUpdate: api.update,
  refresh: () => $table.value?.handleSearch(),
})

function onSave() {
  if (modalAction.value === 'setRole') {
    return handleSave({
      api: () => api.update(modalForm.value),
      cb: () => $message.success('分配成功'),
    })
  } else if (modalAction.value === 'reset') {
    return handleSave({
      api: () => api.resetPwd(modalForm.value.id, modalForm.value),
      cb: () => $message.success('密码重置成功'),
    })
  }
  handleSave()
}
</script>
