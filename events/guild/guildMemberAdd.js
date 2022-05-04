const Bot = require('../../structures/client')
const Discord = require('discord.js')

module.exports = {
    name: "guildMemberAdd",

    /**
     * 
     * @param {Bot} client 
     * @param {Discord.GuildMember} member
     */
    run: async (client, member) => {
        if (!member) return
        const { guild } = member
        if (!guild) return
        let currentInvites = await guild.invites.fetch().catch(e => { })
        if (!currentInvites) return
        let usedInvite = currentInvites.find(invite => invite.uses > client.invitesCache.get(`${invite.code}_${guild.id}`))
        if (!usedInvite) currentInvites.find(invite => !client.invitesCache.has(`${invite.code}_${guild.id}`))
        if (usedInvite) {
            client.invitesCache.set(`${usedInvite.code}_${guild.id}`, usedInvite.uses)
            let { inviter } = usedInvite
            print(`${member.user.tag} a rejoint le serveur ${guild.name} invité par ${inviter.tag}`)
            return client.emit("inviteFound", guild, member, usedInvite, inviter)
        } else if(guild.features.includes("VANITY_URL")){
            let cacheUses = client.vanityCache.get(`${guild.id}`)
            if(!cacheUses){
                return client.emit("noInviteFound", guild, member)
            } else {
                let vanityCurrent = await guild.fetchVanityData().catch(e=>{})
                if(!vanityCurrent) return client.emit("noInviteFound", guild, member)
                if(vanityCurrent.uses <= cacheUses) return client.emit("noInviteFound", guild, member)
                else return client.emit("inviteVanity", guild, member, vanityCurrent)
            }
        } else {
            return client.emit("noInviteFound", guild, member)
        }
    }
}