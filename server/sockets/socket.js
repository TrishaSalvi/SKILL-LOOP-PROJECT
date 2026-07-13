const setupSocket= (io) => {
    io.on("connection", (socket) => {
        console.log("socket connected:", socket.id);

        socket.on("join-user", (userId) => {
            socket.join(`user:${userId}`);
        });

        socket.on("join-skill", (skillId) => {
            socket.join(`skill:${skillId}`);
        });

        socket.on("leave-skill", (skillId) => {
            socket.leave(`skill:${skillId}`);
        });

        socket.on("disconnect", () => {
            console.log("socket disconnected:", socket.id);
        });
    });
};

export default setupSocket;