const Command = require('../helpers/command');

class ShowsCommand extends Command {
    constructor(client) {
        super(client, {
            'description': 'Search for TV shows.',
            'usage': '<TV Show Name>',
            'documentation': true,
            'visible': true,
            'restricted': false,
            'weight': 450
        });
    }

    async process(message) {
        // Check for query
        if (!message.arguments[0]) return this.usageMessage(message);
        let query = message.arguments.join(' ');

        // Status of command response
        const status = await this.searchingMessage(message);

        // Advanced search
        const flags = this.util.flags(query);
        query = flags.query;

        // Get TV shows from API
        const TVShows = await this.api.dmdb.getTVShows(flags);
        if (TVShows.error) return this.embed.error(status, TVShows.error); // Error

        // Year flag
        TVShows.year = flags.year && /^\d{4}$/.test(flags.year) ? flags.year : 'All';;

        // Response
        this.embed.edit(status, {
            'title': 'Search Results',
            'description': this.resultDescription(TVShows),
            
            'fields': TVShows.results.map(TVShow => ({
                'name': TVShow.name,
                'value': this.joinResult([
                    `**${TVShow.index}**`,
                    `Vote Average: ${this.voteAverage(TVShow.vote_average)}`,
                    `First Air Date: ${this.releaseDate(TVShow.first_air_date)}`,
                    `${this.TMDbID(TVShow.id)}`
                ])
            })),

            'footer': message.db.guild.tips ?
                `TIP: Use flags (--year, --page) to get more and accurate results.` : ''
        });
    }
}

module.exports = ShowsCommand;
