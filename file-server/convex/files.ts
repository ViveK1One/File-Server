import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";


export const creatFile = mutation({
    args:{
        name: v.string(),
    },

    async handler(ctx,args){
        const identity =await ctx.auth.getUserIdentity();

        if(!identity){
            throw new ConvexError("you must be logged in");
        }
        
        await ctx.db.insert("files",{
            name: args.name,
            // type: "image",
            // orgId: "",
            // fileId: undefined,
            // userId: undefined
        })

    }
    }
)

export const getFiles= query({
    args:{},
    async handler(ctx,args){
        
        const identity =await ctx.auth.getUserIdentity();
        
        if(!identity){
            return [];
        }


        return ctx.db.query('files').collect();
    }
})