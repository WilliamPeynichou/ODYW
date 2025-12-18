// Service pour interagir avec l'API de vidéos

const API_BASE_URL = 'http://localhost:3000/api/videos';

/**
 * Upload une nouvelle vidéo
 * @param {FormData} formData - FormData contenant 'video', 'title', et 'theme_id'
 * @returns {Promise<Object>} Promise qui résout avec la vidéo créée
 */
export const uploadVideo = async (formData) => {
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/6211406b-4427-4383-9516-068226dbe68b',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'videoService.jsx:10',message:'uploadVideo entry',data:{url:API_BASE_URL,hasFormData:!!formData},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
  // #endregion
  try {
    // #region agent log
    const formDataEntries = formData ? Array.from(formData.entries()).map(([k,v])=>({key:k,value:v instanceof File?`File:${v.name}`:v})) : [];
    fetch('http://127.0.0.1:7242/ingest/6211406b-4427-4383-9516-068226dbe68b',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'videoService.jsx:13',message:'before fetch uploadVideo',data:{url:API_BASE_URL,formDataEntries},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
    // #endregion
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      body: formData,
      // Ne pas définir Content-Type, le navigateur le fera automatiquement avec FormData
    });

    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/6211406b-4427-4383-9516-068226dbe68b',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'videoService.jsx:20',message:'after fetch uploadVideo',data:{status:response.status,statusText:response.statusText,ok:response.ok,contentType:response.headers.get('content-type')},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A,B,C'})}).catch(()=>{});
    // #endregion

    if (!response.ok) {
      // #region agent log
      const responseText = await response.clone().text();
      fetch('http://127.0.0.1:7242/ingest/6211406b-4427-4383-9516-068226dbe68b',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'videoService.jsx:24',message:'response not ok - before json parse',data:{status:response.status,responseText:responseText.substring(0,500)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B,C'})}).catch(()=>{});
      // #endregion
      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        errorData = { message: `Erreur HTTP ${response.status}` };
      }
      // Le backend retourne { message: '...', error: 'détails' }, on préfère afficher les détails
      const errorMessage = errorData.error || errorData.message || 'Erreur lors de l\'upload de la vidéo';
      console.error('Erreur détaillée du serveur:', errorData);
      throw new Error(errorMessage);
    }

    const data = await response.json();
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/6211406b-4427-4383-9516-068226dbe68b',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'videoService.jsx:30',message:'uploadVideo success',data:{hasVideo:!!data.video},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
    return data.video;
  } catch (error) {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/6211406b-4427-4383-9516-068226dbe68b',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'videoService.jsx:33',message:'uploadVideo catch error',data:{errorName:error.name,errorMessage:error.message,errorStack:error.stack?.substring(0,300)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A,B,C,D,E'})}).catch(()=>{});
    // #endregion
    console.error('Erreur uploadVideo:', error);
    throw error;
  }
};

/**
 * Récupère toutes les vidéos
 * @returns {Promise<Array>} Promise qui résout avec un tableau de vidéos
 */
export const getAllVideos = async () => {
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/6211406b-4427-4383-9516-068226dbe68b',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'videoService.jsx:35',message:'getAllVideos entry',data:{url:API_BASE_URL},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A,D'})}).catch(()=>{});
  // #endregion
  try {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/6211406b-4427-4383-9516-068226dbe68b',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'videoService.jsx:38',message:'before fetch getAllVideos',data:{url:API_BASE_URL},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A,D'})}).catch(()=>{});
    // #endregion
    const response = await fetch(API_BASE_URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/6211406b-4427-4383-9516-068226dbe68b',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'videoService.jsx:46',message:'after fetch getAllVideos',data:{status:response.status,statusText:response.statusText,ok:response.ok,contentType:response.headers.get('content-type')},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A,B,C'})}).catch(()=>{});
    // #endregion

    if (!response.ok) {
      // #region agent log
      const responseText = await response.clone().text();
      fetch('http://127.0.0.1:7242/ingest/6211406b-4427-4383-9516-068226dbe68b',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'videoService.jsx:50',message:'response not ok - before json parse',data:{status:response.status,responseText:responseText.substring(0,500)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B,C'})}).catch(()=>{});
      // #endregion
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erreur lors de la récupération des vidéos');
    }

    const data = await response.json();
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/6211406b-4427-4383-9516-068226dbe68b',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'videoService.jsx:56',message:'getAllVideos success',data:{videosCount:data.videos?.length},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
    return data.videos;
  } catch (error) {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/6211406b-4427-4383-9516-068226dbe68b',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'videoService.jsx:59',message:'getAllVideos catch error',data:{errorName:error.name,errorMessage:error.message,errorStack:error.stack?.substring(0,300)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A,B,C,D'})}).catch(()=>{});
    // #endregion
    console.error('Erreur getAllVideos:', error);
    throw error;
  }
};

/**
 * Récupère une vidéo par son ID
 * @param {string|number} id - ID de la vidéo
 * @returns {Promise<Object>} Promise qui résout avec la vidéo
 */
export const getVideoById = async (id) => {
  // #region agent log
  const fullUrl = `${API_BASE_URL}/${id}`;
  fetch('http://127.0.0.1:7242/ingest/6211406b-4427-4383-9516-068226dbe68b',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'videoService.jsx:62',message:'getVideoById entry',data:{id,url:fullUrl},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A,D'})}).catch(()=>{});
  // #endregion
  try {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/6211406b-4427-4383-9516-068226dbe68b',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'videoService.jsx:66',message:'before fetch getVideoById',data:{url:fullUrl},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A,D'})}).catch(()=>{});
    // #endregion
    const response = await fetch(fullUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/6211406b-4427-4383-9516-068226dbe68b',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'videoService.jsx:74',message:'after fetch getVideoById',data:{status:response.status,statusText:response.statusText,ok:response.ok,contentType:response.headers.get('content-type')},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A,B,C'})}).catch(()=>{});
    // #endregion

    if (!response.ok) {
      // #region agent log
      const responseText = await response.clone().text();
      fetch('http://127.0.0.1:7242/ingest/6211406b-4427-4383-9516-068226dbe68b',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'videoService.jsx:78',message:'response not ok - before json parse',data:{status:response.status,responseText:responseText.substring(0,500)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B,C'})}).catch(()=>{});
      // #endregion
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erreur lors de la récupération de la vidéo');
    }

    const data = await response.json();
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/6211406b-4427-4383-9516-068226dbe68b',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'videoService.jsx:84',message:'getVideoById success',data:{hasVideo:!!data.video},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
    return data.video;
  } catch (error) {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/6211406b-4427-4383-9516-068226dbe68b',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'videoService.jsx:87',message:'getVideoById catch error',data:{errorName:error.name,errorMessage:error.message,errorStack:error.stack?.substring(0,300)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A,B,C,D'})}).catch(()=>{});
    // #endregion
    console.error('Erreur getVideoById:', error);
    throw error;
  }
};

/**
 * Met à jour une vidéo
 * @param {string|number} id - ID de la vidéo à mettre à jour
 * @param {FormData|Object} data - FormData (avec fichier) ou Object JSON (sans fichier) contenant les données à mettre à jour
 * @returns {Promise<Object>} Promise qui résout avec la vidéo mise à jour
 */
export const updateVideo = async (id, data) => {
  // #region agent log
  const fullUrl = `${API_BASE_URL}/${id}`;
  const isFormData = data instanceof FormData;
  fetch('http://127.0.0.1:7242/ingest/6211406b-4427-4383-9516-068226dbe68b',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'videoService.jsx:90',message:'updateVideo entry',data:{id,url:fullUrl,isFormData},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D,E'})}).catch(()=>{});
  // #endregion
  try {
    // #region agent log
    const dataPreview = isFormData ? Array.from(data.entries()).map(([k,v])=>({key:k,value:v instanceof File?`File:${v.name}`:v})) : data;
    fetch('http://127.0.0.1:7242/ingest/6211406b-4427-4383-9516-068226dbe68b',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'videoService.jsx:95',message:'before fetch updateVideo',data:{url:fullUrl,dataPreview},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
    // #endregion
    const options = {
      method: 'PUT',
      body: isFormData ? data : JSON.stringify(data),
      headers: isFormData 
        ? {} // Le navigateur définira Content-Type automatiquement pour FormData
        : {
            'Content-Type': 'application/json',
          },
    };

    const response = await fetch(fullUrl, options);

    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/6211406b-4427-4383-9516-068226dbe68b',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'videoService.jsx:107',message:'after fetch updateVideo',data:{status:response.status,statusText:response.statusText,ok:response.ok,contentType:response.headers.get('content-type')},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A,B,C'})}).catch(()=>{});
    // #endregion

    if (!response.ok) {
      // #region agent log
      const responseText = await response.clone().text();
      fetch('http://127.0.0.1:7242/ingest/6211406b-4427-4383-9516-068226dbe68b',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'videoService.jsx:111',message:'response not ok - before json parse',data:{status:response.status,responseText:responseText.substring(0,500)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B,C'})}).catch(()=>{});
      // #endregion
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erreur lors de la mise à jour de la vidéo');
    }

    const responseData = await response.json();
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/6211406b-4427-4383-9516-068226dbe68b',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'videoService.jsx:117',message:'updateVideo success',data:{hasVideo:!!responseData.video},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
    return responseData.video;
  } catch (error) {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/6211406b-4427-4383-9516-068226dbe68b',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'videoService.jsx:120',message:'updateVideo catch error',data:{errorName:error.name,errorMessage:error.message,errorStack:error.stack?.substring(0,300)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A,B,C,D,E'})}).catch(()=>{});
    // #endregion
    console.error('Erreur updateVideo:', error);
    throw error;
  }
};

/**
 * Supprime une vidéo
 * @param {string|number} id - ID de la vidéo à supprimer
 * @returns {Promise<Object>} Promise qui résout avec la vidéo supprimée
 */
export const deleteVideo = async (id) => {
  // #region agent log
  const fullUrl = `${API_BASE_URL}/${id}`;
  fetch('http://127.0.0.1:7242/ingest/6211406b-4427-4383-9516-068226dbe68b',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'videoService.jsx:124',message:'deleteVideo entry',data:{id,url:fullUrl},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A,D'})}).catch(()=>{});
  // #endregion
  try {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/6211406b-4427-4383-9516-068226dbe68b',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'videoService.jsx:128',message:'before fetch deleteVideo',data:{url:fullUrl},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A,D'})}).catch(()=>{});
    // #endregion
    const response = await fetch(fullUrl, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/6211406b-4427-4383-9516-068226dbe68b',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'videoService.jsx:136',message:'after fetch deleteVideo',data:{status:response.status,statusText:response.statusText,ok:response.ok,contentType:response.headers.get('content-type')},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A,B,C'})}).catch(()=>{});
    // #endregion

    if (!response.ok) {
      // #region agent log
      const responseText = await response.clone().text();
      fetch('http://127.0.0.1:7242/ingest/6211406b-4427-4383-9516-068226dbe68b',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'videoService.jsx:140',message:'response not ok - before json parse',data:{status:response.status,responseText:responseText.substring(0,500)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B,C'})}).catch(()=>{});
      // #endregion
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erreur lors de la suppression de la vidéo');
    }

    const data = await response.json();
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/6211406b-4427-4383-9516-068226dbe68b',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'videoService.jsx:146',message:'deleteVideo success',data:{hasVideo:!!data.video},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
    return data.video;
  } catch (error) {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/6211406b-4427-4383-9516-068226dbe68b',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'videoService.jsx:149',message:'deleteVideo catch error',data:{errorName:error.name,errorMessage:error.message,errorStack:error.stack?.substring(0,300)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A,B,C,D'})}).catch(()=>{});
    // #endregion
    console.error('Erreur deleteVideo:', error);
    throw error;
  }
};

export default {
  uploadVideo,
  getAllVideos,
  getVideoById,
  updateVideo,
  deleteVideo,
};

