const Bot = require('../../structures/client')
const Discord = require('discord.js')

module.exports = {
    name: "inviteDelete",

    /**
     * 
     * @param {Bot} client 
     * @param {Discord.Invite} invite
     */
    run: async (client, invite) => {
        client.invitesCache.delete(`${invite.code}_${invite.guild.id}`)
    }
}