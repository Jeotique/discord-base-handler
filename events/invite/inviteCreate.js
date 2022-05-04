const Bot = require('../../structures/client')
const Discord = require('discord.js')

module.exports = {
    name: "inviteCreate",

    /**
     * 
     * @param {Bot} client 
     * @param {Discord.Invite} invite
     */
    run: async (client, invite) => {
        client.invitesCache.set(`${invite.code}_${invite.guild.id}`, invite.uses)
    }
}