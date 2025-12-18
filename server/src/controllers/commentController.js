// Logique pour gérer les commentaires

import * as commentService from '../services/comment.service.js';
import { messages } from '../utils/messages.js';

// Vérifie si une valeur est un entier positif
const isPositiveInteger = (value) => Number.isInteger(Number(value)) && Number(value) > 0;

// Récupérer tous les commentaires pour une vidéo
export const getComments = async (req, res) => {
    const videoId = req.params.videoId;

    if(!isPositiveInteger(videoId)) {
        return res.status(400).json({
            error: 'ID de la vidéo invalide' 
        });
    }

    try {
        const comments = await commentService.getCommentsByVideoId(Number(videoId));
        res.json(comments);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: messages.serverError
        });
    }
};

// Ajouter un nouveau commentaire
export const addComment = async (req, res) => {

    const videoId = req.params.videoId;
    const { content } = req.body;

    if (!isPositiveInteger(videoId)) {
        return res.status(400).json({
            error: 'ID de la vidéo invalide.'
        });
    }

    if (!content || content.trim() === '') {
        return res.status(400).json({
            error: 'Le contenu du commentaire est obligatoire.'
        });
    }

    try {
        const id = await commentService.createComment(Number(videoId), content.trim());
        res.status(201).json({
            message: messages.commentAdded, id
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: messages.serverError
        });
    }
}

// Modifier un commentaire 
export const editComment = async (req, res) => {
    const id = req.params.id;
    const { content } = req.body;

    if (!isPositiveInteger(id)) {
        return res.status(400).json({
            error: 'ID du commentaire invalide.'
        });
    }

    if (!content || content.trim() === '') {
        return res.status(400).json({
            error: 'Lecontenu du commentaire est obligatoire.'
        });
    }

    try {
        const affected = await commentService.updateComment(Number(id), content.trim());
        if (!affected) return res.status(404).json({
            error: messages.commentNotFound
        });
        res.json({ message: messages.commentUpdated });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: messages.serverError
        });
    }
}

// Supprimer un commentaire
export const removeComment = async (req, res) => {
    const id = req.params.id;

    if (!isPositiveInteger(id)) {
        return res.status(400).json({
            error: 'ID du commentaire invalide.'
        });
    }

    try {
        const affected = await commentService.deleteComment(Number(id));
        if (!affected) return res.status(404).json({
            error: messages.commentNotFound
        });
        res.json({ message: messages.commentDeleted });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: messages.serverError
        });
    }
}