const generateSegmentId = (sessionId: string) => {
    if (!sessionId) {
        throw new Error('sessionId is required');
    }
    return `segment${Date.now()}${sessionId}`;
};

export { generateSegmentId };