"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SortType = void 0;
const forgescript_1 = require("@tryforge/forgescript");
const util_1 = require("../../util");
var SortType;
(function (SortType) {
    SortType[SortType["asc"] = 0] = "asc";
    SortType[SortType["desc"] = 1] = "desc";
})(SortType || (exports.SortType = SortType = {}));
exports.default = new forgescript_1.NativeFunction({
    name: "$getUserLeaderboardValue",
    version: "2.0.0",
    description: "Returns the position of a user in the leaderboard of a specified variable",
    output: forgescript_1.ArgType.Number,
    unwrap: true,
    args: [
        {
            name: "variableName",
            description: "The name of the variable",
            rest: false,
            type: forgescript_1.ArgType.String,
            required: true,
        },
        {
            name: "sortType",
            description: "The sort type for the leaderboard: 'asc' (ascending) or 'desc' (descending)",
            rest: false,
            type: forgescript_1.ArgType.Enum,
            enum: SortType,
        }, {
            name: "userID",
            description: "The user ID of the value",
            rest: false,
            type: forgescript_1.ArgType.User,
            required: false,
        }
    ],
    brackets: true,
    async execute(ctx, [name, sortType, user]) {
        const data = await util_1.DataBase.find({ name, type: "user" });
        data.sort((a, b) => parseInt(a.value) - parseInt(b.value));
        const sortedData = ([SortType[0], SortType.asc].indexOf(sortType && sortType.toString() !== '' ? sortType : 'asc') === -1 ? [...data].reverse() : data);
        let rank = 0;
        let lastValue = null;
        let actualRank = 0;
        for (let i = 0; i < sortedData.length; i++) {
            const currentValue = sortedData[i].value;
            if (currentValue !== lastValue)
                actualRank = i + 1;
            lastValue = currentValue;
            if (sortedData[i].id === (user?.id ?? ctx.user?.id)) {
                rank = actualRank;
                break;
            }
        }
        return this.success(rank);
    },
});
//# sourceMappingURL=getUserLeaderboardValue.js.map