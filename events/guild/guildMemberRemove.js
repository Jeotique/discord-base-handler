const Bot = require('../../structures/client')
const Discord = require('discord.js')

module.exports = {
    name: "guildMemberRemove",

    /**
     * 
     * @param {Bot} client 
     * @param {Discord.GuildMember} member
     */
    run: async (client, member) => {
        if (!member) return
        const { guild } = member
        if (!guild) return
        const channel = client.channels.cache.find(c => c.id === "971404840473362463")
        let whoInvite = client.db.get(`whoinviteme_${member.id}_${guild.id}`)
        if(!whoInvite){
            return channel.send(`${member} a quitté le serveur, je ne sais pas qui l'avait invité.`)
        } else {
            let user = client.users.cache.find(u => u.id === whoInvite)
            if(!user){
                return channel.send(`${member} a quitté le serveur, je ne sais pas qui l'avait invité.`)
            } else {
                let invitesOfUser = client.db.get(`invites_${user.id}_${guild.id}`) || {
                    total: 0,
                    valid: 0,
                    left: 0,
                    bonus: 0
                }
                invitesOfUser['valid']--
                invitesOfUser['left']++
                client.db.set(`invites_${user.id}_${guild.id}`, invitesOfUser)
                return channel.send(`${member} a quitté le serveur, il avait été invité par ${user} qui a maintenant ${invitesOfUser.valid} invitation(s)`)
            }
        }
    }
}