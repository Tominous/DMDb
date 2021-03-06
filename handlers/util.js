class UtilHelper {
    removeFileExtension(file) {
        const fileMatch = file.match(/(\w+)\.(\w+)/i);
        return fileMatch ? fileMatch[1] : file;
    }

    list(array) {
        return array.join(', ');
    }

    deleteRequireCache(file) {
        delete require.cache[require.resolve(file)];
    }

    chunkArray(array, chunkSize) {
        const tempArray = array.slice();
        const chunks = [];

        while (tempArray.length > 0)
            chunks.push(tempArray.splice(0, chunkSize));

        return chunks;
    }

    flags(query) {
        const words = query.split(' ');
        const response = {};

        for (let i = 0; i < words.length; i++) {
            const word = words[i];
            if (!word) continue;
            
            if (word.startsWith('--')) {
                const flagName = word.slice(2);
                const flagValue = words[i + 1];

                if (flagName !== 'query' && flagValue)
                    response[flagName] = flagValue;

                words.splice(i, 2);
                i = i - 2;
            }

            if (word.startsWith('++')) {
                const flagName = word.slice(2);
                
                if (flagName !== 'query')
                    response[flagName] = true;

                words.splice(i, 1);
                i = i - 1;
            }
        }

        response.query = words.join(' ');
        return response;
    }
}

module.exports = UtilHelper;
