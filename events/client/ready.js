const Bot = require('../../structures/client')
const Discord = require('discord.js')

module.exports = {
    name: "ready",

    /**
     * 
     * @param {Bot} client 
     */
    run: async (client) => {
        print(`${client.user.tag} prêt`)
        client.guilds.cache.map(async guild => {
            guild.invites.fetch().then(async invites => {
                let cacheCount = invites.size
                let index = 0
                for (const [, invite] of invites) {
                    client.invitesCache.set(`${invite.code}_${guild.id}`, invite.uses)
                    index++
                    if(index === cacheCount) return print(client.invitesCache)
                }
            }).catch(e => {
                return print("Une erreur est survenue lors de la mise en cache des invitations : " + e)
            })
            if (!guild.features.includes("VANITY_URL")) return
            guild.fetchVanityData().then(async vanity => {
                client.vanityCache.set(`${guild.id}`, vanity.uses)
            }).catch(e => {
                return print("Une erreur est survenue lors de la mise en cache des vanity : " + e)
            })
        })
    }
}