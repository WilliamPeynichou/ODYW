import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { isSuperAdmin } from '../../../utils/authUtils';
import {
  getAllUsers,
  updateUser,
  deleteUser,
  updateUserPermissions,
  updateUserRole,
} from '../../../service/adminService';

const UserManagement = () => {
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

  const isSuperAdminUser = isSuperAdmin();

  // Charger les utilisateurs
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError('');
      // TODO: Une fois l'endpoint prêt, décommenter cette ligne
      // const usersData = await getAllUsers();
      
      // Simulation en attendant l'endpoint
      await new Promise(resolve => setTimeout(resolve, 500));
      const usersData = [
        { id: 1, username: 'admin1', email: 'admin1@test.com', role: 'admin', createdAt: '2024-01-01' },
        { id: 2, username: 'user1', email: 'user1@test.com', role: 'user', createdAt: '2024-01-02' },
      ];
      
      // Filtrer les superAdmin si l'utilisateur n'est pas superAdmin
      const filteredUsers = isSuperAdminUser
        ? usersData
        : usersData.filter(user => user.role !== 'superAdmin');
      
      setUsers(filteredUsers);
    } catch (err) {
      setError(err.message || 'Erreur lors du chargement des utilisateurs');
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = (user) => {
    setEditingUser({ ...user });
  };

  const handleSaveUser = async () => {
    if (!editingUser) return;

    try {
      setError('');
      const updatedUser = { ...editingUser };
      
      // Si le rôle a changé et que l'utilisateur est superAdmin, utiliser updateUserRole
      const originalUser = users.find(u => u.id === editingUser.id);
      if (originalUser && originalUser.role !== editingUser.role && isSuperAdminUser) {
        await updateUserRole(editingUser.id, editingUser.role);
      } else {
        // Sinon, utiliser updateUser normal
        await updateUser(editingUser.id, updatedUser);
      }
      
      setUsers(users.map(u => u.id === editingUser.id ? editingUser : u));
      setEditingUser(null);
      alert('Utilisateur mis à jour avec succès');
    } catch (err) {
      setError(err.message || 'Erreur lors de la mise à jour');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      return;
    }

    try {
      setError('');
      // TODO: Une fois l'endpoint prêt, décommenter cette ligne
      // await deleteUser(userId);
      
      // Simulation
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setUsers(users.filter(u => u.id !== userId));
      alert('Utilisateur supprimé avec succès');
    } catch (err) {
      setError(err.message || 'Erreur lors de la suppression');
    }
  };

  const handleOpenPermissionsModal = (user) => {
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
      // TODO: Une fois l'endpoint prêt, décommenter cette ligne
      // await updateUserPermissions(selectedUser.id, permissions);
      
      // Simulation
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setUsers(users.map(u =>
        u.id === selectedUser.id
          ? { ...u, permissions: { ...permissions } }
          : u
      ));
      setShowPermissionsModal(false);
      setSelectedUser(null);
      alert('Permissions mises à jour avec succès');
    } catch (err) {
      setError(err.message || 'Erreur lors de la mise à jour des permissions');
    }
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'superAdmin':
        return 'bg-purple-100 text-purple-800';
      case 'admin':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
            Les superAdmin ne sont pas visibles dans cette liste
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
                        value={editingUser.role}
                        onChange={(e) =>
                          setEditingUser({ ...editingUser, role: e.target.value })
                        }
                        className="px-2 py-1 border rounded"
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                        <option value="superAdmin">SuperAdmin</option>
                      </select>
                    ) : (
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleBadgeColor(
                          user.role
                        )}`}
                      >
                        {user.role}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString('fr-FR')}
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
                        {(user.role === 'admin' || user.role === 'superAdmin') && (
                          <button
                            onClick={() => navigate('/admin')}
                            className="px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors text-xs"
                            title="Accéder au panneau d'administration"
                          >
                            Admin
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

