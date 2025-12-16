import { getAllThemes, getThemeById } from '../services/theme.service.js';

// Controller pour récupérer tous les thèmes
export const getAllThemesController = async (req, res) => {
    try {
        const themes = await getAllThemes();
        res.status(200).json({
            message: 'Tous les thèmes ont été récupérés avec succès',
            themes: themes,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Erreur lors de la récupération des thèmes',
            error: error.message,
        });
    }
};

// Controller pour récupérer un thème par son ID
export const getThemeByIdController = async (req, res) => {
    try {
        const { id } = req.params;
        const theme = await getThemeById(id);
        
        res.status(200).json({
            message: `Thème n° ${id} trouvé avec succès`,
            theme: theme,
        });
    } catch (error) {
        if (error.message === 'Thème non trouvé') {
            return res.status(404).json({
                message: 'Thème non trouvé',
                error: error.message,
            });
        }
        
        res.status(500).json({
            message: 'Erreur lors de la récupération du thème',
            error: error.message,
        });
    }
};

