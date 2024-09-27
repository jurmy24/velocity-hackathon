import React, { useState, useCallback, useEffect } from 'react';
import { Handle, Position, useUpdateNodeInternals } from 'reactflow';

const NodeContent = ({ data, isConnectable, id }) => {
    const [content, setContent] = useState(data.content || '');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const updateNodeInternals = useUpdateNodeInternals();

    useEffect(() => {
        updateNodeInternals(id);
    }, [id, updateNodeInternals]);

    const handleChange = useCallback((evt) => {
        setContent(evt.target.value);
    }, []);

    const handleNodeMouseEnter = () => {
        setShowSuggestions(true);
    };

    const handleNodeMouseLeave = (e) => {
        if (!e.relatedTarget || !e.relatedTarget.closest('.suggestions-container')) {
            setShowSuggestions(false);
        }
    };

    const handleSuggestionClick = (suggestion) => {
        if (data.onSuggestionClick && typeof data.onSuggestionClick === 'function') {
            data.onSuggestionClick(suggestion, data);
        } else {
            console.warn('onSuggestionClick is not provided or is not a function');
        }
    };

    const suggestions = data.suggestions || ['Suggestion 1', 'Suggestion 2', 'Suggestion 3'];

    // Styles for the handles
    const handleStyle = {
        opacity: 3,
        width: '6px',
        height: '6px',
        borderRadius: '50%',
        border: '2px solid #ddd',
        background: '#fff',
        transition: 'opacity 0.3s',
    };

    const onConnect = (params) => {
        console.log('New connection:', params);
        // Add any custom connection logic here
    };

    const isValidConnection = () => {
        // Add any custom validation logic here
        return true;
    };

    return (
        <div
            className="bg-white rounded-lg shadow-md p-4 w-64 relative group"
            onMouseEnter={handleNodeMouseEnter}
            onMouseLeave={handleNodeMouseLeave}
        >
            <Handle 
                id="top"
                type="source" 
                position={Position.Top} 
                style={{ ...handleStyle, top: '-5px', left: 'calc(50% - 5px)' }}
                isConnectable={isConnectable}
                isConnectableStart={true}
                isConnectableEnd={true}
                onConnect={onConnect}
                isValidConnection={isValidConnection}
                className="group-hover:opacity-100 connecting"
            />
            <Handle 
                id="right"
                type="source" 
                position={Position.Right} 
                style={{ ...handleStyle, right: '-5px', top: 'calc(50% - 5px)' }}
                isConnectable={isConnectable}
                isConnectableStart={true}
                isConnectableEnd={true}
                onConnect={onConnect}
                isValidConnection={isValidConnection}
                className="group-hover:opacity-100 connecting"
            />
            <Handle 
                id="bottom"
                type="source" 
                position={Position.Bottom} 
                style={{ ...handleStyle, bottom: '-5px', left: 'calc(50% - 5px)' }}
                isConnectable={isConnectable}
                isConnectableStart={true}
                isConnectableEnd={true}
                onConnect={onConnect}
                isValidConnection={isValidConnection}
                className="group-hover:opacity-100 connecting"
            />
            <Handle 
                id="left"
                type="source" 
                position={Position.Left} 
                style={{ ...handleStyle, left: '-5px', top: 'calc(50% - 5px)' }}
                isConnectable={isConnectable}
                isConnectableStart={true}
                isConnectableEnd={true}
                onConnect={onConnect}
                isValidConnection={isValidConnection}
                className="group-hover:opacity-100 connecting"
            />
            <textarea
                className="w-full h-24 p-2 border rounded resize-none"
                value={content}
                onChange={handleChange}
                placeholder="Write your idea here..."
            />
            {showSuggestions && (
                <div className="suggestions-container absolute top-full left-0 mt-2 z-10">
                    {suggestions.map((suggestion, index) => (
                        <div
                            key={index}
                            className="bg-gray-200 opacity-70 p-2 rounded mb-2 cursor-pointer hover:bg-gray-300"
                            onClick={() => handleSuggestionClick(suggestion)}
                        >
                            {suggestion}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default NodeContent;