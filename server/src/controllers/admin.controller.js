import { pool } from "../db/index.js";

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