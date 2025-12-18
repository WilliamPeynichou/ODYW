// Vérifie si le user actuel peut gérer le contenu d'un autre utilisateur
export const canManageContent = (currentUser, contentOwner) => {
    // Mapping des rôles par id
    const roleMap = {
        1: 'user',
        2: 'admin',
        3: 'super_admin'
    };

    // Rôle du user qui fait la request
    const currentRole = roleMap[currentUser.role_id];
    // Rôle du propriétaire du contenu
    const ownerRole = roleMap[contentOwner.role_id];

    // Super admin peut tout gérer
    if (currentRole === 'super_admin') return true;

    // Admin peut gérer le contenu des users seulement
    if (currentRole === 'admin' && ownerRole === 'user') return true;

    // User peut gérer son propre contenu
    if (currentRole.id === contentOwner.id) return true;

    // Sinon accès refusé
    return false;
}
