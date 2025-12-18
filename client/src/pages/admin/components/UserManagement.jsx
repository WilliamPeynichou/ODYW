import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getAllUsers,
  updateUser,
  deleteUser,
  updateUserPermissions,
  updateUserRole,
} from '../../../service/adminService';

const UserManagement = ({ isSuperAdmin = false }) => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [permissions, setPermissions] = useState({
    canManageUsers: false,
    canManageContent: false,
    canManageVideos: false,
    canManageThemes: false,
  });

  const isSuperAdminUser = isSuperAdmin;

  // Charger les utilisateurs
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Récupérer les utilisateurs depuis l'API
      const usersData = await getAllUsers();
      
      // Filtrer les utilisateurs avec role_id === 3 si l'utilisateur n'est pas superAdmin
      const filteredUsers = isSuperAdminUser
        ? usersData
        : usersData.filter(user => user.role_id !== 3);
      
      setUsers(filteredUsers);
    } catch (err) {
      console.error('Erreur lors du chargement des utilisateurs:', err);
      setError(err.message || 'Erreur lors du chargement des utilisateurs');
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = (user) => {
    // Empêcher les admins de modifier les superAdmins
    if (!isSuperAdminUser && user.role_id === 3) {
      alert('Vous n\'avez pas la permission de modifier les utilisateurs SuperAdmin');
      return;
    }
    setEditingUser({ ...user });
  };

  const handleSaveUser = async () => {
    if (!editingUser) return;

    try {
      setError('');
      const updatedUser = { ...editingUser };
      
      // Si le rôle a changé et que l'utilisateur est superAdmin, utiliser updateUserRole
      const originalUser = users.find(u => u.id === editingUser.id);
      if (originalUser && originalUser.role_id !== editingUser.role_id && isSuperAdminUser) {
        // Convertir le role_id en format attendu par l'API
        await updateUserRole(editingUser.id, editingUser.role_id);
        // Recharger la liste des utilisateurs après modification du rôle
        await loadUsers();
      } else {
        // Sinon, utiliser updateUser normal
        await updateUser(editingUser.id, updatedUser);
        // Mettre à jour localement
        setUsers(users.map(u => u.id === editingUser.id ? editingUser : u));
      }
      
      setEditingUser(null);
      alert('Utilisateur mis à jour avec succès');
    } catch (err) {
      setError(err.message || 'Erreur lors de la mise à jour');
    }
  };

  const handleDeleteUser = async (userId) => {
    const userToDelete = users.find(u => u.id === userId);
    
    // Empêcher les admins de supprimer les superAdmins
    if (!isSuperAdminUser && userToDelete && userToDelete.role_id === 3) {
      alert('Vous n\'avez pas la permission de supprimer les utilisateurs SuperAdmin');
      return;
    }

    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      return;
    }

    try {
      setError('');
      await deleteUser(userId);
      
      // Recharger la liste des utilisateurs après suppression
      await loadUsers();
      alert('Utilisateur supprimé avec succès');
    } catch (err) {
      setError(err.message || 'Erreur lors de la suppression');
    }
  };

  const handleOpenPermissionsModal = (user) => {
    // Seul le superAdmin peut gérer les permissions
    if (!isSuperAdminUser) {
      alert('Vous n\'avez pas la permission de gérer les permissions');
      return;
    }
    setSelectedUser(user);
    setPermissions({
      canManageUsers: user.permissions?.canManageUsers || false,
      canManageContent: user.permissions?.canManageContent || false,
      canManageVideos: user.permissions?.canManageVideos || false,
      canManageThemes: user.permissions?.canManageThemes || false,
    });
    setShowPermissionsModal(true);
  };

  const handleSavePermissions = async () => {
    if (!selectedUser || !isSuperAdminUser) return;

    try {
      setError('');
      await updateUserPermissions(selectedUser.id, permissions);
      
      // Recharger la liste des utilisateurs après modification des permissions
      await loadUsers();
      setShowPermissionsModal(false);
      setSelectedUser(null);
      alert('Permissions mises à jour avec succès');
    } catch (err) {
      setError(err.message || 'Erreur lors de la mise à jour des permissions');
    }
  };

  const getRoleBadgeColor = (roleId) => {
    switch (roleId) {
      case 3:
        return 'bg-purple-100 text-purple-800';
      case 2:
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleName = (roleId) => {
    switch (roleId) {
      case 3:
        return 'SuperAdmin';
      case 2:
        return 'Admin';
      case 1:
        return 'User';
      default:
        return 'User';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Gestion des utilisateurs</h2>
        {!isSuperAdminUser && (
          <p className="text-sm text-gray-500">
            Les utilisateurs SuperAdmin (role_id: 3) ne sont pas visibles dans cette liste
          </p>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Utilisateur
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rôle
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date de création
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                  Aucun utilisateur trouvé
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingUser?.id === user.id ? (
                      <input
                        type="text"
                        value={editingUser.username}
                        onChange={(e) =>
                          setEditingUser({ ...editingUser, username: e.target.value })
                        }
                        className="px-2 py-1 border rounded"
                      />
                    ) : (
                      <div className="text-sm font-medium text-gray-900">{user.username}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingUser?.id === user.id ? (
                      <input
                        type="email"
                        value={editingUser.email}
                        onChange={(e) =>
                          setEditingUser({ ...editingUser, email: e.target.value })
                        }
                        className="px-2 py-1 border rounded"
                      />
                    ) : (
                      <div className="text-sm text-gray-500">{user.email}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingUser?.id === user.id && isSuperAdminUser ? (
                      <select
                        value={editingUser.role_id}
                        onChange={(e) =>
                          setEditingUser({ ...editingUser, role_id: Number(e.target.value) })
                        }
                        className="px-2 py-1 border rounded"
                      >
                        <option value={1}>User</option>
                        <option value={2}>Admin</option>
                        <option value={3}>SuperAdmin</option>
                      </select>
                    ) : (
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleBadgeColor(
                          user.role_id || user.role
                        )}`}
                      >
                        {getRoleName(user.role_id || (user.role === 'superAdmin' ? 3 : user.role === 'admin' ? 2 : 1))}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.created_at 
                      ? new Date(user.created_at).toLocaleDateString('fr-FR')
                      : user.createdAt 
                        ? new Date(user.createdAt).toLocaleDateString('fr-FR')
                        : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {editingUser?.id === user.id ? (
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={handleSaveUser}
                          className="text-green-600 hover:text-green-900"
                        >
                          Enregistrer
                        </button>
                        <button
                          onClick={() => setEditingUser(null)}
                          className="text-gray-600 hover:text-gray-900"
                        >
                          Annuler
                        </button>
                      </div>
                    ) : (
                      <div className="flex justify-end gap-2">
                        {(user.role_id === 2 || user.role_id === 3) && (
                          <button
                            onClick={() => navigate(user.role_id === 3 ? '/superadmin' : '/admin')}
                            className={`px-3 py-1 text-white rounded hover:opacity-90 transition-colors text-xs ${
                              user.role_id === 3 ? 'bg-purple-600' : 'bg-blue-600'
                            }`}
                            title="Accéder au panneau d'administration"
                          >
                            {user.role_id === 3 ? 'SuperAdmin' : 'Admin'}
                          </button>
                        )}
                        <button
                          onClick={() => handleEditUser(user)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Modifier
                        </button>
                        {isSuperAdminUser && (
                          <button
                            onClick={() => handleOpenPermissionsModal(user)}
                            className="text-purple-600 hover:text-purple-900"
                          >
                            Droits
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Supprimer
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal pour les permissions (seulement pour superAdmin) */}
      {showPermissionsModal && isSuperAdminUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-bold mb-4">
              Gérer les droits de {selectedUser?.username}
            </h3>
            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={permissions.canManageUsers}
                  onChange={(e) =>
                    setPermissions({ ...permissions, canManageUsers: e.target.checked })
                  }
                  className="mr-2"
                />
                Gérer les utilisateurs
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={permissions.canManageContent}
                  onChange={(e) =>
                    setPermissions({ ...permissions, canManageContent: e.target.checked })
                  }
                  className="mr-2"
                />
                Gérer le contenu
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={permissions.canManageVideos}
                  onChange={(e) =>
                    setPermissions({ ...permissions, canManageVideos: e.target.checked })
                  }
                  className="mr-2"
                />
                Gérer les vidéos
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={permissions.canManageThemes}
                  onChange={(e) =>
                    setPermissions({ ...permissions, canManageThemes: e.target.checked })
                  }
                  className="mr-2"
                />
                Gérer les thèmes
              </label>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowPermissionsModal(false);
                  setSelectedUser(null);
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
              >
                Annuler
              </button>
              <button
                onClick={handleSavePermissions}
                className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
              >
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;

