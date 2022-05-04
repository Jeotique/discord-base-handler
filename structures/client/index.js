const { Client, Collection } = require('discord.js')
const fs = require('fs')
const mx = require('mxtorie-db')
module.exports = class Bot extends Client {
    constructor(options = { intents: 32767 }) {
        super(options)
        this.setMaxListeners(0)
        this.config = require('../../config')
        this.commands = new Collection()
        this.aliases = new Collection()
        this.initCommands()
        this.initEvents()
        this.db = new mx("./db.json")
        this.invitesCache = new Collection()
        this.vanityCache = new Collection()
        this.login(this.config.token)
    }

    initCommands() {
        const subFolders = fs.readdirSync('./commands')
        for (const category of subFolders) {
            const commandsFiles = fs.readdirSync(`./commands/${category}`).filter(file => file.endsWith('.js'))
            for (const commandFile of commandsFiles) {
                const command = require(`../../commands/${category}/${commandFile}`)
                command.category = category
                command.commandFile = commandFile
                this.commands.set(command.name, command)
                if (command.aliases && command.aliases.length > 0) {
                    command.aliases.forEach(alias => this.aliases.set(alias, command))
                }
            }
        }
    }

    initEvents() {
        const subFolders = fs.readdirSync(`./events`)
        for (const category of subFolders) {
            const eventsFiles = fs.readdirSync(`./events/${category}`).filter(file => file.endsWith(".js"))
            for (const eventFile of eventsFiles) {
                const event = require(`../../events/${category}/${eventFile}`)
                this.on(event.name, (...args) => event.run(this, ...args))
                if (category === 'anticrash') process.on(event.name, (...args) => event.run(this, ...args))
            }
        }
    }
}