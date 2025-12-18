// allowedRoles = tableau des role_id autorisés (ex: [2,3] pour admin et super_admin)
export const checkRole = (allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json ({
                error: 'Utilisateur non identifié'
            });
        }

            // Vérifie si le rôle de l'utilisateur est autorisé
        if (!allowedRoles.includes(req.user.role_id)) {
            return res.status(403).json({
                error: 'Accès réservé à certains rôles'
            });
        }

        next();
    }
}