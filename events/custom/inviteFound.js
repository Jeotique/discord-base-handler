const Bot = require('../../structures/client')
const Discord = require('discord.js')

module.exports = {
    name: "inviteFound",

    /**
     * 
     * @param {Bot} client 
     * @param {Discord.Guild} guild
     * @param {Discord.GuildMember} member
     * @param {Discord.Invite} invite
     * @param {Discord.User} inviteUser
     */
    run: async (client, guild, member, invite, inviteUser) => {
        const channel = client.channels.cache.find(c => c.id === "971404840473362463")

        if (member.id === inviteUser.id) {
            return channel.send(`${member} s'est auto invité, celle-ci ne sera pas compté`)
        } else {

            let invitesOfUser = client.db.get(`invites_${inviteUser.id}_${guild.id}`) || {
                total: 0,
                valid: 0,
                left: 0,
                bonus: 0
            }

            invitesOfUser["total"]++
            invitesOfUser["valid"]++
            client.db.set(`invites_${inviteUser.id}_${guild.id}`, invitesOfUser)
            client.db.set(`whoinviteme_${member.id}_${guild.id}`, inviteUser.id)
            channel.send(`${member} a été invité par **${inviteUser.tag}** qui a maintenant ${invitesOfUser.valid} invitation(s)`)
        }
    }
}