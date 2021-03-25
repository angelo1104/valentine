import {SchemaDirectiveVisitor, ForbiddenError} from "apollo-server-micro"
import {defaultFieldResolver} from "graphql";
import dns from "dns"
import requestIp from "request-ip"

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

            const clientIp = requestIp.getClientIp(ctx.req)

            const url = new URL(rest.input.address)

            const lookup = await dnsPromises.lookup(url.hostname)


            // check if the node is on localhost. He can already manipulate everything by going into mongo db. It is useless to deny any access to him by adding complexity
            if (lookup.address !== clientIp && clientIp !== "127.0.0.1"){
                // the node is not on the ip of node that is a hacker
                throw new ForbiddenError("You can't add somebody elses ip as a node.")
            }

            const result = await resolver.call(this, root, rest, ctx, info);

            return result;
        }
    }
}

export default AuthorizedIPDirective