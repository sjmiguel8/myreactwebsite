import { db } from '../firebase/firebase';
import { collection, addDoc, query, where, getDocs, orderBy, doc, getDoc } from 'firebase/firestore';

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

export const sendMessage = async (messages) => {
    try {
        const response = await fetch(OPENAI_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages,
                max_tokens: 400,
                temperature: 0.7
            })
        });

        if (!response.ok) {
            throw new Error('Failed to get response from OpenAI');
        }

        const data = await response.json();
        return {
            role: 'assistant',
            content: data.choices[0].message.content
        };
    } catch (error) {
        console.error('Error in chat completion:', error);
        throw error;
    }
};

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
