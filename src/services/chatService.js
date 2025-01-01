import { db } from '../firebase/firebase';
import { collection, addDoc, query, where, getDocs, orderBy, doc, getDoc } from 'firebase/firestore';

export const saveConversation = async (userId, messages) => {
    try {
        const conversationsRef = collection(db, 'conversations');
        await addDoc(conversationsRef, {
            userId,
            messages,
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        console.error('Error saving conversation:', error);
        throw error;
    }
};

export const getUserConversations = async (userId) => {
    try {
        const conversationsRef = collection(db, 'conversations');
        const q = query(
            conversationsRef, 
            where('userId', '==', userId),
            orderBy('timestamp', 'desc')
        );
        
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error('Error fetching conversations:', error);
        throw error;
    }
};

export const getConversation = async (id) => {
    try {
        const conversationRef = doc(db, 'conversations', id);
        const conversationSnap = await getDoc(conversationRef);
        
        if (conversationSnap.exists()) {
            return {
                id: conversationSnap.id,
                ...conversationSnap.data()
            };
        }
        return null;
    } catch (error) {
        console.error('Error fetching conversation:', error);
        throw error;
    }
}; 