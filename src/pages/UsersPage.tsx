import AddIcon from '@mui/icons-material/Add'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography'
import { useState } from 'react'
import { AsyncState } from '../components/AsyncState'
import { UserCard } from '../components/UserCard'
import { UserFormDialog } from '../components/UserFormDialog'
import { useUsers } from '../hooks/useUsers'
import type { NewUser, User } from '../services/userService'

export function UsersPage() {
  const { users, loading, error, saving, addUser, editUser, removeUser } =
    useUsers()

  const [createOpen, setCreateOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)

  async function handleCreate(data: NewUser) {
    const ok = await addUser(data)
    if (ok) setCreateOpen(false)
  }

  function handleStartEdit(user: User) {
    setEditingUser(user)
    setEditOpen(true)
  }

  async function handleEdit(data: NewUser) {
    if (!editingUser) return
    const ok = await editUser(editingUser.id, data)
    if (ok) {
      setEditOpen(false)
      setEditingUser(null)
    }
  }

  async function handleDelete(user: User) {
    const confirmed = window.confirm(
      `¿Eliminar a ${user.name}? Esta acción no se puede deshacer.`,
    )
    if (!confirmed) return
    await removeUser(user.id)
  }

  return (
    <>
      <Stack spacing={3}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h4">Usuarios</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setCreateOpen(true)}
          >
            Nuevo usuario
          </Button>
        </Stack>

        <AsyncState loading={loading} error={error} empty={!users.length}>
          <Grid container spacing={2}>
            {users.map((user) => (
              <Grid key={user.id} size={{ xs: 12, sm: 6, md: 4 }} sx={{ display: 'flex' }}>
                <UserCard
                  user={user}
                  onEdit={handleStartEdit}
                  onDelete={handleDelete}
                />
              </Grid>
            ))}
          </Grid>
        </AsyncState>
      </Stack>

      <UserFormDialog
        open={createOpen}
        title="Nuevo usuario"
        saving={saving}
        onClose={() => setCreateOpen(false)}
        onSubmit={handleCreate}
      />

      <UserFormDialog
        open={editOpen}
        title="Editar usuario"
        saving={saving}
        initial={
          editingUser
            ? {
                name: editingUser.name,
                username: editingUser.username,
                email: editingUser.email,
              }
            : undefined
        }
        onClose={() => {
          setEditOpen(false)
          setEditingUser(null)
        }}
        onSubmit={handleEdit}
      />
    </>
  )
}