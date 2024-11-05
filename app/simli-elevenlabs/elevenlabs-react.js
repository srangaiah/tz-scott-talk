import { useRef, useState, useEffect } from 'react';
import { Conversation } from './elevenlabs-client';

/**
 * Helper function to merge objects
 */
function mergeObjects(target, ...sources) {
    // Use native Object.assign if available
    if (Object.assign) {
        return Object.assign.bind();
    }
    
    // Fallback implementation
    return function(target) {
        for (let i = 1; i < arguments.length; i++) {
            const source = arguments[i];
            for (const key in source) {
                if ({}.hasOwnProperty.call(source, key)) {
                    target[key] = source[key];
                }
            }
        }
        return target;
    };
}

/**
 * Custom hook to manage conversation state and audio handling
 * @param {Object} defaultConfig - Default configuration for the conversation
 * @returns {Object} Conversation controls and state
 */
function useConversation(defaultConfig) {
    // Refs to maintain conversation instances
    const conversationRef = useRef(null);
    const pendingConversationRef = useRef(null);
    
    // State management
    const [connectionStatus, setConnectionStatus] = useState('disconnected');
    const [conversationMode, setConversationMode] = useState('listening');

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            conversationRef.current?.endSession();
        };
    }, []);

    /**
     * Starts a new conversation session
     * @param {Object} config - Session configuration
     * @returns {Promise<string>} Conversation ID
     */
    const startSession = async (config = {}) => {
        // Return existing conversation ID if available
        if (conversationRef.current) {
            return conversationRef.current.getId();
        }
        
        // Return pending conversation ID if exists
        if (pendingConversationRef.current) {
            const conversation = await pendingConversationRef.current;
            return conversation.getId();
        }

        try {
            // Initialize new conversation with merged config
            pendingConversationRef.current = Conversation.startSession(
                mergeObjects(
                    {},
                    defaultConfig || {},
                    config,
                    {
                        onModeChange: ({ mode }) => setConversationMode(mode),
                        onStatusChange: ({ status }) => setConnectionStatus(status)
                    }
                )
            );

            // Await conversation initialization
            conversationRef.current = await pendingConversationRef.current;
            return conversationRef.current.getId();
            
        } finally {
            pendingConversationRef.current = null;
        }
    };

    /**
     * Ends the current conversation session
     */
    const endSession = async () => {
        const currentConversation = conversationRef.current;
        conversationRef.current = null;
        await currentConversation?.endSession();
    };

    /**
     * Sets the volume for the conversation
     */
    const setVolume = ({ volume }) => {
        conversationRef.current?.setVolume({ volume });
    };

    /**
     * Gets frequency data for audio visualization
     */
    const getInputByteFrequencyData = () => {
        return conversationRef.current?.getInputByteFrequencyData();
    };

    const getOutputByteFrequencyData = () => {
        return conversationRef.current?.getOutputByteFrequencyData();
    };

    /**
     * Gets volume levels for input/output
     */
    const getInputVolume = () => {
        return conversationRef.current?.getInputVolume() ?? 0;
    };

    const getOutputVolume = () => {
        return conversationRef.current?.getOutputVolume() ?? 0;
    };

    return {
        // Session management
        startSession,
        endSession,
        setVolume,
        
        // Audio data getters
        getInputByteFrequencyData,
        getOutputByteFrequencyData,
        getInputVolume,
        getOutputVolume,
        
        // State
        status: connectionStatus,
        isSpeaking: conversationMode === 'speaking'
    };
}

export { useConversation };