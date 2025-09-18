/** @format */

import { DefaultEventsMap, Server, Socket } from "socket.io"
import DMService from "./service"
import ChatService from "../chats/service"
import UserService from "../users/service"
import { differenceInMinutes } from "date-fns"

export const handleDM = (
    io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
    socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
) => {
    socket.on("join-dm", roomId => {
        socket.join(roomId)
    })

    socket.on(
        "chat",
        async (
            { roomId, message, sender, receiver, dmId, chatId },
            callback
        ) => {
            if (chatId) {
                const chat = await new ChatService({ _id: chatId }).findOne()
                if (!chat) {
                    io.to(roomId).emit("chat-error", "Invalid chat")
                    return
                }
            }

            if (dmId) {
                const dbDM = await new DMService({ _id: dmId }).findOne()
                if (dbDM) {
                    await new DMService({ _id: dmId }).update({
                        lastMessage: message,
                        dateOfLastMessage: new Date(),
                        unread: {
                            sender: Number(dbDM?.unread?.sender || 0) + 1,
                            user: Number(dbDM?.unread?.user || 0) + 1,
                        },
                    })
                }
            }

            const [chat, dm] = await Promise.all([
                new ChatService({}).create({
                    roomId,
                    message,
                    sender,
                    receiver,
                    seen: false,
                    delievered: false,
                    ...(chatId && { replyTo: chatId }),
                }),
                !dmId
                    ? new DMService({}).create({
                          user: receiver,
                          sender,
                          lastMessage: message,
                          dateOfLastMessage: new Date(),
                          roomId,
                          unread: {
                              sender: 1,
                              user: 1,
                          },
                      })
                    : undefined,
            ])
            io.to(roomId).emit("chat-message", {
                ...chat,
                dmId: dmId || dm?._id,
            })
            if (callback) {
                // callback({ status: 'delivered' });
            }
        }
    )

    socket.on("read-chat", async ({ dmId, user }) => {
        const dbDM = await new DMService({ _id: dmId }).findOne()
        if (dbDM) {
            const isUser = dbDM.user === user
            await new DMService({ _id: dmId }).update({
                unread: {
                    sender: !isUser ? 0 : Number(dbDM.unread?.sender),
                    user: isUser ? 0 : Number(dbDM.unread?.user),
                },
            })
            io.to(dbDM?.roomId).emit("chat-read", { dmId: dbDM._id })
        }
    })

    socket.on("fetch-chat", async ({ page = 1, limit = 10, roomId }) => {
        const chats = await new ChatService({}).findAll(
            { roomId, removed: { $exists: false } },
            Number(page),
            Number(limit)
        )
        io.to(roomId).emit("chat-message", chats)
    })

    socket.on("delete-chat", async ({ chatId, by }) => {
        const [chat, user] = await Promise.all([
            new ChatService({ _id: String(chatId) }).findOne(),
            new UserService({ _id: String(by) }).findOne(),
        ])

        if (chat && user && chat.sender === String(user._id)) {
            await new ChatService({ _id: chat._id }).update({
                removed: {
                    date: new Date(),
                    deleteBy: {
                        _id: String(user._id),
                        name: `${user.firstName} ${user.lastName}`,
                    },
                },
            })
            io.to(chat.roomId).emit("delete-message", "Message Deleted")
        }
    })

    socket.on("edit-chat", async ({ chatId, by, message }) => {
        const [chat, user] = await Promise.all([
            new ChatService({ _id: String(chatId) }).findOne(),
            new UserService({ _id: String(by) }).findOne(),
        ])

        if (chat && user && chat.sender === String(user._id)) {
            if (
                differenceInMinutes(
                    new Date(),
                    new Date(chat?.updatedAt as string)
                ) >= 1
            ) {
                io.to(chat?.roomId).emit("edit-error", "Cannot edit chat")
                return
            }
            await new ChatService({ _id: chat._id }).update({ message })
            io.to(chat.roomId).emit("edit-message", "Message Deleted")
        }
    })
}
