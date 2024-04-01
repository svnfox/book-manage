import { basePermissions } from '@/config/settings'
import api from '@/api'

export async function getUserInfo() {
  const res = await api.getUser()
  const { id, username, profile, roles, currentRole } = res.data || {}
  return {
    id,
    username,
    avatar: profile?.avatar,
    nickName: profile?.nickName,
    gender: profile?.gender,
    address: profile?.address,
    email: profile?.email,
    roles,
    currentRole,
  }
}

export async function getPermissions() {
  // let asyncPermissions = []
  try {
    const res = await api.getRolePermissions()
    console.log(res)
    // asyncPermissions = res?.data || []
  } catch (error) {
    console.error(error)
  }
  // return basePermissions.concat(asyncPermissions)
  return basePermissions
}
