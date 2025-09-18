/** @format */

export const communityPipeline = (userId: string, filter: any = {}) => [
    {
        $match: { ...filter },
    },
    {
        $sort: {
            createdAt: -1,
        },
    },
    {
        $lookup: {
            let: {
                userId: {
                    $toString: userId,
                },
                communityId: { $toString: "$_id" },
            },
            from: "community-members",
            pipeline: [
                {
                    $match: {
                        $expr: {
                            $and: [
                                { $eq: ["$user", "$$userId"] },
                                {
                                    $eq: ["$community", "$$communityId"],
                                },
                            ],
                        },
                    },
                },
            ],
            as: "userResult",
        },
    },
    {
        $lookup: {
            let: {
                userId: {
                    $toObjectId: "$user",
                },
            },
            from: "users",
            pipeline: [
                {
                    $match: {
                        $expr: {
                            $and: [{ $eq: ["$_id", "$$userId"] }],
                        },
                    },
                },
                {
                    $project: {
                        firstName: 1,
                        lastName: 1,
                        avatar: 1,
                    },
                },
            ],
            as: "user",
        },
    },
    {
        $lookup: {
            let: {
                userId: {
                    $toString: userId,
                },
                communityId: { $toString: "$_id" },
            },
            from: "community-chats",
            pipeline: [
                {
                    $match: {
                        $expr: {
                            $and: [
                                { $eq: ["$sender", "$$userId"] },
                                {
                                    $eq: ["$community", "$$communityId"],
                                },
                                { $not: { $in: ["$$userId", "$readBy"] } },
                            ],
                        },
                    },
                },
                { $count: "message" },
            ],
            as: "unreadMessages",
        },
    },
    {
        $addFields: {
            isMember: {
                $gt: [{ $size: "$userResult" }, 0],
            },
            user: { $arrayElemAt: ["$user", 0] },
            unreadCount: {
                $ifNull: [
                    {
                        $arrayElemAt: ["$unreadMessages.message", 0],
                    },
                    0,
                ],
            },
        },
    },
    {
        $project: {
            userResult: 0,
        },
    },
]
