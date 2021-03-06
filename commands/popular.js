const Command = require('../helpers/command');

class PopularCommand extends Command {
    constructor(client) {
        super(client, {
            'description': 'Most popular movies on TMDb.',
            'usage': null,
            'documentation': true,
            'visible': true,
            'restricted': false,
            'weight': 100
        });
    }

    async process(message) {
        // Query?
        let query = message.arguments.join(' ');

        // Status of command response
        const status = await this.searchingMessage(message);

        // Advanced search
        const flags = this.util.flags(query);
        query = flags.query;

        // Show flag
        const show = flags.shows;

        // Get movies from API
        const popular = show ? await this.api.dmdb.getPopularTVShows(flags) :
            await this.api.dmdb.getPopularMovies(flags);
        if (popular.error) return this.embed.error(popular);

        // Response
        this.embed.edit(status, {
            'title': `Popular ${show ? 'TV Shows' : 'Movies'}`,
            'description': this.resultDescription(popular),

            'fields': popular.results.map((result) => ({
                'name': result.title || result.name,
                'value': this.joinResult([
                    `**${result.index}**`,
                    `${show ? 'First Air Date' : 'Release Date'}: ` +
                        `${this.releaseDate(result.release_date || result.first_air_date)}`,
                    `Vote Average: ${this.voteAverage(result.vote_average)}`,
                    `${this.TMDbID(result.id)}`
                ])
            }))
        });
    }
}

module.exports = PopularCommand;
