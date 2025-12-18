import { pool } from "../db/index.js";

// Récupérer tous les utilisateurs (admin et superAdmin)
export const getAllUsers = async (req, res) => {
    try {
        // Si l'utilisateur est admin (role_id === 2), filtrer les superAdmin (role_id === 3)
        let query = 'SELECT id, username, email, role_id, created_at FROM users';
        let params = [];

        if (req.user.role_id === 2) {
            // Les admins ne voient pas les superAdmin
            query += ' WHERE role_id != ?';
            params.push(3);
        }

        query += ' ORDER BY created_at DESC';

        const [rows] = await pool.execute(query, params);

        res.status(200).json({
            message: 'Utilisateurs récupérés avec succès',
            users: rows
        });
    } catch (error) {
        console.error('Erreur getAllUsers:', error);
        res.status(500).json({
            message: 'Erreur serveur',
            error: error.message
        });
    }
};

// Récupérer un utilisateur par son ID
export const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = Number(id);

        // Si l'utilisateur est admin, ne pas permettre l'accès aux superAdmin
        if (req.user.role_id === 2) {
            const [userRows] = await pool.execute(
                'SELECT role_id FROM users WHERE id = ?',
                [userId]
            );

            if (userRows.length === 0) {
                return res.status(404).json({
                    error: 'Utilisateur introuvable'
                });
            }

            if (userRows[0].role_id === 3) {
                return res.status(403).json({
                    error: 'Accès refusé : vous ne pouvez pas accéder aux utilisateurs SuperAdmin'
                });
            }
        }

        const [rows] = await pool.execute(
            'SELECT id, username, email, role_id, created_at FROM users WHERE id = ?',
            [userId]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                error: 'Utilisateur introuvable'
            });
        }

        res.status(200).json({
            message: 'Utilisateur récupéré avec succès',
            user: rows[0]
        });
    } catch (error) {
        console.error('Erreur getUserById:', error);
        res.status(500).json({
            message: 'Erreur serveur',
            error: error.message
        });
    }
};

// Mettre à jour un utilisateur
export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = Number(id);
        const { username, email } = req.body;

        // Si l'utilisateur est admin, ne pas permettre la modification des superAdmin
        if (req.user.role_id === 2) {
            const [userRows] = await pool.execute(
                'SELECT role_id FROM users WHERE id = ?',
                [userId]
            );

            if (userRows.length === 0) {
                return res.status(404).json({
                    error: 'Utilisateur introuvable'
                });
            }

            if (userRows[0].role_id === 3) {
                return res.status(403).json({
                    error: 'Accès refusé : vous ne pouvez pas modifier les utilisateurs SuperAdmin'
                });
            }
        }

        // Empêcher un utilisateur de modifier son propre compte (sauf si superAdmin)
        if (req.user.id === userId && req.user.role_id !== 3) {
            return res.status(403).json({
                error: 'Vous ne pouvez pas modifier votre propre compte depuis cette interface'
            });
        }

        const updateFields = [];
        const updateValues = [];

        if (username) {
            updateFields.push('username = ?');
            updateValues.push(username);
        }

        if (email) {
            updateFields.push('email = ?');
            updateValues.push(email);
        }

        if (updateFields.length === 0) {
            return res.status(400).json({
                error: 'Aucune donnée à mettre à jour'
            });
        }

        updateValues.push(userId);

        const [result] = await pool.execute(
            `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`,
            updateValues
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                error: 'Utilisateur introuvable'
            });
        }

        // Récupérer l'utilisateur mis à jour
        const [updatedRows] = await pool.execute(
            'SELECT id, username, email, role_id, created_at FROM users WHERE id = ?',
            [userId]
        );

        res.status(200).json({
            message: 'Utilisateur mis à jour avec succès',
            user: updatedRows[0]
        });
    } catch (error) {
        console.error('Erreur updateUser:', error);
        res.status(500).json({
            message: 'Erreur serveur',
            error: error.message
        });
    }
};

// Supprimer un utilisateur
export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = Number(id);

        // Si l'utilisateur est admin, ne pas permettre la suppression des superAdmin
        if (req.user.role_id === 2) {
            const [userRows] = await pool.execute(
                'SELECT role_id FROM users WHERE id = ?',
                [userId]
            );

            if (userRows.length === 0) {
                return res.status(404).json({
                    error: 'Utilisateur introuvable'
                });
            }

            if (userRows[0].role_id === 3) {
                return res.status(403).json({
                    error: 'Accès refusé : vous ne pouvez pas supprimer les utilisateurs SuperAdmin'
                });
            }
        }

        // Empêcher un utilisateur de se supprimer lui-même
        if (req.user.id === userId) {
            return res.status(403).json({
                error: 'Impossible de supprimer votre propre compte'
            });
        }

        const [result] = await pool.execute(
            'DELETE FROM users WHERE id = ?',
            [userId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                error: 'Utilisateur introuvable'
            });
        }

        res.status(200).json({
            message: 'Utilisateur supprimé avec succès'
        });
    } catch (error) {
        console.error('Erreur deleteUser:', error);
        res.status(500).json({
            message: 'Erreur serveur',
            error: error.message
        });
    }
};

// Modifier le rôle d'un utilisateur
export const updateUserRole = async (req, res) => {
    try {

        const { id } = req.params;
        const idUser = Number(id);  // id de l'utilisateur à modifier
        const role_id = Number(req.body.role_id);   // nouveau rôle

        // 🔹 Vérification
        console.log('req.body:', req.body);
        console.log('role_id:', role_id);
        console.log('req.params.id:', id);

        if (isNaN(role_id)) {
            return res.status(400).json({ error: 'role_id invalide' });
        }
        // Sécurité -> rôles autorisés uniquement
        if(![1, 2, 3].includes(role_id)) {
            return res.status(400).json({
                error: 'Rôle invalide'
            });
        }

        // Empêcher un super_admin de se rétrograder lui-même
        if (req.user.id === Number(id)) {
            return res.status(403).json({
                erreur: 'Impossible de modifier son propre rôle'
            });
        }

        const [result] = await pool.execute(
            'UPDATE users SET role_id = ? WHERE id = ?', 
            [role_id, idUser]);


        if (result.affectedRows === 0) {
            return res.status(404).json({
                error: 'Utilisateur introuvable'
            });
        }

        res.json({
            message: 'Rôle mis à jour avec succès'
        });

    } catch (error) {
        console.error('Erreur updateUserRole:', error);
        res.status(500).json({
            message: 'Erreur serveur',
            error: error.message
        });
    }
}