import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../layout/header';
import Footer from '../../layout/footer';
import { CommentList } from './Comment';
import { getVideoById } from '../../service/videoService';
import { getCommentsByVideoId, createComment, updateComment, deleteComment } from '../../service/commentService';

const VideoDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [video, setVideo] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [newComment, setNewComment] = useState('');

  // Charger les détails de la vidéo
  useEffect(() => {
    loadVideoDetails();
    loadComments();
  }, [id]);

  const loadVideoDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      // Récupérer la vidéo depuis l'API
      const videoData = await getVideoById(id);
      
      // Mapper les données de l'API vers le format attendu par le composant
      const mappedVideo = {
        id: videoData.id,
        title: videoData.title || 'Sans titre',
        description: videoData.description || 'Aucune description disponible.',
        url: videoData.video_url ? `http://localhost:3000/${videoData.video_url}` : null,
        thumbnail: null, // Pas de thumbnail pour l'instant
        likes: 0, // Pas de système de likes pour l'instant
        views: 0, // Pas de système de vues pour l'instant
        createdAt: videoData.created_at || videoData.createdAt,
        author: 'Auteur', // Pas d'auteur pour l'instant
        category: videoData.theme_name || null,
        duration: videoData.duration,
        size_mb: videoData.size_mb,
      };

      setVideo(mappedVideo);
      setLikesCount(mappedVideo.likes);
    } catch (err) {
      setError('Erreur lors du chargement de la vidéo');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadComments = async () => {
    try {
      // Récupérer les commentaires depuis l'API
      const commentsData = await getCommentsByVideoId(id);
      
      // Mapper les données de l'API vers le format attendu par le composant
      const mappedComments = commentsData.map(comment => ({
        id: comment.id,
        author: comment.author || 'Utilisateur anonyme', // Si pas d'auteur dans la BDD, utiliser anonyme
        content: comment.content,
        likes: comment.likes || 0, // Si pas de likes dans la BDD, mettre 0
        createdAt: comment.created_at || comment.createdAt,
      }));

      setComments(mappedComments);
    } catch (err) {
      console.error('Erreur lors du chargement des commentaires:', err);
      // En cas d'erreur, on garde un tableau vide plutôt que de bloquer l'affichage
      setComments([]);
    }
  };

  const handleLike = async () => {
    const newLikedState = !isLiked;
    setIsLiked(newLikedState);
    setLikesCount(prev => newLikedState ? prev + 1 : prev - 1);

    // TODO: Appel API pour liker/unliker
    // await fetch(`/api/videos/${id}/like`, {
    //   method: newLikedState ? 'POST' : 'DELETE',
    // });
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      // Créer le commentaire via l'API
      await createComment(id, newComment.trim());
      
      // Réinitialiser le champ de saisie
      setNewComment('');
      
      // Recharger la liste des commentaires pour afficher le nouveau commentaire
      await loadComments();
    } catch (err) {
      console.error('Erreur lors de l\'ajout du commentaire:', err);
      // Afficher un message d'erreur à l'utilisateur
      alert('Erreur lors de l\'ajout du commentaire. Veuillez réessayer.');
    }
  };

  const handleUpdateComment = async (commentId, content) => {
    try {
      await updateComment(commentId, content);
      // Recharger la liste des commentaires pour afficher les modifications
      await loadComments();
    } catch (err) {
      console.error('Erreur lors de la modification du commentaire:', err);
      throw err; // Re-lancer l'erreur pour que le composant Comment puisse la gérer
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await deleteComment(commentId);
      // Recharger la liste des commentaires pour retirer le commentaire supprimé
      await loadComments();
    } catch (err) {
      console.error('Erreur lors de la suppression du commentaire:', err);
      throw err; // Re-lancer l'erreur pour que le composant Comment puisse la gérer
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-gray-600">Chargement de la vidéo...</p>
      </div>
    );
  }

  if (error || !video) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4">
        <p className="text-red-600 mb-4">{error || 'Vidéo non trouvée'}</p>
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Retour à l'accueil
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Bouton retour */}
        <button
          onClick={() => navigate('/')}
          className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Retour
        </button>

        <div className="max-w-4xl mx-auto">
          {/* Colonne principale - Vidéo et détails */}
          <div>
            {/* Lecteur vidéo */}
            <div className="bg-black rounded-lg overflow-hidden mb-6">
              <video
                className="w-full"
                style={{ aspectRatio: '16/9' }}
                controls
                autoPlay
                src={video.url}
                poster={video.thumbnail}
              >
                Votre navigateur ne supporte pas la lecture de vidéos.
              </video>
            </div>

            {/* Informations de la vidéo */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {video.title}
              </h1>

              <div className="flex items-center gap-6 mb-4 text-sm text-gray-600">
                <span>{video.views || 0} vues</span>
                <span>{new Date(video.createdAt).toLocaleDateString('fr-FR')}</span>
                {video.category && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">
                    {video.category}
                  </span>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-4 mb-4">
                <button
                  onClick={handleLike}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    isLiked
                      ? 'bg-red-100 text-red-600'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`}
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                  <span className="font-medium">{likesCount}</span>
                </button>
                
                {/* Bouton Modifier */}
                <button
                  onClick={() => navigate(`/video/${id}/edit`)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  <span>Modifier</span>
                </button>
              </div>

              {/* Description */}
              <div className="border-t border-gray-200 pt-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                    <span className="text-gray-600 font-semibold">
                      {video.author?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{video.author || 'Auteur'}</p>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {video.description}
                </p>
              </div>
            </div>

            {/* Section commentaires */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Commentaires ({comments.length})
              </h2>

              {/* Formulaire d'ajout de commentaire */}
              <form onSubmit={handleSubmitComment} className="mb-6">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Ajouter un commentaire..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Publier
                  </button>
                </div>
              </form>

              {/* Liste des commentaires avec style notifications Google */}
              {comments.length > 0 ? (
                <CommentList 
                  comments={comments} 
                  onUpdateComment={handleUpdateComment}
                  onDeleteComment={handleDeleteComment}
                />
              ) : (
                <p className="text-gray-500 text-center py-8">
                  Aucun commentaire pour le moment. Soyez le premier à commenter !
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default VideoDetails;

