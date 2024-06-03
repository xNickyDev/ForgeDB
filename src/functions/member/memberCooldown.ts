import { ArgType, IExtendedCompiledFunctionField, NativeFunction } from "@tryforge/forgescript"
import { DataBase } from "../../database"

export default new NativeFunction({
    name: "$memberCooldown",
    version: "2.0.0",
    description: "Adds a cooldown to a command for a member",
    brackets: true,
    unwrap: false,
    args: [
        {
            name: "duration",
            description: "The duration of the cooldown",
            rest: false,
            type: ArgType.Time,
            required: true,
        },
        {
            name: "code",
            description: "The code to execute if the cooldown is active",
            rest: false,
            type: ArgType.String,
        },{
            name: "guild ID",
            description: "The guild id where the member belongs to",
            rest: false,
            type: ArgType.Guild,
            required: false
        },{
            name: "member ID",
            description: "The member id of the variable",
            rest: false,
            type: ArgType.User,
            required: false,
        }
    ],
    async execute(ctx) {
        const [, code] = this.data.fields! as IExtendedCompiledFunctionField[]
        const dur = await this["resolveUnhandledArg"](ctx, 0)
        if (!this["isValidReturnType"](dur)) return dur
        
        const idV = await this["resolveUnhandledArg"](ctx, 3)
        if (!this["isValidReturnType"](idV)) return idV

        const guildV = await this["resolveUnhandledArg"](ctx, 2)
        if (!this["isValidReturnType"](idV)) return guildV
        
        const cooldown = await DataBase.cdTimeLeft(`${ctx.cmd?.name}_${guildV?.value?.id ?? ctx.guild?.id}_${idV.value?.id ?? ctx.user?.id}_member`)

        if(cooldown !== 0) {
            const content = await this["resolveCode"](ctx, code)
            if (!this["isValidReturnType"](content)) return content
            ctx.container.content = content.value as string
            await ctx.container.send(ctx.obj)
            return this.stop()
        }

        await DataBase.cdAdd({id: `${ctx.cmd?.name}_${guildV?.value?.id ?? ctx.guild?.id}_${idV.value?.id ?? ctx.user?.id}_member` as string, duration: dur.value as number})

        return this.success()
    },
})