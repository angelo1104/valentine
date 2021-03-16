import {SchemaDirectiveVisitor, ForbiddenError} from "apollo-server-micro"
import {defaultFieldResolver} from "graphql";
import dns from "dns"

const dnsPromises = dns.promises

class AuthorizedIPDirective extends SchemaDirectiveVisitor{
    visitFieldDefinition(field) {
        const resolver = field.resolve || defaultFieldResolver

        field.resolve = async (root, {...rest}, ctx, info)=>{
            const parseIp = (req) =>
                (typeof req.headers['x-forwarded-for'] === 'string'
                    && req.headers['x-forwarded-for'].split(',').shift())
                || req.connection?.remoteAddress
                || req.socket?.remoteAddress
                || req.connection?.socket?.remoteAddress

            const ip = parseIp(ctx.req)

            const url = new URL(rest.input.address)

            const lookup = await dnsPromises.lookup(url.hostname)

            if (lookup.address !== ip){
                // the node is not on the ip of node that is a hacker
                throw new ForbiddenError("You can't add somebody elses ip as a node.")
            }

            const result = await resolver.call(this, root, rest, ctx, info);

            return result;
        }
    }
}

export default AuthorizedIPDirective