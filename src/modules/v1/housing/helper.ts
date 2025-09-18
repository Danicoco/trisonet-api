import { Request } from "express";

export const composeFilter = (req: Request) => {
    const { size, bed, restroom, title } = req.query
    let filter = {}

    if (title) filter = { ...filter, title };
    if (size) filter = { ...filter, size};
    if (bed) filter = { ...filter, bed };
    if (restroom) filter = { ...filter, restroom };

    return filter;
}