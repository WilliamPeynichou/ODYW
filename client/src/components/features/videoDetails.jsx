import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../../layout/header";
import { CommentList } from "./Comment";
import { getVideoById } from "../../service/videoService";
import {
  getCommentsByVideoId,
  createComment,
} from "../../service/commentService";

const VideoDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [video, setVideo] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [newComment, setNewComment] = useState("");

  // Charger les détails de la vidéo
  useEffect(() => {
    loadVideoDetails();
    loadComments();
  }, [id]);

  // Dans VideoDetails.jsx

const loadVideoDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      const videoData = await getVideoById(id);

      // Si l'API ne renvoie rien (ex: mauvais ID), on déclenche une erreur
      if (!videoData) {
        throw new Error('Vidéo introuvable');
      }
      
      // CORRECTION URL : On vérifie si c'est un lien web (http) ou un fichier local
      let finalUrl = null;
      if (videoData.video_url) {
        if (videoData.video_url.startsWith('http')) {
             // C'est un lien Internet (les fausses données)
             finalUrl = videoData.video_url;
        } else {
             // C'est un fichier uploadé en local
             finalUrl = `http://localhost:3000/${videoData.video_url}`;
        }
      }

      const mappedVideo = {
        id: videoData.id,
        title: videoData.title || 'Sans titre',
        // Ta table n'a pas de description, donc on met un texte par défaut
        description: videoData.description || 'Aucune description disponible.', 
        url: finalUrl,
        thumbnail: null, 
        // On récupère les stats de notation si l'API les envoie, sinon 0
        averageRating: videoData.average_rating || 0,
        totalVotes: videoData.count || 0,
        createdAt: videoData.created_at || new Date().toISOString(),
        author: videoData.username || 'Auteur', // Assure-toi que ton API fait le JOIN avec users
        category: videoData.theme_name || 'Non classé',
        duration: videoData.duration,
        size_mb: videoData.size_mb,
      };

      setVideo(mappedVideo);
      
      // Initialiser les étoiles avec la moyenne actuelle
      setAverageRating(Number(mappedVideo.averageRating) || 0);
      setTotalVotes(Number(mappedVideo.totalVotes) || 0);

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
      const mappedComments = commentsData.map((comment) => ({
        id: comment.id,
        author: comment.author || "Utilisateur anonyme", // Si pas d'auteur dans la BDD, utiliser anonyme
        content: comment.content,
        likes: comment.likes || 0, // Si pas de likes dans la BDD, mettre 0
        createdAt: comment.created_at || comment.createdAt,
      }));

      setComments(mappedComments);
    } catch (err) {
      console.error("Erreur lors du chargement des commentaires:", err);
      // En cas d'erreur, on garde un tableau vide plutôt que de bloquer l'affichage
      setComments([]);
    }
  };

  const handleRate = async (ratingValue) => {
    // 1. Mise à jour Optimiste (pour que ce soit instantané à l'écran)
    setUserRating(ratingValue);

    try {
      // 2. Appel à l'API
      // Remplace par ton URL réelle et ajoute les headers d'auth si besoin
      const response = await fetch(
        `http://localhost:3000/api/videos/${id}/rate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // 'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ rating: ratingValue }),
        }
      );

      if (!response.ok) throw new Error("Erreur lors de la notation");

      // 3. Mise à jour avec les vraies données du serveur (moyenne recalculée)
      const data = await response.json();
      if (data.newAverage) setAverageRating(parseFloat(data.newAverage));
      if (data.count) setTotalVotes(data.count);
    } catch (err) {
      console.error("Erreur vote:", err);
      // En cas d'erreur, on pourrait remettre userRating à 0 ou afficher une alerte
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      // Créer le commentaire via l'API
      const createdComment = await createComment(id, newComment.trim());

      // Mapper le commentaire créé vers le format attendu par le composant
      const mappedComment = {
        id: createdComment.id,
        author: createdComment.author || "Utilisateur anonyme",
        content: createdComment.content,
        likes: createdComment.likes || 0,
        createdAt:
          createdComment.created_at ||
          createdComment.createdAt ||
          new Date().toISOString(),
      };

      // Ajouter le nouveau commentaire en haut de la liste
      setComments([mappedComment, ...comments]);
      setNewComment("");
    } catch (err) {
      console.error("Erreur lors de l'ajout du commentaire:", err);
      // Afficher un message d'erreur à l'utilisateur (optionnel)
      alert("Erreur lors de l'ajout du commentaire. Veuillez réessayer.");
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
        <p className="text-red-600 mb-4">{error || "Vidéo non trouvée"}</p>
        <button
          onClick={() => navigate("/")}
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
          onClick={() => navigate("/")}
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
                style={{ aspectRatio: "16/9" }}
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
                <span>
                  {new Date(video.createdAt).toLocaleDateString("fr-FR")}
                </span>
                {video.category && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">
                    {video.category}
                  </span>
                )}
              </div>
              
              {/*ACTIONS*/}
              <div className="flex items-center gap-4 mb-4">
                <div className="flex flex-col">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => handleRate(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="focus:outline-none transition-transform hover:scale-110"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className={`h-8 w-8 transition-colors duration-200 ${
                            star <= (hoverRating || userRating)
                              ? "text-yellow-400 fill-current" // Étoile pleine (jaune)
                              : "text-gray-300 fill-current" // Étoile vide (grise)
                          }`}
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                      </button>
                    ))}
                  </div>
                  {/* Affichage de la moyenne */}
                  <span className="text-sm text-gray-500 mt-1 ml-1">
                    {averageRating > 0
                      ? `${Number(averageRating).toFixed(
                          1
                        )}/5 (${totalVotes} votes)`
                      : "Pas encore noté"}
                  </span>
                </div>

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
                      {video.author?.charAt(0).toUpperCase() || "U"}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {video.author || "Auteur"}
                    </p>
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
                <CommentList comments={comments} />
              ) : (
                <p className="text-gray-500 text-center py-8">
                  Aucun commentaire pour le moment. Soyez le premier à commenter
                  !
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoDetails;
