/** @format */

import { Server } from "socket.io"
import { decrytData } from "../hashings"
import { tryPromise } from "."
import UserService from "../../v1/users/service"
import { isAfter } from "date-fns"
import { handleDM } from "../../v1/dms/socket"
import { handleCommunityChat } from "../../v1/community-chats/helper"

export const authenticateSocket = async (authToken: string) => {
    let isValid = false
    let user = {}
    
    const token = authToken?.split(" ")[1]
    if (!token) {
        isValid = false
        return { isValid, user }
    }

    user = decrytData(token)
    const parsedUser = JSON.parse(user as string) as { _id: string; exp: Date }
    const [newUser, error] = await tryPromise(
        new UserService({ _id: parsedUser._id }).findOne()
    )

    if (error) return { isValid: false, user }
    if (!newUser) return { isValid: false, user }

    if (isAfter(new Date(), new Date(parsedUser.exp))) {
        return { isValid: false, user }
    }

    isValid = true
    return { isValid, user }
}

export const handleSocketRequest = async (io: Server) => {
    io.on("connection", async socket => {
        console.log(`${socket.id} is connected`)
        handleDM(io, socket);
        handleCommunityChat(io, socket);

        socket.on("disconnect", () => {
            socket.disconnect(true)
        })
    })
}

export const connectSocket = (app: any) => {
    const io = new Server(app, {
        cleanupEmptyChildNamespaces: true,
        addTrailingSlash: false,
        allowEIO3: true,
        cors: {
            origin: "*",
            credentials: true,
            optionsSuccessStatus: 200,
        },
    })

    io.use(async (socket, next) => {
        const token =
            socket.handshake.auth.authorization ||
            socket.handshake.auth["Authorization"]
        const { isValid, user } = await authenticateSocket(String(token))
        if (!isValid) {
            next(new Error("Invalid Access"))
        }
        socket.handshake.auth.user = user
        next()
    })

    handleSocketRequest(io);
}
