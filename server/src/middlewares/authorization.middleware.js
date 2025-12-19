import { canManageContent } from "../utils/permission.util.js";
import { pool } from "../db/index.js";

// Middleware pour vérifier si l'utilisateur peut gérer le contenu (video ou commentaire)
export const checkOwnershipOrRole = (table) => {

    return async (req, res, next) => {
        try {
            // Récupère l'id du contenu depuis les paramètres de la requete
            const { id } = req.params;

            // Récupérer le propriétaire (Owner) du contenu et son role
            const [rows] = await pool.execute(`SELECT u.id AS user_id, u.role_id FROM ${table} c JOIN users u ON c.user_id = u.id WHERE c.id = ?`, [id]);

            // Si aucun contenu trouvé, renvoie une erreur 404
            if (rows.length === 0) return res.status(404).json({
                error: 'Contenu introuvable'
            });

            // Objet représentant le propriétaire du contenu
            const contentOwner = {
                id: rows[0].user_id,
                role_id: rows[0].role_id
            };

            // Vérifie si l'utilisateur courant peut gérer ce contenu
            if (!canManageContent(req.user, contentOwner)) {
                return res.status(403).json({
                    error: "Vous ne pouvez pas manipuler le contenu d'un autre utilisateur"
                });
            }

            // Si autorisé, passe au controller si autorisé
            next();
        } catch (error) {
            console.error(error);
            res.status(500).json({
                error: 'Erreur serveur'
            });
        }
    }
}