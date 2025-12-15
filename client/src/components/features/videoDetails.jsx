import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Comment from './Comment';

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

      // TODO: Remplacer par votre endpoint API
      // const response = await fetch(`/api/videos/${id}`);
      // const data = await response.json();
      // setVideo(data);

      // Données fictives pour tester
      const mockVideo = {
        id: parseInt(id),
        title: 'Aventure en montagne',
        description: 'Découvrez cette magnifique aventure en montagne avec des paysages à couper le souffle. Une expérience inoubliable à partager.',
        url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
        likes: 245,
        views: 1234,
        createdAt: '2024-01-15T10:30:00Z',
        author: 'Explorateur Pro',
        category: 'Aventure'
      };

      await new Promise(resolve => setTimeout(resolve, 500));
      setVideo(mockVideo);
      setLikesCount(mockVideo.likes);
    } catch (err) {
      setError('Erreur lors du chargement de la vidéo');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadComments = async () => {
    try {
      // TODO: Remplacer par votre endpoint API
      // const response = await fetch(`/api/videos/${id}/comments`);
      // const data = await response.json();
      // setComments(data);

      // Commentaires fictifs pour tester
      const mockComments = [
        {
          id: 1,
          author: 'Jean Dupont',
          content: 'Superbe vidéo ! Les paysages sont magnifiques. J\'aimerais bien y aller un jour.',
          likes: 12,
          createdAt: '2024-01-16T14:20:00Z'
        },
        {
          id: 2,
          author: 'Marie Martin',
          content: 'Merci pour ce partage ! Ça donne vraiment envie de partir à l\'aventure.',
          likes: 8,
          createdAt: '2024-01-17T09:15:00Z'
        },
        {
          id: 3,
          author: 'Pierre Durand',
          content: 'Quel endroit incroyable ! Est-ce que vous avez d\'autres vidéos de cette région ?',
          likes: 5,
          createdAt: '2024-01-18T16:45:00Z'
        }
      ];

      await new Promise(resolve => setTimeout(resolve, 300));
      setComments(mockComments);
    } catch (err) {
      console.error('Erreur lors du chargement des commentaires:', err);
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
      // TODO: Appel API pour ajouter un commentaire
      // await fetch(`/api/videos/${id}/comments`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ content: newComment }),
      // });

      // Ajout temporaire du commentaire
      const comment = {
        id: comments.length + 1,
        author: 'Moi',
        content: newComment,
        likes: 0,
        createdAt: new Date().toISOString()
      };
      setComments([comment, ...comments]);
      setNewComment('');
    } catch (err) {
      console.error('Erreur lors de l\'ajout du commentaire:', err);
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Colonne principale - Vidéo et détails */}
          <div className="lg:col-span-2">
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

              {/* Liste des commentaires */}
              <div className="space-y-0">
                {comments.length > 0 ? (
                  comments.map((comment) => (
                    <Comment key={comment.id} comment={comment} />
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-8">
                    Aucun commentaire pour le moment. Soyez le premier à commenter !
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Colonne latérale - Suggestions (optionnel) */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Vidéos suggérées
              </h3>
              <p className="text-gray-500 text-sm">
                Les suggestions de vidéos apparaîtront ici
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoDetails;

