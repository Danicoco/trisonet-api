import { Request } from "express";

export const composeFilter = (req: Request) => {
    const { paid, free, title } = req.query
    let filter = {}

    if (paid) filter = { ...filter, amount: { $gte: 0 } };
    if (free) filter = { ...filter, amount: { $eq: 0 } };
    if (title) filter = { ...filter, title };

    return filter;
}