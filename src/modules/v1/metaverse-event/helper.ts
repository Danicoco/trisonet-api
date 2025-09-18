/** @format */

export const createInvitationCode = (count: string) => {
    return `TRI-${
        count.length === 1
            ? `00000${count}`
            : count.length === 2
            ? `0000${count}`
            : count.length === 3
            ? `000${count}`
            : count.length === 4
            ? `00${count}`
            : count.length === 5
            ? `0${count}`
            : count
    }`
}
