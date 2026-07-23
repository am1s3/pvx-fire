'use client'
import { useEffect, useState } from 'react'
import { supabaseAdmin } from '@/lib/supabase'

export default function LuckPermsEditor() {
  const [groups, setGroups] = useState<any[]>([])
  const [permissions, setPermissions] = useState<any[]>([])
  const [selectedGroup, setSelectedGroup] = useState('')
  const [newPerm, setNewPerm] = useState('')
  const [newGroup, setNewGroup] = useState('')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    const { data: groupsData } = await supabaseAdmin.from('luckperms_groups').select('*').order('weight', { ascending: false })
    const { data: permsData } = await supabaseAdmin.from('luckperms_permissions').select('*')
    
    if (groupsData) setGroups(groupsData)
    if (permsData) setPermissions(permsData)
  }

  const addGroup = async () => {
    if (!newGroup) return
    await supabaseAdmin.from('luckperms_groups').insert({ name: newGroup, display_name: newGroup })
    setNewGroup('')
    loadData()
  }

  const addPermission = async () => {
    if (!selectedGroup || !newPerm) return
    await supabaseAdmin.from('luckperms_permissions').insert({
      group_name: selectedGroup,
      permission: newPerm,
      value: true,
    })
    setNewPerm('')
    loadData()
  }

  const removePermission = async (id: string) => {
    await supabaseAdmin.from('luckperms_permissions').delete().eq('id', id)
    loadData()
  }

  const assignGroupToUser = async (userId: string, groupName: string) => {
    await supabaseAdmin.from('users').update({ lp_group: groupName }).eq('id', userId)
    alert(`Группа ${groupName} назначена!`)
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-black text-gradient-animated mb-8">⚙️ Редактор LuckPerms</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Группы */}
          <div className="glass rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4">Группы</h2>
            <div className="flex gap-2 mb-4">
              <input
                value={newGroup}
                onChange={e => setNewGroup(e.target.value)}
                placeholder="Название группы"
                className="flex-1 bg-[#0a0a0a] border border-[#450a0a] rounded p-2 text-white"
              />
              <button onClick={addGroup} className="px-4 py-2 bg-red-600 rounded font-bold">Добавить</button>
            </div>
            <div className="space-y-2">
              {groups.map(group => (
                <div key={group.id} className="bg-[#0a0a0a] border border-[#450a0a] rounded p-3 flex justify-between items-center">
                  <div>
                    <div className="font-bold">{group.display_name || group.name}</div>
                    <div className="text-xs text-gray-500">Вес: {group.weight} | Префикс: {group.prefix}</div>
                  </div>
                  <button
                    onClick={() => setSelectedGroup(group.name)}
                    className={`px-3 py-1 rounded text-sm ${selectedGroup === group.name ? 'bg-red-600' : 'bg-[#171717]'}`}
                  >
                    Выбрать
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Права */}
          <div className="glass rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4">
              Права группы: {selectedGroup || 'Не выбрана'}
            </h2>
            <div className="flex gap-2 mb-4">
              <input
                value={newPerm}
                onChange={e => setNewPerm(e.target.value)}
                placeholder="essentials.fly"
                className="flex-1 bg-[#0a0a0a] border border-[#450a0a] rounded p-2 text-white"
              />
              <button onClick={addPermission} className="px-4 py-2 bg-red-600 rounded font-bold">Добавить</button>
            </div>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {permissions
                .filter(p => p.group_name === selectedGroup)
                .map(perm => (
                  <div key={perm.id} className="bg-[#0a0a0a] border border-[#450a0a] rounded p-3 flex justify-between items-center">
                    <div className="font-mono text-sm">{perm.permission}</div>
                    <button
                      onClick={() => removePermission(perm.id)}
                      className="px-3 py-1 bg-red-900/50 text-red-400 rounded text-sm"
                    >
                      Удалить
                    </button>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Назначение группы игроку */}
        <div className="glass rounded-xl p-6 mt-6">
          <h2 className="text-xl font-bold mb-4">Назначить группу игроку</h2>
          <div className="flex gap-2">
            <input
              id="userId"
              placeholder="UUID игрока"
              className="flex-1 bg-[#0a0a0a] border border-[#450a0a] rounded p-2 text-white"
            />
            <select
              id="groupName"
              className="bg-[#0a0a0a] border border-[#450a0a] rounded p-2 text-white"
            >
              {groups.map(g => <option key={g.id} value={g.name}>{g.name}</option>)}
            </select>
            <button
              onClick={() => {
                const userId = (document.getElementById('userId') as HTMLInputElement).value
                const groupName = (document.getElementById('groupName') as HTMLSelectElement).value
                if (userId && groupName) assignGroupToUser(userId, groupName)
              }}
              className="px-4 py-2 bg-red-600 rounded font-bold"
            >
              Назначить
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
