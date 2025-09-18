/** @format */

import { DefaultEventsMap, Server, Socket } from "socket.io"
import CommunityChatService from "./service"
import UserService from "../users/service"
import CommunityService from "../community/service"
import { differenceInMinutes } from "date-fns"

export const handleCommunityChat = (
    io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
    socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
) => {
    socket.on("join-community", communityId => {
        socket.join(communityId)
        console.log(`User ${socket.id} joined room ${communityId}`)
    })

    socket.on(
        "community-chat",
        async ({ roomId, message, sender, community, chatId }, _callback) => {
            if (chatId) {
                const chat = await new CommunityChatService({ _id: chatId }).findOne();
                if (!chat) {
                    io.to(roomId).emit("chat-error", "Invalid chat")
                    return;
                }
            }
            await Promise.all([
                new CommunityChatService({}).create({
                    roomId,
                    message,
                    sender,
                    community,
                    readBy: [sender],
                    ...(chatId && { replyTo: chatId })
                }),
            ])
            io.to(roomId).emit("community-message", { message, sender })
        }
    )

    socket.on("read-community-chat", async ({ user, community, lastSeenMessageId }) => {
        const lastMessage = await new CommunityChatService({ community, _id: lastSeenMessageId }).findOne()
        if (lastMessage) {
            await new CommunityChatService({}).readUnSeenMessages(community, user, lastMessage.createdAt as string);
            io.to(lastMessage.roomId).emit("read-message", lastMessage)
        }
    })

    socket.on("fetch-community-chat", async ({ page, limit, roomId }) => {
        const chats = await new CommunityChatService({}).findAll(
            { roomId, removed: { $exists: false } },
            Number(page),
            Number(limit)
        )
        io.to(roomId).emit("chat-message", chats)
    })

    socket.on("delete-community-chat", async ({ chatId, by }) => {
        const [chat, user] = await Promise.all([
            new CommunityChatService({ _id: chatId }).findOne(),
            new UserService({ _id: by }).findOne(),
        ])
        if (chat && user && String(user._id) === chat.sender) {
            if (
                differenceInMinutes(
                    new Date(),
                    new Date(chat?.updatedAt as string)
                ) >= 1
            ) {
                io.to(chat?.roomId).emit("edit-error", "Cannot edit chat")
                return
            }
            await new CommunityChatService({ _id: chat._id }).update({
                removed: {
                    deleteBy: {
                        _id: String(user._id),
                        name: `${user.firstName} ${user.lastName}`,
                    },
                    date: new Date(),
                },
            })
            io.to(chat.roomId).emit("deleted-message", "")
        }
    })

    socket.on("edit-community-chat", async ({ chatId, by, message }) => {
        const [chat, user] = await Promise.all([
            new CommunityChatService({ _id: chatId }).findOne(),
            new UserService({ _id: by }).findOne(),
        ])
        if (chat && user && String(user._id) === chat.sender) {
            await new CommunityChatService({ _id: chat._id }).update({
                message,
            })
            io.to(chat.roomId).emit("edit-message", "")
        }
    })
}

export const getGeneralCommunity = async () => {
    const generalGroupName = "TRISONET COMMUNITY"
    let community = await new CommunityService({
        name: generalGroupName,
    }).findOne()
    if (!community) {
        community = await new CommunityService({}).create({
            name: generalGroupName,
            description: "One Family of Trisonet",
            privacy: "public",
            avatar: "",
            inviteLink: "",
            numberOfParticipant: 1,
            user: "684d48bc9a8bc3a716a034df",
            dateOfLastMessage: new Date().toISOString(),
            lastMessage: "",
        })
    }

    return community
}
