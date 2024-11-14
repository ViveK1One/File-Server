import { ConvexError, v } from "convex/values";
import { mutation, MutationCtx, query, QueryCtx } from "./_generated/server";
import { getUser } from "./users";

async function hasAccessToOrg(ctx: QueryCtx | MutationCtx ,
    tokenIdentifier:string,orgId:string) {
    
        const user= await getUser(ctx, tokenIdentifier);
       
        const hasAccess = 
        user.orgIds.includes(orgId) || 
        user.tokenIdentifier.includes(orgId);
    
        return hasAccess;
}

export const creatFile = mutation({
    args:{
        name: v.string(),
        orgId: v.string()
    },

    async handler(ctx,args){
        const identity =await ctx.auth.getUserIdentity();

        //console.log(identity);

        if(!identity){
            throw new ConvexError("you must be logged in");
        }
        
        const hasAccess = await hasAccessToOrg(ctx,identity.tokenIdentifier,args.orgId)
        
        //const user= await getUser(ctx, identity.tokenIdentifier);
       
        // const hasAccess = 
        // user.orgIds.includes(args.orgId) || 
        // user.tokenIdentifier.includes(args.orgId);

        // console.log(hasAccess);
        // console.log(user.orgIds)
        // console.log(user.tokenIdentifier,identity.tokenIdentifier)
        

        if(!hasAccess) {
            throw new ConvexError("you do not have access to this org")
        }


        // if(!user.orgIds.includes(args.orgId) && user.tokenIdentifier!== identity.tokenIdentifier){
        //     throw new ConvexError("you do not have access to this org")
        // }
        
        // identity.tokenIdentifier

        await ctx.db.insert("files",{
            name: args.name,
            // type: "image",
             orgId: args.orgId,
            // fileId: undefined,
            // userId: undefined
        })

    }
    }
)

export const getFiles= query({
    args:{
        orgId: v.string()
    },
    async handler(ctx,args){
        
        const identity =await ctx.auth.getUserIdentity();
        
        if(!identity){
            return [];
        }

        const hasAccess = await hasAccessToOrg(
            ctx,
            identity.tokenIdentifier,
            args.orgId)

            if(!hasAccess){
                return [];
            }

        return ctx.db
        .query('files')
        .withIndex('by_orgID', (q) => q.eq('orgId', args.orgId))
        .collect();
        
    }
})