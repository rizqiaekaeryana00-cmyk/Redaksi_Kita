import { db } from '../firebaseConfig';
import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { NewsItem, QuizQuestion, VideoContent, PuzzleLevel, INITIAL_NEWS, INITIAL_VIDEOS, INITIAL_QUIZ, INITIAL_PUZZLES } from '../types';

// Nama Koleksi di Database Firestore
const COLLECTIONS = {
  NEWS: 'news',
  VIDEOS: 'videos',
  QUIZ: 'quiz',
  PUZZLES: 'puzzles' // Koleksi baru
};

export const DataService = {
  // --- NEWS SERVICES ---
  getNews: async (): Promise<NewsItem[]> => {
    try {
      const querySnapshot = await getDocs(collection(db, COLLECTIONS.NEWS));
      const data: NewsItem[] = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as NewsItem));
      
      if (data.length === 0) return INITIAL_NEWS;
      return data;
    } catch (error) {
      console.error("Error getting news:", error);
      return INITIAL_NEWS;
    }
  },

  addNews: async (item: Omit<NewsItem, 'id'>): Promise<NewsItem> => {
    try {
      const docRef = await addDoc(collection(db, COLLECTIONS.NEWS), item);
      return { id: docRef.id, ...item };
    } catch (error) {
      console.error("Error adding news:", error);
      throw error;
    }
  },

  deleteNews: async (id: string): Promise<void> => {
    if (id.length < 5) return;
    try { await deleteDoc(doc(db, COLLECTIONS.NEWS, id)); } catch(e) {}
  },

  // --- VIDEO SERVICES ---
  getVideos: async (): Promise<VideoContent[]> => {
    try {
      const querySnapshot = await getDocs(collection(db, COLLECTIONS.VIDEOS));
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as VideoContent));

      if (data.length === 0) return INITIAL_VIDEOS;
      return data;
    } catch (error) {
      return INITIAL_VIDEOS;
    }
  },

  addVideo: async (item: Omit<VideoContent, 'id'>): Promise<VideoContent> => {
    const docRef = await addDoc(collection(db, COLLECTIONS.VIDEOS), item);
    return { id: docRef.id, ...item };
  },

  deleteVideo: async (id: string): Promise<void> => {
    if (id.length < 5) return;
    await deleteDoc(doc(db, COLLECTIONS.VIDEOS, id));
  },

  // --- QUIZ SERVICES ---
  getQuiz: async (): Promise<QuizQuestion[]> => {
    try {
      const querySnapshot = await getDocs(collection(db, COLLECTIONS.QUIZ));
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as QuizQuestion));

      if (data.length === 0) return INITIAL_QUIZ;
      return data;
    } catch (error) {
      return INITIAL_QUIZ;
    }
  },

  addQuiz: async (item: Omit<QuizQuestion, 'id'>): Promise<QuizQuestion> => {
    const docRef = await addDoc(collection(db, COLLECTIONS.QUIZ), item);
    return { id: docRef.id, ...item };
  },

  deleteQuiz: async (id: string): Promise<void> => {
    if (id.length < 5) return;
    await deleteDoc(doc(db, COLLECTIONS.QUIZ, id));
  },

  // --- PUZZLE SERVICES (NEW) ---
  getPuzzles: async (): Promise<PuzzleLevel[]> => {
    try {
      const querySnapshot = await getDocs(collection(db, COLLECTIONS.PUZZLES));
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as PuzzleLevel));

      // PERBAIKAN: Jika data di database kurang dari 5 (misal cuma test data),
      // gunakan INITIAL_PUZZLES agar game tetap memiliki banyak level.
      if (data.length < 5) return INITIAL_PUZZLES;
      return data;
    } catch (error) {
      return INITIAL_PUZZLES;
    }
  },

  addPuzzle: async (item: Omit<PuzzleLevel, 'id'>): Promise<PuzzleLevel> => {
    const docRef = await addDoc(collection(db, COLLECTIONS.PUZZLES), item);
    return { id: docRef.id, ...item };
  },

  deletePuzzle: async (id: string): Promise<void> => {
    if (id.length < 4) return;
    await deleteDoc(doc(db, COLLECTIONS.PUZZLES, id));
  }
};